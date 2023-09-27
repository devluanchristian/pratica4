import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'

dotenv.config()

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile)
}))

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});