const database = require('./server/config/database');
const bcrypt = require('bcrypt');
const logger = require('./server/utils/logger');

/**
 * Database initialization and seeding script
 * Creates all tables and adds default roles, permissions, and initial data
 */

async function seedDatabase() {
    try {
        logger.info('Seeding database with default data...');

        // Create journalist role
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

            for (const perm of permissions) {
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

                await database.run(
                    `INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
                    [role.id, permId]
                );
            }
            logger.info('✓ Journalist role and permissions created');
        }

        logger.info('✓ Database seeding completed');
    } catch (error) {
        logger.error('Seeding error:', error);
        throw error;
    }
}

module.exports = { seedDatabase };
