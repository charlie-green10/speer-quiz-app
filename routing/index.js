// Local modules
const { guestAuth } = require('../helperFunctions/authorizer')
const Quiz = require('../schemas/Quiz')
const Results = require('../schemas/Results')

// External npm modules
const express = require('express')

// Define router
const router = express.Router()

// GET '/'
router.get('/', guestAuth, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

module.exports = router