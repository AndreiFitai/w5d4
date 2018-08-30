const express = require('express')
const router = express.Router()

const User = require('../models/User')

const { upload } = require('../utils/cloudinary')

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index')
})

router.post('/user/create', (req, res, next) => {
    const { photo } = req.files
    const { name } = req.body

    const path = `public/images/${photo.name}`

    photo.mv(path, function(err) {
        if (err) return res.status(500).send(err)
        let userId
        new User({ name })
            .save()
            .then(user => {
                userId = user._id
                return upload(path)
            })
            .then(result => {
                return User.findByIdAndUpdate(
                    userId,
                    {
                        picture: result.url,
                    },
                    { new: true }
                )
            })
            .then(user => {
                res.send(user)
            })
    })
})

module.exports = router
