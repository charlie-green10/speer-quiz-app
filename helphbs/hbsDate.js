// External npm modules 
const moment = require('moment')

// Formats date objects when rendering
const formatDate = (date, format) => {
    return moment(date).format(format)
}


module.exports = formatDate