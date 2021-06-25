const mongoose = require('mongoose')

//This is necesary because the only possible arguments are 3 if it's only the password arg
//and only 4-5 if it's only the name or name with the number
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <person name> <person number>');
  process.exit(1);
} 
else if (process.argv.length > 5) {
  console.log('if the name contains whitespace, it must be enclosed in quotes: node mongo.js <password> "person name" <person number>');
  process.exit(1);  
}

const password = process.argv[2]

//this is the route if the arg it's only the pass
// if 

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is Easy',
//   date: new Date(),
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })