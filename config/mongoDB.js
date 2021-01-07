// External npm modules 
const mongoose = require('mongoose')

// Establish mongoDB connection
const connectToMongo = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

    } catch (err) {
        console.log("Something went wrong!")
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectToMongo