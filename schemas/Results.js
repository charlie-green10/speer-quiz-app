const mongoose = require('mongoose')

const ResultsSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    answers: [{
        questionNum: {
            type: String,
            required: true,
            minlength: 1
        },
        question: {
            type: String,
            required: true,
            minlength: 1
        },
        correctAnswer: {
            type: String,
            required: true,
            minlength: 1
        },
        yourAnswer: {
            type: String,
            required: true,
            trim: true
        },
        correct: {
            type: Boolean,
            required: true
        }
    }],
    score: {
        type: Number,
        required: true
    },
    timeOfCompletion: {
        type: Date,
        required: true
    },
})

module.exports =  mongoose.model('Results', ResultsSchema)