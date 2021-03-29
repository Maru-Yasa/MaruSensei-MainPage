const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    googleId : {
      type:String,
      default:null
    },
    name:  String,
    email: String,
    password:   String,
    admin:{
        type:Boolean,
        default:false
    }
  },{ timestamps: true });

const User = mongoose.model('User', userSchema)
module.exports = User