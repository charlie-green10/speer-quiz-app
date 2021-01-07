const { authorizer } = require('../middleware/authorizer')

const express = require('express')
const Quiz = require('../schemas/Quiz')
const Results = require('../schemas/Results')
const router = express.Router()

// GET '/explore'
router.get('/', authorizer, async (req, res) => {
    try {
        const publicQuizzes = await Quiz.find({ status: 'public' }).populate('author').sort({ createdAt: 'desc'}).lean()
        res.render('quizes/explore', {
        quizzes: publicQuizzes
        })   
    } catch (err) {
        console.error(err)
    }
    
})

// GET '/quizes/leaveQuiz'
router.get('/leaveQuiz', authorizer, (req, res) => {
    res.redirect('/dash')
})

// GET '/explore/:id'
router.get('/:id', authorizer, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id}).lean()
        res.render('quizes/takeQuiz', {
            layout: 'add',
            title: quiz.title,
            questions: quiz.questions,
            id: req.params.id
        })   
    } catch (err) {
        console.error(err)
    }
    
})

const getResults = (jsonObj, quiz) => {
    let score = 0
    const info = []
    let i = 0
    for (const key in jsonObj) {
        if(jsonObj[key].toLocaleLowerCase() === quiz.questions[i].answer.toLocaleLowerCase()) {
            score += 1
            info.push({
                questionNum: quiz.questions[i].questionNum,
                question: quiz.questions[i].question,
                correctAnswer: quiz.questions[i].answer,
                yourAnswer: jsonObj[key],
                correct: true
            })
        } else {
            info.push({
                questionNum: quiz.questions[i].questionNum,
                question: quiz.questions[i].question,
                correctAnswer: quiz.questions[i].answer,
                yourAnswer: jsonObj[key],
                correct: false
            })
        }
        i += 1
    }
    return {info, score}
}

// POST '/explore'
router.post('/results', authorizer, async (req, res) => {
    try {
        let quiz = await Quiz.findOne({ _id: req.query.id}).lean()
        const bodyStr = JSON.stringify(req.body)
        const bodyJSON = JSON.parse(bodyStr)
        const results = getResults(bodyJSON, quiz)
        quiz.average = Math.round(((quiz.average * quiz.completions + results.score)/(quiz.completions + 1)) * 100) / 100
        quiz.completions += 1
        const quizUpdate = await Quiz.findOneAndUpdate({ _id: req.query.id}, quiz)
        const saveResult = {
            quizId: quizUpdate._id,
            participantId: req.user.id,
            answers: results.info,
            score: results.score,
            timeOfCompletion: Date.now()
        }
        await Results.create(saveResult)
        res.render('quizes/results', {
            info: results.info,
            score: results.score,
            total: results.info.length,
            quizId: quiz._id,
            average: quiz.average,
            completions: quiz.completions,
            viewFromDash: false

        })
        console.log(results)
    } catch (err) {
        console.error(err)
    }
})

module.exports = router