const { authorizer } = require('../middleware/authorizer')
const Quiz = require('../schemas/Quiz')
const url = require('url');  

const express = require('express')
const router = express.Router()

// GET '/quizes/create'
router.get('/create', authorizer, (req, res) => {
    res.render('quizes/create')
})

// GET '/quizes/cancel'
router.get('/cancel', authorizer, (req, res) => {
    res.redirect('create')
})

// GET '/quizes/add'
router.get('/add', authorizer, (req, res) => {
    const numQs = req.query.numQs
    const numArr = []
    for (i = 0; i < numQs; i++) { 
        numArr[i] = {num: i + 1}
      }
    res.render('quizes/add', {
        layout: 'add',
        nums: numArr,
        action: req.query.forwardQuery,
        invField: req.query.invField
    })
})

// GET '/explore/:id'
router.get('/:id', authorizer, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id}).lean()
        res.render('quizes/takeQuiz', {
            layout: 'add',
            title: quiz.title,
            questions: quiz.questions
        })   
    } catch (err) {
        console.error(err)
    }
    
})


// POST '/quizes'
router.post('/', authorizer, async (req, res) => {
    try {
        req.body.author = req.user.id
        res.redirect(url.format({
            pathname:"/quizes/add",
            query: {
               "title": req.body.title,
               "status": req.body.status,
               "numQs": req.body.numQs,
               "author": req.body.author,
               "forwardQuery": encodeURI("/quizes/add?title=" + req.body.title +"&status=" + req.body.status + "&numQs=" + req.body.numQs + "&author=" + req.body.author)
             }
          }));
    } catch (err) {
        console.error(err)
    }
})

const formatQuestions = (jsonObj) => {
    const arr = []
    for (const key in jsonObj) {
        if (key[0] === 'q') {
            arr.push({
                question: jsonObj[key],
                answer: jsonObj["answer"+key.slice(8, key.length)],
                questionNum: key
            })
        }
    }
    return arr
}

// POST '/quizes/add'
router.post('/add', authorizer, async (req, res) => {
    try {
        const quizData = req.query
        console.log(quizData)
        const bodyStr = JSON.stringify(req.body)
        const bodyJSON = JSON.parse(bodyStr)
        quizData.questions = formatQuestions(bodyJSON)
        await Quiz.create(quizData)
        res.redirect('/dash')
    } catch (err) {
        console.error(err)
        res.redirect(url.format({
            pathname:"/quizes/add",
            query: {
               "title": req.query.title,
               "status": req.query.status,
               "numQs": req.query.numQs,
               "author": req.query.author,
               "forwardQuery": encodeURI("/quizes/add?title=" + req.query.title +"&status=" + req.query.status + "&numQs=" + req.query.numQs + "&author=" +req.query.author),
               "invField": "All fields must contain non-empty values"
             }
        }));

    }
})

module.exports = router