const mongoose = require('mongoose')
const { Schema } = mongoose

const commandSchema = new Schema({
    command:String,
    usage:String,
  },{ timestamps: true });

const Command = mongoose.model('Command', commandSchema)
module.exports = Command