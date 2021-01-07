const {guestAuth} = require('../middleware/authorizer')
const Quiz = require('../schemas/Quiz')
const Results = require('../schemas/Results')

const express = require('express')
const router = express.Router()

// GET '/'
router.get('/', guestAuth, (req, res) => {
    res.render('login', {
        layout: 'login' 
    })
})



module.exports = router