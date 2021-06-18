const SubmitButton = ({onClickFunc, text}) => {
    return (
        <button type="submit" onClick={onClickFunc}>{text}</button>
    )
};

export default SubmitButton