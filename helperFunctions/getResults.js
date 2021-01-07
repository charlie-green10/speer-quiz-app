// Parses necessary info when a quiz is submitted in order to render the results page
const getResults = (jsonObj, quiz) => {
    let score = 0
    const info = []
    let i = 0
    for (const key in jsonObj) {
        if (jsonObj[key].toLocaleLowerCase() === quiz.questions[i].answer.toLocaleLowerCase()) {
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
    return { info, score }
}

module.exports = getResults