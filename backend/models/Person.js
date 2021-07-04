const mongoose = require('mongoose')
//Mongoose doesn't have a default unique validator, so this is a npm package from that
var uniqueValidator = require('mongoose-unique-validator');


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
  name: {
    type: String,
    minLength: 2,
    unique: true,
    required: true
  },
  number: String,
})
personSchema.plugin(uniqueValidator);


//This is kind of a middleware inside the schema, because it's going to be used in all person objects
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//To make it usable, it needs to be exported so it can be imported and used for other modules 
module.exports = mongoose.model('Person', personSchema);
