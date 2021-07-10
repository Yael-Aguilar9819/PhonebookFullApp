const express = require('express');

const app = express();

// middlewares
// This lines invokes the json-parser from vanilla express
app.use(express.json());

// this makes express search in the /build folder for the static files
app.use(express.static('build'));

// It's necesary to have cors for this app to work
const cors = require('cors');

app.use(cors());

// This line uses the morgan library to create a custom middleware that logs to the console
const morgan = require('morgan');

const assignMessagePOST = (request, response, next) => {
  if (request.method === 'POST') {
    request.messagePOSTReq = JSON.stringify(request.body);
  } else {
    request.messagePOSTReq = ' ';
  }
  next();
};

// This line generates a new token to the morgan library to use with a ":" just before
morgan.token('messagePOSTReq', (request) => request.messagePOSTReq);

app.use(assignMessagePOST);
app.use(morgan(':method :url - :response-time ms :messagePOSTReq'));

// This is the model that let use create and create Persons contact info
const mongoose = require('mongoose');
const Person = require('./models/person');

// This is the default route api, it shouldn't be able to be seen, but still here
app.get('/', (request, response) => {
  response.send('<h1>Hello World!!</h1>');
});

app.get('/api/persons', (request, response) => {
  // the {} is the empty filter, so everything goes through
  Person.find({}).then((person) => {
    response.send(person);
  });
});

// This is the view for the each id, it's usng findById which is a mongoose-specific function
app.get('/api/persons/:id', (request, response, next) => {
  // findById uses the ID and then returns it, if it fails goes to the errorhandler
  Person.findById(request.params.id).then((person) => {
    // Added if else because if it's not fiund, it's going to return null
    // else it means that it was found, and we proceed as usual
    if (person === null) response.status(404).end();
    else response.json(person);
  }).catch((err) => {
    next(err);
  });
});

// Now it's an async response, using the object length from the response
app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`<p>Phonebook has info of ${persons.length} people</p> <p>${getActualHourWithDate()}</p>`);
  });
});

// This creates a new object
app.post('/api/persons', (request, response, next) => {
  // This immediately stops the function if its true
  if (sendErrorResponseIfAnyAttributeNotFound(request.body, ['name', 'number'], response)) return 1;

  // Creates the new object person through the person.js model
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  // now is an async operation, that responds with the object
  // or just throw an error
  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  })
    .catch((err) => {
      next(err);
    });
});

// this route will be the one that modifies a entry if given the correct ID
// if its not, will throw an error through the handle
app.put('/api/persons/:id', (request, response, next) => {
  const personToReturn = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  // Takes 2 args, 1. the ID, and 2 is the attributes you want to modify
  // with runValidators: true now it needs to conform to the mongoose requeriments
  // handled through the frontend
  Person.findByIdAndUpdate(request.params.id, { number: request.body.number },
    { runValidators: true })
    .then((responseFromDB) => {
      response.json(responseFromDB);
    })
    // offloaded to the errorHandler
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (request, response, next) => {
  // This is a mongoose method, that offloads everything to this func
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      // if it's null, its because there was deleted before
      if (result === null) response.status(404).end();
      // else, it's going to response with 204: no response-status
      response.status(204).end();
    })
    .catch((err) => next(err));
});

// if any of the attributes its not found, it's going to throw a bad response to the request
const sendErrorResponseIfAnyAttributeNotFound = (mainObject, ListOfattributesToCheck, response) => {
  ListOfattributesToCheck.map((attribute) => {
    if (!mainObject[attribute]) {
      return response.status(400).json({
        error: `${attribute} missing`,
      });
    }
  });
};

// Certain error, invoked with next() use this
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  // native mongoose error
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  // This validation errs are given by unique-validator package installed from npm
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
// this has to be the last loaded middleware.
app.use(errorHandler);

// Unknown url response when it's not a category controlled by the errorHandler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// const updateOrForcePersonCreation = async (newPersonObject) => {
//   const responseFromMongoose = await Person.updateOne({ name: newPersonObject.name },
//     { number: newPersonObject.number });

//   // n is the number of entries that were modified
//   if (responseFromMongoose.n === 1) { /// if it was found and modified
//     return newPersonObject;
//   } // if it wasn't found an object with this name
//   const responseFromNewObject = await newPersonObject.save();
//   return responseFromNewObject;
// };

// This just compose both functions and make them a full date
const getActualHourWithDate = () => {
  const actualDate = new Date().toDateString();
  const actualHour = new Date().toTimeString();
  return `${actualDate} ${actualHour}`;
};

// with dotenv it's easy to modify the default port
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
