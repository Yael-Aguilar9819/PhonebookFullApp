const formStyle = {
    marginLeft: 7
};

const PersonForm = ({textInput1, textInput2, submitButton}) => {
    return (
        <form style={formStyle}>
            {textInput1}
            {textInput2}
            <div>
                {submitButton}
            </div>
        </form>
    )
}

export default PersonForm