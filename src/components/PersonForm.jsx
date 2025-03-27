const PersonForm = (props) => {
    return (
      <form onSubmit={props.onSubmit}>
        <div> name: <input value={props.valueName} onChange={props.onChangeName}></input></div>
        <div> number: <input value={props.valueNumber} onChange={props.onChangeNumber}></input></div>
        <div> <button type='submit'>add</button></div>
      </form>
    )
}

export default PersonForm