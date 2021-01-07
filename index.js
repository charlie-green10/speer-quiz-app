const connectToMongo = require('./config/mongoDB')
const passportConfig = require('./config/passport')
const path = require('path')
const formatDate = require('./helphbs/hbsDate')
const formatQuestion = require('./helphbs/hbsQuestion')

const express = require('express')
const dotenv = require('dotenv')
const handles = require('express-handlebars')
const passport = require('passport')
const expressSession = require('express-session')

dotenv.config({ path: './config/config.env' })
passportConfig(passport)

connectToMongo()

const app = express()

app.use(express.urlencoded({ extended: false }))


app.engine('.hbs', handles({helpers: {formatDate, formatQuestion}, defaultLayout: 'index', extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(expressSession({
    secret: 'silly goose',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routing/index'))
app.use('/dash', require('./routing/dash'))
app.use('/auth', require('./routing/auth'))
app.use('/quizes', require('./routing/quizes'))
app.use('/explore', require('./routing/explore'))


const PORT = process.env.PORT
app.listen(PORT)