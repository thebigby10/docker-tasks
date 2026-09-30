import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
  try {
    console.log('Ensuring tables exist...');

    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        retries INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,
        error TEXT,
        result TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        payload JSONB,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`);

    console.log('✓ Tables ready');
    console.log('Seeding database...');

    // Insert sample tasks
    const taskIds = [];
    for (let i = 0; i < 5; i++) {
      const result = await query(
        `INSERT INTO tasks (title, description, max_retries)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [
          `Sample Task ${i + 1}`,
          `This is a sample task for demonstration purposes`,
          3,
        ]
      );
      taskIds.push(result.rows[0].id);
    }

    console.log('✓ Inserted 5 sample tasks');

    // Insert sample jobs for each task
    for (const taskId of taskIds) {
      await query(
        `INSERT INTO jobs (task_id, payload)
         VALUES ($1, $2)`,
        [
          taskId,
          JSON.stringify({
            action: 'process_data',
            data: Math.random().toString(36).substring(7),
          }),
        ]
      );
    }

    console.log('✓ Inserted sample jobs');
    console.log('✓ Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
