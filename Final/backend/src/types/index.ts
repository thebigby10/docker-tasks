export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retries: number;
  max_retries: number;
  error?: string;
  result?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Job {
  id: string;
  task_id: string;
  payload: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: Date;
}
