const database = require('../server/config/database');
const logger = require('../server/utils/logger');

/**
 * Migration script to add OAuth and Journalist support
 * Run this script after pulling the latest changes
 * 
 * Usage: node migrations/add_oauth_journalist_support.js
 */

async function migrate() {
    try {
        logger.info('Starting migration: Add OAuth and Journalist support');

        // Check if columns already exist
        const userTableInfo = await database.all('PRAGMA table_info(users)');
        const columnNames = userTableInfo.map(col => col.name);

        // Add OAuth columns if they don't exist
        if (!columnNames.includes('oauth_provider')) {
            logger.info('Adding oauth_provider column to users table');
            await database.run('ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(20)');
        }

        if (!columnNames.includes('oauth_id')) {
            logger.info('Adding oauth_id column to users table');
            await database.run('ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255)');
        }

        if (!columnNames.includes('oauth_email')) {
            logger.info('Adding oauth_email column to users table');
            await database.run('ALTER TABLE users ADD COLUMN oauth_email VARCHAR(255)');
        }

        if (!columnNames.includes('is_journalist')) {
            logger.info('Adding is_journalist column to users table');
            await database.run('ALTER TABLE users ADD COLUMN is_journalist BOOLEAN DEFAULT 0');
        }

        logger.info('✓ User table columns updated');

        // Create news_ticker table if it doesn't exist
        logger.info('Creating news_ticker table');
        await database.run(`
            CREATE TABLE IF NOT EXISTS news_ticker (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                link_url VARCHAR(500),
                is_active BOOLEAN DEFAULT 1,
                created_by INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            )
        `);
        logger.info('✓ News ticker table created');

        // Create journalist role if it doesn't exist
        const journalistRole = await database.get(
            'SELECT * FROM roles WHERE name = ?',
            ['journalist']
        );

        if (!journalistRole) {
            logger.info('Creating journalist role');
            await database.run(
                `INSERT INTO roles (name, description) VALUES (?, ?)`,
                ['journalist', 'Journalist with ability to create and manage articles']
            );
            logger.info('✓ Journalist role created');

            // Get the role ID
            const role = await database.get('SELECT id FROM roles WHERE name = ?', ['journalist']);

            // Create journalist permissions
            const permissions = [
                { name: 'article.create', description: 'Create articles', resource: 'article', action: 'create' },
                { name: 'article.update_own', description: 'Update own articles', resource: 'article', action: 'update_own' },
                { name: 'article.delete_own', description: 'Delete own draft articles', resource: 'article', action: 'delete_own' },
                { name: 'article.read', description: 'Read articles', resource: 'article', action: 'read' },
                { name: 'news_ticker.manage', description: 'Manage news ticker', resource: 'news_ticker', action: 'manage' },
                { name: 'media.upload', description: 'Upload media', resource: 'media', action: 'upload' },
            ];

            logger.info('Creating journalist permissions');
            for (const perm of permissions) {
                // Check if permission exists
                const existingPerm = await database.get(
                    'SELECT * FROM permissions WHERE name = ?',
                    [perm.name]
                );

                let permId;
                if (!existingPerm) {
                    const result = await database.run(
                        `INSERT INTO permissions (name, description, resource, action) VALUES (?, ?, ?, ?)`,
                        [perm.name, perm.description, perm.resource, perm.action]
                    );
                    permId = result.lastID;
                } else {
                    permId = existingPerm.id;
                }

                // Assign permission to journalist role
                await database.run(
                    `INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
                    [role.id, permId]
                );
            }
            logger.info('✓ Journalist permissions created and assigned');
        } else {
            logger.info('Journalist role already exists, skipping creation');
        }

        // Create index for OAuth lookups
        logger.info('Creating indexes for OAuth and journalist features');
        await database.run('CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id)');
        await database.run('CREATE INDEX IF NOT EXISTS idx_users_journalist ON users(is_journalist)');
        await database.run('CREATE INDEX IF NOT EXISTS idx_news_ticker_active ON news_ticker(is_active)');
        logger.info('✓ Indexes created');

        logger.info('');
        logger.info('='.repeat(60));
        logger.info('✅ Migration completed successfully!');
        logger.info('='.repeat(60));
        logger.info('');
        logger.info('Next steps:');
        logger.info('1. Add OAuth credentials to your .env file');
        logger.info('2. Install new dependencies: npm install');
        logger.info('3. Restart your server');
        logger.info('');

        process.exit(0);
    } catch (error) {
        logger.error('Migration failed:', error);
        console.error(error);
        process.exit(1);
    }
}

// Run migration
migrate();
