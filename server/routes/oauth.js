const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const securityConfig = require('../config/security');
const logger = require('../utils/logger');
const { loginLimiter } = require('../middlewares/rateLimiter');

/**
 * OAuth Routes
 * Handles Google and Facebook OAuth authentication
 */

// Google OAuth - Initiate
router.get('/google', loginLimiter, passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Google OAuth - Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/oauth/failure', session: false }),
    (req, res) => {
        try {
            // Generate JWT token for the OAuth user
            const token = jwt.sign(
                {
                    userId: req.user.id,
                    email: req.user.email,
                    username: req.user.username,
                },
                securityConfig.jwt.secret,
                { expiresIn: securityConfig.jwt.expiresIn }
            );

            const refreshToken = jwt.sign(
                {
                    userId: req.user.id,
                    type: 'refresh',
                },
                securityConfig.jwt.refreshSecret,
                { expiresIn: securityConfig.jwt.refreshExpiresIn }
            );

            logger.info('Google OAuth login successful', {
                userId: req.user.id,
                email: req.user.email,
            });

            // Redirect to frontend with tokens in URL hash (more secure than query params)
            const redirectUrl = `/oauth-callback.html#token=${encodeURIComponent(token)}&refresh=${encodeURIComponent(refreshToken)}&provider=google`;
            res.redirect(redirectUrl);
        } catch (error) {
            logger.error('Google OAuth callback error:', error);
            res.redirect('/api/oauth/failure');
        }
    }
);

// Facebook OAuth - Initiate
router.get('/facebook', loginLimiter, passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
}));

// Facebook OAuth - Callback
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/oauth/failure', session: false }),
    (req, res) => {
        try {
            // Generate JWT token for the OAuth user
            const token = jwt.sign(
                {
                    userId: req.user.id,
                    email: req.user.email,
                    username: req.user.username,
                },
                securityConfig.jwt.secret,
                { expiresIn: securityConfig.jwt.expiresIn }
            );

            const refreshToken = jwt.sign(
                {
                    userId: req.user.id,
                    type: 'refresh',
                },
                securityConfig.jwt.refreshSecret,
                { expiresIn: securityConfig.jwt.refreshExpiresIn }
            );

            logger.info('Facebook OAuth login successful', {
                userId: req.user.id,
                email: req.user.email,
            });

            // Redirect to frontend with tokens
            const redirectUrl = `/oauth-callback.html#token=${encodeURIComponent(token)}&refresh=${encodeURIComponent(refreshToken)}&provider=facebook`;
            res.redirect(redirectUrl);
        } catch (error) {
            logger.error('Facebook OAuth callback error:', error);
            res.redirect('/api/oauth/failure');
        }
    }
);

// OAuth failure handler
router.get('/failure', (req, res) => {
    logger.warn('OAuth authentication failed');
    res.redirect('/#oauth-error=Authentication failed. Please try again.');
});

// OAuth success handler (optional, for debugging)
router.get('/success', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
            isJournalist: req.user.is_journalist,
        },
    });
});

module.exports = router;
