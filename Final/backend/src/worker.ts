import dotenv from 'dotenv';
import { query } from './db';
import { popFromQueue, initRedis, getQueueLength } from './redis';
import { Task } from './types';

dotenv.config();

const QUEUE_NAME = 'tasks:queue';
const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || '5');
const POLL_INTERVAL = parseInt(process.env.WORKER_POLL_INTERVAL || '1000');

async function processTask(taskId: string, payload: any): Promise<boolean> {
  try {
    console.log(`[Worker] Processing task: ${taskId}`);

    // Simulate some processing
    const processingTime = Math.random() * 3000;
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // Randomly simulate failures for demonstration
    if (Math.random() < 0.2) {
      throw new Error('Random processing error');
    }

    // Update task status to completed
    await query(
      `UPDATE tasks 
       SET status = $1, result = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [
        'completed',
        JSON.stringify({
          processed: true,
          duration: processingTime,
          originalPayload: payload,
        }),
        taskId,
      ]
    );

    console.log(`[Worker] ✓ Task completed: ${taskId}`);
    return true;
  } catch (error) {
    console.error(`[Worker] ✗ Task failed: ${taskId}`, error);

    // Get current retry count
    const taskResult = await query(
      `SELECT retries, max_retries FROM tasks WHERE id = $1`,
      [taskId]
    );

    if (taskResult.rows.length === 0) return false;

    const { retries, max_retries } = taskResult.rows[0];

    if (retries < max_retries) {
      // Re-queue the task
      await query(
        `UPDATE tasks 
         SET retries = retries + 1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [taskId]
      );
      console.log(
        `[Worker] Retrying task ${taskId} (${retries + 1}/${max_retries})`
      );
      return false;
    } else {
      // Max retries exceeded
      await query(
        `UPDATE tasks 
         SET status = $1, error = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        ['failed', (error as Error).message, taskId]
      );
      console.log(`[Worker] Task failed after max retries: ${taskId}`);
      return false;
    }
  }
}

async function worker() {
  try {
    await initRedis();
    console.log('[Worker] Started');
    console.log(`[Worker] Concurrency: ${CONCURRENCY}, Poll Interval: ${POLL_INTERVAL}ms`);

    let activeWorkers = 0;

    const processQueue = async () => {
      while (true) {
        try {
          const queueLength = await getQueueLength(QUEUE_NAME);

          if (activeWorkers < CONCURRENCY && queueLength > 0) {
            const job = await popFromQueue(QUEUE_NAME);

            if (job) {
              activeWorkers++;

              processTask(job.task_id, job.payload)
                .finally(() => {
                  activeWorkers--;
                });
            }
          }

          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        } catch (error) {
          console.error('[Worker] Error in processQueue:', error);
          await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        }
      }
    };

    // Start processing
    processQueue();
  } catch (error) {
    console.error('[Worker] Fatal error:', error);
    process.exit(1);
  }
}

worker();
