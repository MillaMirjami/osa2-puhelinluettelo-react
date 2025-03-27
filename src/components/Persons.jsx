const Persons = ({searchTerm, persons, button}) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
      <div>
        {filteredPersons.map(personShown => 
        <p key={personShown.name}>
          {personShown.name} {personShown.number}
          <button onClick={() => button(personShown._id)}>delete</button>
          </p>)}
      </div>
    )
}

export default Persons