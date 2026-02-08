const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Passport.js OAuth Configuration
 * Configures Google and Facebook OAuth strategies
 */

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/oauth/google/callback',
                scope: ['profile', 'email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    logger.info('Google OAuth callback received', {
                        profileId: profile.id,
                        email: profile.emails?.[0]?.value,
                    });

                    const email = profile.emails && profile.emails.length > 0
                        ? profile.emails[0].value
                        : null;

                    if (!email) {
                        return done(new Error('No email found in Google profile'), null);
                    }

                    // Find or create user
                    const user = await User.findOrCreateOAuthUser({
                        provider: 'google',
                        providerId: profile.id,
                        email: email,
                        name: profile.displayName,
                        avatar: profile.photos && profile.photos.length > 0
                            ? profile.photos[0].value
                            : null,
                    });

                    return done(null, user);
                } catch (error) {
                    logger.error('Google OAuth error:', error);
                    return done(error, null);
                }
            }
        )
    );
    logger.info('✓ Google OAuth strategy configured');
} else {
    logger.warn('⚠ Google OAuth not configured (missing CLIENT_ID or CLIENT_SECRET)');
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/oauth/facebook/callback',
                profileFields: ['id', 'displayName', 'emails', 'photos'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    logger.info('Facebook OAuth callback received', {
                        profileId: profile.id,
                        email: profile.emails?.[0]?.value,
                    });

                    const email = profile.emails && profile.emails.length > 0
                        ? profile.emails[0].value
                        : null;

                    if (!email) {
                        return done(new Error('No email found in Facebook profile'), null);
                    }

                    // Find or create user
                    const user = await User.findOrCreateOAuthUser({
                        provider: 'facebook',
                        providerId: profile.id,
                        email: email,
                        name: profile.displayName,
                        avatar: profile.photos && profile.photos.length > 0
                            ? profile.photos[0].value
                            : null,
                    });

                    return done(null, user);
                } catch (error) {
                    logger.error('Facebook OAuth error:', error);
                    return done(error, null);
                }
            }
        )
    );
    logger.info('✓ Facebook OAuth strategy configured');
} else {
    logger.warn('⚠ Facebook OAuth not configured (missing APP_ID or APP_SECRET)');
}

module.exports = passport;
