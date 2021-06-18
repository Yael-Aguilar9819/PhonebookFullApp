const PersonInfo = ({name, number, deleteButton}) => {
    return (
        <div>
            <p>{name} {number} {deleteButton}</p> 
        </div>
    )
}
export default PersonInfo