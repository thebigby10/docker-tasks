# Express Logger App

A simple Express.js application that logs timestamps to a PostgreSQL database.

## Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (running and accessible)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL credentials if needed:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logs_db
```

4. Create the database (if it doesn't exist):
```bash
createdb logs_db
```

### Running the App

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### GET /
Retrieve all logged timestamps

**Response:**
```json
{
  "success": true,
  "count": 2,
  "logs": [
    {
      "id": 1,
      "timestamp": "2024-01-15T10:30:00.000Z",
      "created_at": "2024-01-15T10:30:00.123Z"
    }
  ]
}
```

### POST /log
Create a new log entry with the current datetime

**Response:**
```json
{
  "success": true,
  "message": "Log entry created",
  "log": {
    "id": 1,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "created_at": "2024-01-15T10:30:00.123Z"
  }
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok"
}
```

## Database Schema

The `logs` table:
```sql
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- `id`: Auto-incrementing primary key
- `timestamp`: The logged datetime
- `created_at`: When the record was inserted (auto-generated)

## Testing with cURL

```bash
# Create a log entry
curl -X POST http://localhost:3000/log

# Retrieve all logs
curl http://localhost:3000/log

# Health check
curl http://localhost:3000/health
```
