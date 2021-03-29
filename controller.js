const User = require('./models/userModel')
const bcrypt = require('bcrypt')
const passport = require('passport')
const SaweriaClient = require("saweria");
const saweria = new SaweriaClient();
const { v4: uuid } = require('uuid')
require('dotenv').config()

const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
    // Return null if error
    return null;
};

module.exports = {
    getSupport: async (req,res) => {
        await saweria.login(process.env.SAWERIA_EMAIL, process.env.SAWERIA_PASSWORD)
        var balance = await saweria.getBalance()
        var supporter = await saweria.getTransaction(1,20)
        res.render('support',{balance:balance, supporter:supporter})
    },

    getLogin:async (req,res) => {     //TODO:if was login redirect to profile
        if(req.isAuthenticated()){
            res.redirect('/u')
            return;
        }
        res.render('login')
        return;
    },
    postLogin:(req,res,next) => {
        passport.authenticate('local', (err, user, info) => {
            req.login(user, (err) => {
                if (err) res.render('login',{msg:err})
                return res.redirect('/u')
            })
        })(req,res,next)
    },


    getRegister:(req,res) => {  //TODO:if was login redirect to profile
        res.render('register', {msg:undefined})
    },
    postRegister:async (req,res) => {
        if (req.body.password === req.body.password2) {                
            const hash = await hashPassword(req.body.password);
            const user = new User({
                    name: req.body.username,
                    email: req.body.email,
                    password: hash
            })
            user.save((err,data) => {
                    if(err) console.log(err)
                    res.redirect('/login')
                    return;
            })        
        } else {
              res.render('register',{msg:'Password not match'})
              return;
        }                               
    },





}