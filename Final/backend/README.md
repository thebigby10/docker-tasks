# Task Queue Backend

A mini project demonstrating PostgreSQL, Redis, and Worker integration with Express.js and TypeScript.

## Features

- **Express API**: RESTful endpoints for task management
- **PostgreSQL**: Persistent storage for tasks and jobs
- **Redis**: In-memory queue for task distribution
- **Worker**: Background job processor with retry logic

## Architecture

```
┌─────────────┐
│  Express    │ (REST API on port 3000)
│  Server     │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       v                  v
   PostgreSQL          Redis Queue
   (Tasks DB)      (Job Distribution)
       │                  │
       │                  v
       └─────────────────────────
                   │
                   v
             ┌──────────────┐
             │   Worker     │
             │  (Process    │
             │   Jobs)      │
             └──────────────┘
```

## Project Structure

```
├── src/
│   ├── db.ts           # PostgreSQL connection
│   ├── redis.ts        # Redis client and operations
│   ├── index.ts        # Express server
│   ├── worker.ts       # Background worker
│   ├── types/
│   │   └── index.ts    # TypeScript interfaces
│   ├── migrations/
│   │   └── init.ts     # Database schema initialization
│   └── seeds/
│       └── seed.ts     # Sample data insertion
├── package.json
├── tsconfig.json
└── .env.example        # Environment variables template
```

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ running locally
- Redis 6+ running locally

### Setup

1. **Clone the environment file and configure it**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

2. **Install dependencies**
```bash
npm install
```

3. **Build TypeScript**
```bash
npm run build
```

4. **Run migrations**
```bash
npm run migrate
```

5. **Seed database (optional)**
```bash
npm run db:seed
```

6. **Start the server** (in one terminal)
```bash
npm run dev
```

7. **Start the worker** (in another terminal)
```bash
npm run worker
```

The server will be available at `http://localhost:3000`

## API Endpoints

### Health Check
```bash
GET /health
```

### Tasks

**Create Task**
```bash
POST /tasks
Content-Type: application/json

{
  "title": "Process data",
  "description": "Process user data"
}
```

**List All Tasks**
```bash
GET /tasks
```

**Get Task by ID**
```bash
GET /tasks/:id
```

**Get Tasks by Status**
```bash
GET /tasks/status/:status
# status: pending, processing, completed, failed
```

**Update Task Status**
```bash
PATCH /tasks/:id
Content-Type: application/json

{
  "status": "processing"
}
```

**Delete Task**
```bash
DELETE /tasks/:id
```

**Get Statistics**
```bash
GET /stats
# Returns: total, pending, processing, completed, failed counts
```

## Environment Variables

```
DATABASE_URL              # PostgreSQL connection string
POSTGRES_USER            # Database user
POSTGRES_PASSWORD        # Database password
POSTGRES_DB              # Database name
REDIS_URL                # Redis connection string
PORT                     # Server port (default: 3000)
NODE_ENV                 # Environment (development/production)
WORKER_CONCURRENCY       # Parallel task processing (default: 5)
WORKER_POLL_INTERVAL     # Queue polling interval in ms (default: 1000)
```

## Workflow

1. **Task Creation**: Client creates a task via REST API
2. **Queue Push**: Task is immediately pushed to Redis queue
3. **Processing**: Worker picks up job from queue
4. **Retry Logic**: If processing fails, task is retried (max 3 times)
5. **Completion**: Task status updates to completed or failed
6. **Query**: Client can check task status at any time

## Database Schema

### Tasks Table
```sql
id              UUID PRIMARY KEY
title           VARCHAR(255)
description     TEXT
status          VARCHAR(50) -- pending, processing, completed, failed
retries         INTEGER
max_retries     INTEGER
error           TEXT
result          TEXT (JSON)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Jobs Table
```sql
id              UUID PRIMARY KEY
task_id         UUID (FK to tasks)
payload         JSONB
status          VARCHAR(50)
created_at      TIMESTAMP
```

## Running Tests

```bash
# Build the project
npm run build

# Run TypeScript compiler check
npx tsc --noEmit
```

## Troubleshooting

**Connection refused to PostgreSQL**
- Ensure PostgreSQL is running
- Check DATABASE_URL environment variable
- Verify credentials in .env

**Redis connection failed**
- Ensure Redis is running
- Check REDIS_URL environment variable
- Verify port 6379 is not blocked

**Worker not processing tasks**
- Check worker logs
- Verify Redis queue name matches
- Ensure database connection is working

## Development Commands

```bash
npm run dev              # Start server in dev mode
npm run worker           # Start background worker
npm run build            # Compile TypeScript
npm run migrate          # Run database migrations
npm run db:seed          # Seed database with sample data
```



## Performance Considerations

- Worker concurrency is configurable (default: 5)
- Redis provides fast queue operations (O(1) push/pop)
- PostgreSQL handles concurrent read/write operations
- Database indexes on status column for fast filtering

## Next Steps

- Add authentication/authorization
- Implement task scheduling
- Add task progress tracking
- Create monitoring dashboard
- Add email notifications on task completion
- Implement webhook callbacks

## License

MIT
