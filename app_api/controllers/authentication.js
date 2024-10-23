const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');
const Model = mongoose.model('users');

const register = async(req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
        .status(400)
        .json({"message": "All fields required"});
    }

    const q = await Model
        .findOneAndUpdate(
            {'email': req.body.email},
            {
                name: req.body.name,
                email: req.body.email,
                password: User.setPassword(req.body.password)
            }
        )
        .exec();
        if (!q) {
            return  res
                .status(400)
                .json(err);
        }
        else {
            const token = User.generateJwt();
            res
            .status(200)
            .json({token});
        }
    };

const login = async(req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
        .status(400)
        .json({"message": "All fields required"});
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res
            .status(404)
            .json(err);
        }
        if (user) {
            const token = user.generateJwt();
            res
            .status(200)
            .json({token});
        }
        else {
            res
            .status(401)
            .json(info);
        }
    }) (req, res);
};

module.exports = {
    register,
    login
};