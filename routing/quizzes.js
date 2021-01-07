// Local and core modules
const { authorizer } = require('../helperFunctions/authorizer')
const Quiz = require('../schemas/Quiz')
const url = require('url');
const formatQuestions = require('../helperFunctions/formatQuestions')

// External npm modules
const express = require('express')

// Define router
const router = express.Router()

// GET '/quizzes/create'
router.get('/create', authorizer, (req, res) => {
    res.render('quizzes/create')
})

// GET '/quizzes/cancel'
router.get('/cancel', authorizer, (req, res) => {
    res.redirect('create')
})

// GET '/quizzes/add'
router.get('/add', authorizer, (req, res) => {
    const numQs = req.query.numQs
    const numArr = []
    for (i = 0; i < numQs; i++) {
        numArr[i] = { num: i + 1 }
    }
    res.render('quizzes/add', {
        layout: 'add',
        nums: numArr,
        action: req.query.forwardQuery,
        invField: req.query.invField
    })
})

// GET '/quizzes/:id'
router.get('/:id', authorizer, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id }).lean()
        res.render('quizzes/takeQuiz', {
            layout: 'add',
            title: quiz.title,
            questions: quiz.questions
        })
    } catch (err) {
        console.error(err)
    }

})

// POST '/quizzes'
router.post('/', authorizer, async (req, res) => {
    try {
        req.body.author = req.user.id
        res.redirect(url.format({
            pathname: "/quizzes/add",
            // Query passed to render necessary elements to the add page
            query: {
                "title": req.body.title,
                "status": req.body.status,
                "numQs": req.body.numQs,
                "author": req.body.author,

                // Forward query defines the query which get passed when a post 
                // request is made from the add page
                "forwardQuery": encodeURI("/quizzes/add?title=" + req.body.title + "&status=" + req.body.status + "&numQs=" + req.body.numQs + "&author=" + req.body.author)
            }
        }));
    } catch (err) {
        console.error(err)
    }
})

// POST '/quizzes/add'
router.post('/add', authorizer, async (req, res) => {
    try {
        // Parses info and adds a new quiz to the db
        const quizData = req.query
        const bodyStr = JSON.stringify(req.body)
        const bodyJSON = JSON.parse(bodyStr)
        quizData.questions = formatQuestions(bodyJSON)
        await Quiz.create(quizData)
        res.redirect('/dash')
    } catch (err) {
        console.error(err)
        res.redirect(url.format({
            pathname: "/quizzes/add",

            // Query passed to render necessary elements to the add page, same as above
            query: {
                "title": req.query.title,
                "status": req.query.status,
                "numQs": req.query.numQs,
                "author": req.query.author,
                "forwardQuery": encodeURI("/quizzes/add?title=" + req.query.title + "&status=" + req.query.status + "&numQs=" + req.query.numQs + "&author=" + req.query.author),
                "invField": "All fields must contain non-empty values"
            }
        }));
    }
})

module.exports = router