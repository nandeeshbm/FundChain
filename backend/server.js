const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const { startEventListeners } = require('./services/eventListenerService');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start blockchain event listeners
  try {
    await startEventListeners();
    console.log('Blockchain event listeners initialized');
  } catch (err) {
    console.warn('Event listeners failed to start (non-fatal):', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
