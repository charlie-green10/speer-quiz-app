// Local and core modules 
const connectToMongo = require('./config/mongoDB')
const passportConfig = require('./config/passport')
const path = require('path')
const formatDate = require('./helphbs/hbsDate')
const formatQuestion = require('./helphbs/hbsQuestion')

// External npm modules 
const express = require('express')
const dotenv = require('dotenv')
const handles = require('express-handlebars')
const passport = require('passport')
const expressSession = require('express-session')

// Use config.env file
dotenv.config({ path: './config/config.env' })

// Initialize passport
passportConfig(passport)

// Establish connection with mongoDB
connectToMongo()

// Define and initialize express app
const app = express()
app.use(express.urlencoded({ extended: false }))

// Configure app to use handlebars templates with .hbs file extenstions
app.engine('.hbs', handles({ helpers: { formatDate, formatQuestion }, defaultLayout: 'index', extname: '.hbs' }))
app.set('view engine', '.hbs')

// Add express-session to app
app.use(expressSession({
    secret: 'silly goose',
    resave: false,
    saveUninitialized: false
}))

// Initialize passport and conigure to use sessions
app.use(passport.initialize())
app.use(passport.session())

// Define static directory 
app.use(express.static(path.join(__dirname, 'public')))

// Define routes
app.use('/', require('./routing/index'))
app.use('/dash', require('./routing/dash'))
app.use('/auth', require('./routing/auth'))
app.use('/quizzes', require('./routing/quizzes'))
app.use('/explore', require('./routing/explore'))

// Set PORT to 3000 (from config.env) and listen on PORT
const PORT = process.env.PORT
app.listen(PORT)