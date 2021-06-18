import { useState, useEffect } from 'react';
import styles from './components/App.module.css'
import SubmitButton from './components/SubmitButton'
import InputText from './components/InputText'
import PersonForm from './components/PersonForm'
import PeopleDisplay from './components/PeopleDisplay'
import personsInfoService from './services/numbersBackend'
import NotificationMessage from './components/NotificationMessage';

//This is the main App, when the logic lives
const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')  
  const [ nameToSearch, setNameToSearch ] = useState('')
  const [ messageInfo, setMessageInfo ] = useState({message:null})

  
  //This is how the app starts, fetching all the persons info 
  useEffect(() => {
    personsInfoService.getAll()
      .then(personsJson => setPersons(personsJson))
      .catch(err => {
        console.log(err)
      })
  }, [])

  //This is using the controlled-component approach
  const handleSearchBoxChange = event => {
    setNameToSearch(event.target.value)
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  //It's the same as before, just added the server communication 
  const addPerson = (event) => {
    event.preventDefault();

    const newObjectPerson = {
      name : newName,
      number : newNumber
    }

    //Normalized to lowercase
    const indexOfName = persons.findIndex(personName => personName.name.toLowerCase() === newName.toLowerCase())

    //If it's different than -1, it means that it doesnt exit in the list
    if (indexOfName !== -1) {
      const userConfirmation = window.confirm(`${newObjectPerson.name} is already added to phonebook, replace the old number with a new one?`)
      if (userConfirmation === false) return 0

      newObjectPerson.id = persons[indexOfName].id;
      modifyPersonInfoInServerAndFront(newObjectPerson, indexOfName, persons);
    } else {
      //Changed this, so the personObject will have the ID from the start
      personsInfoService.sendNewPersonInfo(newObjectPerson)
        .then(resp => {
          newObjectPerson.id = resp.id
          showMessageForXSeconds(`Added ${newObjectPerson.name}.`, 2, "positive")
        })
      setPersons(persons.concat(newObjectPerson))
    }
    setNewName("")
    setNewNumber("")
  }

  
  const modifyPersonInfoInServerAndFront = (newObjectPerson, indexOfName, personsArray) => {
    //doing it the inmutable way
    const newPersonsArray = personsArray.slice(0, indexOfName)
      .concat(newObjectPerson)
      .concat(personsArray.slice(indexOfName + 1))
    
      personsInfoService.modifyPersonInfo(newObjectPerson)
      .then(resp =>  console.log(resp))
    setPersons(newPersonsArray)
  }

  //This functions controls the component and the info that goes inside
  //Meaning its about if its neagtive or positive, trying to find a better name
  const showMessageForXSeconds = (messageToShow, numberOfSeconds, meaning) => {
    setMessageInfo({
      message: messageToShow, status: meaning
    });

    setTimeout(() => setMessageInfo({message:null}), numberOfSeconds*1500);
  }

  //This functions deletes person info,
  const deletePerson = (personObject) => {
    const userConfirmation = window.confirm(`Delete ${personObject.name}?`)
    //will suspend the funciton if the user says simply no
    if (!userConfirmation) return 0;

    personsInfoService.deletePerson(personObject.id)
      .then(resp => console.log(`Success deleting ${personObject.name}!`))
      .catch(err => {
        showMessageForXSeconds(`Information of ${personObject.name} has already been removed from server.`, 3, "negative")
        console.log(err)})

    const newPersons = persons.filter(person => person.id !== personObject.id);
    setPersons(newPersons);
  }

  const falseIfStringEmpty = str => str.length === 0 ? false : true

  //This is the filter to the person part
  const filterToSearch = () => {
    if (!falseIfStringEmpty(nameToSearch)) return elem => elem

    return elem => elem.name.toLowerCase().substr(0, nameToSearch.length) === nameToSearch.toLowerCase();
  }


  //The main app application rendering everything
  return (
    <div className={styles.mainContainer}>
      <h2>Phonebook</h2>
      <NotificationMessage messageInfo={messageInfo}/>
      <InputText functionControlChange={handleSearchBoxChange} currentInputControl={nameToSearch} textDisplay={"Filter shown with"}/>      
      <h2>Add a new person contact info</h2>
      <PersonForm
        textInput1={<InputText functionControlChange={handleNameChange} currentInputControl={newName} textDisplay={"name"}/>} 
        textInput2={<InputText functionControlChange={handleNumberChange} currentInputControl={newNumber} textDisplay={"number"}/>} 
        submitButton={<SubmitButton onClickFunc={addPerson} text={"add"}/>}
      />
      <h2>Numbers</h2>
      <PeopleDisplay personsArray={persons} deleteFunction={deletePerson} filterToSearch={filterToSearch}/>
    </div>
  )
}

export default App