import PersonName from './PersonInfo'
import FunctionButton from './FunctionButton.js'

//This is the component that display the list, then it renders another component with the info of each person and a button 
//That deletes that person info, in-server and in frontend
const PeopleDisplay = ({personsArray, deleteFunction, filterToSearch}) => {
    return (
        <ul>
        {personsArray.filter(filterToSearch()).map(person =>
          <PersonName 
            key={person.name} 
            name={person.name} 
            number={person.number} 
            deleteButton={<FunctionButton onClickFunc={() => deleteFunction(person)} text={"Delete"}/>}
            />)}
      </ul>
    )
}
export default PeopleDisplay