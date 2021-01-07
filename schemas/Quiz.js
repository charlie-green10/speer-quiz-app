const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    questions: [{
        question: {
            type: String,
            required: true,
            minlength: 1
        },
        answer: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        questionNum: {
            type: String,
            required: true
        }
    }],
    average: {
        type: Number,
        default: 0
    },
    completions: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    }
})

module.exports =  mongoose.model('Quiz', QuizSchema)