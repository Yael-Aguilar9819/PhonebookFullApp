const mongoose = require('mongoose')

//This will let us use the env variables
require('dotenv').config()

const url = process.env.MONGODB_URI;

//This is how it connects to the service in the MongoDB Atlas cloud
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

//And this is the main schema of the person object
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//To make it usable, it needed to 
module.exports = mongoose.model('Note', personSchema);
