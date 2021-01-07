
const formatQuestion = (question) => {
    const caseFormat = question.charAt(0).toUpperCase() + question.slice(1)
    const spaceSeparate = caseFormat.slice(0, 8) + " " + caseFormat.slice(8, caseFormat.length)
    return spaceSeparate
}


module.exports = formatQuestion