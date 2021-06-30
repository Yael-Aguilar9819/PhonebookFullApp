const express = require('express')
const app = express()

//middlewares
//This lines invokes the json-parser from vanilla express
app.use(express.json())

//this makes express search in the /build folder for the static files
app.use(express.static('build'))

//It's necesary to have cors for this app to work
const cors = require('cors')
app.use(cors())


//This line uses the morgan library to create a custom middleware 
const morgan = require("morgan");

const assignMessagePOST = (request, response, next) => {
  if (request.method === "POST") {
    request.messagePOSTReq = JSON.stringify(request.body);
  } else {
    request.messagePOSTReq = " "
  }
  next();
}

//This line generates a new token to the morgan library to use with a ":" just before
morgan.token('messagePOSTReq', (request) => {
  return request.messagePOSTReq
})

app.use(assignMessagePOST)
app.use(morgan(':method :url - :response-time ms :messagePOSTReq'))

//This is the model that let use create and create Persons contact info
const mongoose = require("mongoose");
const Person = require('./models/person.js');

//This is the default route api, it shouldn't be able to be seen, but still here
app.get('/', (request, response) => {
  response.send('<h1>Hello World!!</h1>');
}) 


app.get("/api/persons", (request, response) => {
  //the {} is the empty filter, so everything goes through
  Person.find({}).then(person => {
    response.send(person);
  })
});

//This is the view for the each id, it's usng findById which is a mongoose-specific function 
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  }).catch(err => {
    next(err);
  })
});

//Now it's an async response, using the object length from the response
app.get("/info", (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info of ${persons.length} people</p> <p>${getActualHourWithDate()}</p>`);
  })
})

//This creates a new object
app.put("/api/persons", (request, response) => {
  //This immediately stops the function if its return true
  if (sendResponseErrorIfAnyAttributeNotFound(request.body, ["name", "number"], response)) return 1;

  //Creates the new object person through the person.js model
  const newPerson = new Person ({
    "name": request.body.name,
    "number": request.body.number
  })
  //now is an async op
  newPerson.save().then(savedPerson => {
    response.json(savedPerson);
  }).catch(err => {
    console.log(err);
  })
});

//TO DO, it's not connected to the remote server yet
app.delete("/api/persons/:id", (request, response, next) => {
  //This is a mongoose method, that offloads everything to this func
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      //204: no response-status
      response.status(204).end();
    })
    .catch(err => next(err))
})

//if any of the attributes its not found, it's going to throw a bad response to the request
const sendResponseErrorIfAnyAttributeNotFound = (mainObject, ListOfattributesToCheck, response) => {
  ListOfattributesToCheck.map(attribute => {
    if (!mainObject[attribute]) {
      return response.status(400).json({
        "error" : `${attribute} missing`
      })
    }
  })
};

//Certain error, invoked with next() use this
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)


//Unknown url response when it's not a category controlled by the errorHandler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


//If its inside the selected attribute of any of the persons, it will return true, otherwise false
// Needs reform 
const TrueIfStringInPersons = (stringToFind, attributeToSearchIn) => {
  const processedString = String(stringToFind);
  const trueIfFound = persons.find(person => {
    return String(person[attributeToSearchIn]) === processedString
  })
  //Ternary operator is used because not undefined object will be always true
  return trueIfFound ? true : false;
}

//This just compose both functions and make them a full date
const getActualHourWithDate = () => {
  const actualDate = new Date().toDateString();
  const actualHour = new Date().toTimeString();
  return `${actualDate} ${actualHour}`;
};

const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})