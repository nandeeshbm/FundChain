const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const { startEventListeners } = require('./services/eventListenerService');

const startServer = async () => {
  await connectDB();

  try {
    await startEventListeners();
    console.log('Blockchain event listeners initialized');
  } catch (err) {
    console.warn('Event listeners failed to start (non-fatal):', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Exiting so nodemon can restart cleanly.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
