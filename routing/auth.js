// External npm modules 
const express = require('express')
const passport = require('passport')

// Define router
const router = express.Router()

// GET '/auth/google'
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// GET '/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dash')
})

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router