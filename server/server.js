require('dotenv').config();
const database = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
// Bind to 0.0.0.0 by default to allow port forwarding / external access
const HOST = process.env.HOST || '0.0.0.0';

logger.info('='.repeat(60));
logger.info('RODB Server Starting');
logger.info(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
logger.info(`PORT: ${PORT}`);
logger.info(`HOST: ${HOST}`);
logger.info(`DB_PATH: ${process.env.DB_PATH || 'default (./server/data/rodb.db)'}`);
logger.info('='.repeat(60));

// Routes are defined in app.js - no need to redefine here

let server;

async function startServer() {
    try {
        // Initialize database FIRST before loading app (which loads routes/models)
        logger.info('Initializing database...');
        await database.initialize();
        logger.info('✓ Database initialized successfully');
        
        // NOW load the app after database is ready
        logger.info('Loading Express app...');
        const app = require('./app');
        logger.info('✓ Express app loaded');

        // Auto-publish approved articles
        try {
            const Article = require('./models/Article');
            const publishedCount = await Article.autoPublishApproved();
            logger.info(`Auto-published ${publishedCount} approved articles (if any).`);
        } catch (err) {
            logger.error('Auto-publish error:', err);
        }

        // Start server
        server = app.listen(PORT, HOST, () => {
            logger.info('='.repeat(60));
            logger.info('✓ Server running successfully!');
            logger.info(`  URL: http://${HOST}:${PORT}`);
            logger.info(`  Admin: http://${HOST}:${PORT}/admin (Ctrl+Alt+A)`);
            logger.info(`  Health: http://${HOST}:${PORT}/api/health`);
            logger.info('='.repeat(60));
        });

        // Graceful shutdown
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        logger.error('='.repeat(60));
        logger.error('✗ Failed to start server:');
        logger.error(error);
        logger.error('='.repeat(60));
        process.exit(1);
    }
}

async function gracefulShutdown() {
    logger.info('Received shutdown signal, closing server gracefully...');

    if (server) {
        server.close(async () => {
            logger.info('HTTP server closed');

            try {
                await database.close();
                logger.info('Database connection closed');
                process.exit(0);
            } catch (error) {
                logger.error('Error closing database:', error);
                process.exit(1);
            }
        });
    }
}

// Start the server
startServer();
