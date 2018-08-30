const express = require('express')
const fs = require('fs')
const router = express.Router()
const Student = require('../models/Student')

const { upload } = require('../utils/cloudinary')

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index')
})

router.post('/upload', (req, res, next) => {
    req.files.picture.mv(`public/images/${req.files.picture.name}`, function(err) {
        if (err) return res.status(500).send(err)

        upload(`public/images/${req.files.picture.name}`)
            .then(result => {
                return Student.findOneAndUpdate(
                    { name: req.body.name },
                    { name: req.body.name, picture: result.secure_url },
                    { new: true, upsert: true, runValidators: true }
                )
            })
            .then(student => {
                fs.unlinkSync(`public/images/${req.files.picture.name}`)
                res.send(student)
            })
    })
})

router.get('/students', (req, res) => {
    Student.find({}).then(students => {
        res.render('students', { students })
    })
})

module.exports = router
