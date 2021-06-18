const FunctionButton = ({onClickFunc, text}) => {
    const buttonStyle = {
        marginLeft: 4,
        maxHeight: 20
    }

    return (
        <button style={buttonStyle} type="submit" onClick={onClickFunc}>{text}</button>
    )
};

export default FunctionButton