async function protect(req, res, next) {
    // console.log('protect working')
    if (req.session.user) {
        next()
    } else {
        next({ status: 401, message: 'You shall not pass!'})
    }
}


module.exports = {
    protect,
}