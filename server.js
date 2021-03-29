const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid')
const MongoStore = require('connect-mongo')
const controller = require('./controller')
const User = require('./models/userModel')
const fetch = require('node-fetch')
const Command = require('./models/commandModel')
require('dotenv').config()


app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', function() {
  console.log('MongoDb ok!')
});

const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
    }
    return false;
};

passport.use(new LocalStrategy(
    { usernameField: 'email' },
   async (email,password,done) => {
      User.findOne({email: email})
          .then(user => {
            if (user) {
              console.log(user.email)
              if (email === user.email && comparePassword(password,user.password)){
                return done(null, user)
              }else{
                console.log('Local strategy return false')
                return done(null,false)
              }
            }
          })
    }
  ))

  app.use(session({
    genid:(req) => {
      return uuid() //use uuid to generate sessions id
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60 // save session for 14 days
  }),
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // 2 MINGGU
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({_id:id})
        .then(user => {
          done(null, user)
        })
  });

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine','ejs')
app.use(express.static('static'))

app.get('/', async (req,res) => {
    var botStatus = null
    var command = null
    await fetch('https://MaruSensei-DiscordBot.maruyasa.repl.co')
        .then(data => {
            botStatus = data.status
        })
    await Command.find()
        .then(data => {
            command = data
        })
    res.render('index',{botStatus:botStatus, command:command})
})

app.route('/support')
    .get(controller.getSupport)

// app.route('/register')
//     .get(controller.getRegister)
//     .post(controller.postRegister)

app.route('/login')
    .get(controller.getLogin)
    .post(controller.postLogin)

app.listen(process.env.PORT, () => {
    console.log('server ok 3000')
})