const InputText = ({functionControlChange, currentInputControl, textDisplay}) => {
    return (
    <div>
        {textDisplay} <input value={currentInputControl} onChange={functionControlChange}/>
    </div>
    )
};
export default InputText