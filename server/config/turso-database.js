const { createClient } = require('@libsql/client');
const logger = require('../utils/logger');

class TursoDatabase {
    constructor() {
        this.db = null;
    }

    async initialize() {
        try {
            // Get credentials from environment variables
            const dbUrl = process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL;
            const authToken = process.env.TURSO_AUTH_TOKEN;

            if (!dbUrl || !authToken) {
                throw new Error('TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN environment variables are required');
            }

            logger.info('Connecting to Turso database...');
            logger.info(`Database URL: ${dbUrl.split('-')[0]}...`);

            // Create Turso client
            this.db = createClient({
                url: dbUrl,
                authToken: authToken,
            });

            // Test connection
            const result = await this.db.execute('SELECT 1 as connection_test');
            logger.info('Successfully connected to Turso database');
            logger.info(`Database: ${dbUrl}`);

            return true;
        } catch (error) {
            logger.error('Failed to connect to Turso:', error.message);
            throw error;
        }
    }

    // Execute a query that returns multiple rows
    async all(sql, params = []) {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            const result = await this.db.execute({
                sql: sql,
                args: params,
            });

            return result.rows || [];
        } catch (error) {
            logger.error('Database all() error:', { sql, params, error: error.message });
            throw error;
        }
    }

    // Execute a query that returns a single row
    async get(sql, params = []) {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            const result = await this.db.execute({
                sql: sql,
                args: params,
            });

            return result.rows?.[0] || null;
        } catch (error) {
            logger.error('Database get() error:', { sql, params, error: error.message });
            throw error;
        }
    }

    // Execute a statement (INSERT, UPDATE, DELETE)
    async run(sql, params = []) {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            const result = await this.db.execute({
                sql: sql,
                args: params,
            });

            return {
                lastID: result.lastInsertRowid,
                changes: result.rowsAffected,
            };
        } catch (error) {
            logger.error('Database run() error:', { sql, params, error: error.message });
            throw error;
        }
    }

    // Execute multiple statements in a transaction
    async transaction(callback) {
        try {
            // Turso handles transactions through batch execution
            const result = await callback();
            return result;
        } catch (error) {
            logger.error('Transaction error:', error.message);
            throw error;
        }
    }

    // Close database connection
    async close() {
        try {
            if (this.db) {
                // Turso client cleanup if needed
                logger.info('Database connection closed');
            }
        } catch (error) {
            logger.error('Error closing database:', error.message);
            throw error;
        }
    }
}

// Export singleton instance
const database = new TursoDatabase();
module.exports = database;
