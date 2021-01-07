// Local modules
const { authorizer } = require('../helperFunctions/authorizer')
const Quiz = require('../schemas/Quiz')
const Results = require('../schemas/Results')
const getResults = require('../helperFunctions/getResults')

// External npm modules
const express = require('express')

// Define router
const router = express.Router()


// GET '/explore'
router.get('/', authorizer, async (req, res) => {
    try {
        const publicQuizzes = await Quiz.find({ status: 'public' }).populate('author').sort({ createdAt: 'desc' }).lean()
        res.render('quizzes/explore', {
            quizzes: publicQuizzes
        })
    } catch (err) {
        console.error(err)
    }
})

// GET '/explore/leaveQuiz'
router.get('/leaveQuiz', authorizer, (req, res) => {
    res.redirect('/dash')
})

// GET '/explore/:id'
router.get('/:id', authorizer, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id }).lean()
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

// POST '/explore'
router.post('/results', authorizer, async (req, res) => {
    try {
        // Find Quiz
        let quiz = await Quiz.findOne({ _id: req.query.id }).lean()

        // Parse submission and generate results
        const bodyStr = JSON.stringify(req.body)
        const bodyJSON = JSON.parse(bodyStr)
        const results = getResults(bodyJSON, quiz)

        // Update quiz
        quiz.average = Math.round(((quiz.average * quiz.completions + results.score) / (quiz.completions + 1)) * 100) / 100
        quiz.completions += 1
        const quizUpdate = await Quiz.findOneAndUpdate({ _id: req.query.id }, quiz)

        // Define result object and save to db
        const saveResult = {
            quizId: quizUpdate._id,
            participantId: req.user.id,
            answers: results.info,
            score: results.score,
            timeOfCompletion: Date.now()
        }
        await Results.create(saveResult)
        
        res.render('quizzes/results', {
            info: results.info,
            score: results.score,
            total: results.info.length,
            quizId: quiz._id,
            average: quiz.average,
            completions: quiz.completions

        })
    } catch (err) {
        console.error(err)
    }
})

module.exports = router