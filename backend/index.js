const express = require('express')
const app = express()
//This line invokes the json-parser from express
app.use(express.json())

let persons = [
  {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
  },
  {
      id: 2,
      name: "Ada lovelace",
      number: "39-44-5323352"
  },
  {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-2345612"
  },
  {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
  }
]

app.get("/api/persons", (request, response) => {
    response.send(persons);
});

//This is the view for the each id
app.get("/api/persons/:id", (request, response) => {
  //It saves resources because otherwise, it would be casted as a number again and again
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  
  //This just offloads the last part of function
  ifObjectNotTrueReturnStatus(person, 404, response);
});

//This deletes the person object
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personDeleted = persons.find(person => person.id === id);

  //This is an inverse filter
  const personsNotDeleted = persons.filter(person => person.id !== id)
  persons = personsNotDeleted;
  console.log(persons);

  //Offloads the last part of the function
  ifObjectNotTrueReturnStatus(personDeleted, 404, response);
})

app.get("/info", (request, response) => {
  const description = `<p>Phonebook has info of ${persons.length} people</p> <p>${getActualHourWithDate()}</p>`;

  response.send(description);
})

//if its not and object/positive variable, its not going to be true, then it returns a error status, usually 404
const ifObjectNotTrueReturnStatus = (object, statusCodeIfNotFound, responseObject) => {
  if (object) {
    responseObject.send(object);        
  }
  responseObject.status(statusCodeIfNotFound).end();
}

//This just compose both functions and make them a full date
const getActualHourWithDate = () => {
  const actualDate = new Date().toDateString();
  const actualHour = new Date().toTimeString();
  return `${actualDate} ${actualHour}`;
};

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})