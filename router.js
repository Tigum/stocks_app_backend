const Authentication = require('./controllers/authentication')
const Stocks = require('./controllers/stocks')
const passportService = require('./services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = function (app) {
    //Authentication
    app.get('/loadUser', Authentication.loadUser)
    app.get('/checkIfUserExistsByEmail', Authentication.checkIfUserExistsByEmail)

    app.post('/signin', requireSignin, Authentication.signin)
    app.post('/signup', Authentication.signup)
    app.post('/uploadPicture', Authentication.uploadPicture)

    //Stocks
    app.post('/followStock', Stocks.followStock)
    app.post('/unfollowStock', Stocks.unfollowStock)

    app.get('/fetchStock', Stocks.fetchStock)
    app.get('/fetchStocks', Stocks.fetchStocks)
    app.get('/searchPortifolio', Stocks.searchPortifolio)
}