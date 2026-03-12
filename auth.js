const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const db = require('./db');

// Serialize user id into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session using id
passport.deserializeUser((id, done) => {
    const user = db.findById(id);
    done(null, user || false);
});

// Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = db.findByGoogleId(profile.id);

            if (!user) {
                // New user — create record
                user = db.createUser({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || '',
                    avatar: profile.photos?.[0]?.value || '',
                });
                console.log(`✅ New user created: ${user.name} (${user.email})`);
            } else {
                console.log(`🔑 User logged in: ${user.name}`);
            }

            return done(null, user);
        } catch (err) {
            console.error('Auth error:', err);
            return done(err);
        }
    }
));

module.exports = passport;
