import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.warn('\n⚠️  [StudySpace] Notice: MONGODB_URI not provided. Set MONGODB_URI in .env to connect to MongoDB Atlas.\n');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 [StudySpace] Backend API running at http://localhost:${PORT}`);
      console.log(`📚 [StudySpace] Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
