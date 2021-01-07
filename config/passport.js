// Local modules
const User = require('../schemas/User')

// External npm modules 
const GoogleStrat = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')

// Configure passport to use the google-oauth20 strategy
const passportConfig = (passport) => {
    passport.use(new GoogleStrat({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback'
    },
        // Login and create new user if not already a member
        async (accessToken, refreshToken, profile, callback) => {
            const newUser = {
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName
            }
            try {
                let user = await User.findOne({ googleId: profile.id })
                if (user) {
                    callback(null, user)
                } else {
                    user = await User.create(newUser)
                    callback(null, user)
                }
            } catch (err) {
                console.error(err)
            }
        }))

    // Serialize and Deserialize to handle sessions
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}

module.exports = passportConfig