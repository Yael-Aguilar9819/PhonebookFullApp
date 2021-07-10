const mongoose = require('mongoose');

// This is necesary because the only possible arguments are 3 if it's only the password arg
// and only 4-5 if it's only the name or name with the number
const lengthOfArgs = process.argv.length;

if (lengthOfArgs < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <person name> <person number>');
  process.exit(1);
} else if (lengthOfArgs > 5) {
  console.log('if the name contains whitespace, it must be enclosed in quotes: node mongo.js <password> "person name" <person number>');
  process.exit(1);
}

// This is the boilerplate that connects to the DB if the password is correct
// otherwise will throw an error
const password = process.argv[2];
const url = `mongodb+srv://userwork1:${password}@cluster0.ftzxk.mongodb.net/phonebook-app?retryWrites=true&w=majority`;
mongoose.connect(url, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
});

// It's formatted as a string because the phonenumber should be added as it is
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// this is the route if the only arg it's the pass
// it prints an index of all of the persons in the phonebook
if (lengthOfArgs === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    // Then we close the connection to the DB
    mongoose.connection.close();
  });
} else { // otherwise, it will add a new person to the phonebook
  const personName = process.argv[3];
  // this will choose between 4 and 5 args, to add the correct personNumber
  const personNumber = lengthOfArgs > 4 ? process.argv[4].toString() : '';

  const person = new Person({
    name: personName,
    number: personNumber,
  });

  // This reports to the console and close the connection
  person.save().then(result => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
}
