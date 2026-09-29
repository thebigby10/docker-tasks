const express = require('express');
const { pool, initializeDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize database on startup
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

/**
 * GET /
 * Retrieve all logs from the database
 */
app.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, timestamp, created_at FROM logs ORDER BY id DESC'
    );
    res.json({
      success: true,
      count: result.rows.length,
      logs: result.rows,
    });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve logs',
    });
  }
});

/**
 * POST /log
 * Log the current datetime to the database
 */
app.post('/log', async (req, res) => {
  try {
    const now = new Date();
    const result = await pool.query(
      'INSERT INTO logs (timestamp) VALUES ($1) RETURNING id, timestamp, created_at',
      [now]
    );
    res.json({
      success: true,
      message: 'Log entry created',
      log: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating log entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create log entry',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`GET  http://localhost:${PORT}/ - Retrieve all logs`);
  console.log(`POST http://localhost:${PORT}/log - Create a new log entry`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});
