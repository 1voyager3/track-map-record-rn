const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {

    try {
        const {email, password} = req.body;

        const user = new User({
            email: email,
            password: password
        });

        await user.save();

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);


    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(422).send({
            error: 'Must provide email and password!'
        });
    }

    const user = await User.findOne({email: email});

    if (!user) {
        return res.status(422).send({error: 'Email not found'});
    }

    try {
        await user.comparePassword(password);

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);
        res.send({token: token});

    } catch (e) {
        return res.status(422).send({error: 'Invalid email or password!'});
    }


});

module.exports = router;






