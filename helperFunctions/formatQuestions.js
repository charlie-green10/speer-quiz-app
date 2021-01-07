// Helper funtion to handle basic string formating
// Suggestion: move to helphbs so only called when text is rendered
const formatQuestions = (jsonObj) => {
    const arr = []
    for (const key in jsonObj) {
        if (key[0] === 'q') {
            arr.push({
                question: jsonObj[key],
                answer: jsonObj["answer" + key.slice(8, key.length)],
                questionNum: key
            })
        }
    }
    return arr
}

module.exports = formatQuestions