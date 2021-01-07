const { authorizer, guestAuth} = require('../middleware/authorizer')
const Quiz = require('../schemas/Quiz')
const Results = require('../schemas/Results')

const express = require('express')
const router = express.Router()

// GET '/dash
router.get('/', authorizer, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ author: req.user.id }).sort({ createdAt: 'desc'}).lean()
        const results = await Results.find({participantId: req.user.id}).populate('participantId').populate('quizId').sort({ timeOfCompletion: 'desc'}).lean()
        res.render('dash', {
            name: req.user.firstName + " " + req.user.lastName,
            date: req.user.createdAt,
            quizzes,
            results
        })
    } catch (err) {
        console.error(err)
    }
})
// GET '/dash/result/:id
router.get('/result/:id', authorizer, async (req, res) => {
    try {
        const result = await Results.findOne({ _id: req.params.id}).populate('participantId').populate('quizId').lean()
        res.render('quizzes/results', {
            info: result.answers,
            score: result.score,
            total: result.answers.length,
            quizId: result.quizId._id,
            average: result.quizId.average,
            completions: result.quizId.completions
        })
    } catch (err) {
        console.error(err)
    }
})

// GET '/dash/:id'
router.get('/:id', authorizer, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id}).lean()
        res.render('quizzes/takeQuiz', {
            layout: 'add',
            title: quiz.title,
            questions: quiz.questions,
            id: req.params.id
        })   
    } catch (err) {
        console.error(err)
    }
    
})


module.exports = router