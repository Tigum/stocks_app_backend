const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = async function (req, res, next) {
    //User authenticated and return token here
    const token = tokenForUser(req.user)
    console.log('TOKEN', token)
    try {
        const result = await jwt.decode(token, config.secret)
        if (result) {
            try {
                var user = await User.findOne({ _id: result.sub })
                res.send({ ...user._doc, token: token })
            } catch (err) {
                res.send({ error: 'User could not be found' })
            }
        }
    } catch (err) {
        res.send({ error: 'Login or password not valid' })
    }
}

exports.signup = function (req, res, next) {
    const userInfo = req.body;
    
    //See if a user with a given email exists
    User.findOne({ email: userInfo.email }, function (err, existingUser) {
        if (err) { return next(err) }

        if (!userInfo.email || !userInfo.password || !userInfo.name || !userInfo.lastName) {
            return res.status(422).send({ error: 'Missing information' })
        }
        // If a user with an email already exists, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email already registered' })
        }

        //If a user with an email does NOT exist, create new user and sabe record
        const user = new User({
            email: userInfo.email,
            password: userInfo.password,
            imageUrl: 'N/A',
            facebookRegistration: userInfo.facebookRegistration || false,
            name: userInfo.name,
            lastName: userInfo.lastName
        })

        user.save(function (err, result) {
            if (err) { return next(err) }
            //Respond to request indicating the user was created
            res.json({ token: tokenForUser(user), user: result })
        })
    })
}

exports.uploadPicture = function (req, res, next) {
    const imageUrl = req.body.imageUrl
    const userId = req.body.userId

    User.findOne({ _id: userId }, function (err, user) {

        if (err) { return next(err) }

        if (!user) {
            return res.status(422).send({ error: 'User does not exist' })
        }

        User.update({ _id: userId }, { $set: { imageUrl: imageUrl } }, function (err) {
            if (err) { return next(err) }
            res.send({ imageUrl: imageUrl })
        })
    })
}

exports.loadUser = async function (req, res, next) {
    const token = req.query.token
    try {
        const result = await jwt.decode(token, config.secret)
        if (result) {
            try {
                const user = await User.findOne({ _id: result.sub })
                res.send({ ...user._doc, token: token })
            } catch (err) {
                if (err) {
                    return res.send(null)
                }
            }
        }
    } catch (err) {
        if (err) {
            return res.send(null)
        }
    }
}

exports.checkIfUserExistsByEmail = async function (req, res, next) {
    const email = req.query.email
    try {
        const user = await User.findOne({ email: email })

        if (user) {
            res.json({ ...user._doc })
        } else {
            res.send(null)
        }

    } catch (err) {
        if (err) {
            res.status(422).send({ error: 'User does not exist' })
        }
    }
}