const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../users/users-model')

router.post('/register', async (req, res, next) => {
    // res.json({ message: 'register working'})
    try {
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 8) // 2^8 (Big but shouldn't take too long)
        const newUser = { username, password: hash }
        const result = await User.add(newUser)
        res.status(201).json({
            message: `nice to have you, ${result.username}`,
        })
    }
    catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    // res.json({ message: 'login working'})
    try {
        const { username, password } = req.body
        const [ user ] = await User.findBy({ username }) // [] will pull first user from list
        if (user && bcrypt.compareSync(password, user.password)) {
            // start session
            // console.log('we should start a session for you')
            req.session.user = user // server will remember user session
            res.json({ message: `welcome back, ${user.username}`})
        }
        else {
            next({ status: 401, message: 'bad credentials' })
        }
    }
    catch (err) {
        next(err)
    }
})

router.method('/logout', async (req, res, next) => {
    // res.json({ message: 'logout working'})
    if (req.session.user) {
        const { username } = req.session.user
        req.session.destroy(err => {
            if (err) {
                res.json({ message: `you can never leave, ${username}`})
            } else {
                res.set('Set-Cookie', 'monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00')
                res.json({ message: `goodbye ${username}`})
            }
        })
    } else {
        res.json({ message: 'sorry, have we met?'})
    }
})


module.exports = router