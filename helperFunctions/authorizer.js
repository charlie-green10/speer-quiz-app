// Authorization helper functions
const authorizer = (req, res, callback) => {
    if (req.isAuthenticated()) {
        return callback()
    } else {
        res.redirect('/')
    }
}

const guestAuth = (req, res, callback) => {
    if (req.isAuthenticated()) {
        res.redirect('/dash')
    } else {
        return callback()
    }
}


module.exports = {
    authorizer,
    guestAuth
}