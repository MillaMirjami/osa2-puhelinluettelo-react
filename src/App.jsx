import { useEffect, useState } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [peopleShown, setPeopleShown] = useState([])
  const [newSearch, setSearch] = useState('')
  const [message, setMessage] = useState('Message')
  const [errorMessage, setErrorMessage] = useState(null)

  console.log('Object array showing searched ppl, by default copy of the persons obj array:', peopleShown)

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
      setPeopleShown(initialPersons)
      console.log('Persons fetched', initialPersons)
    })
  },[])

  const addPerson = (event) => {
    event.preventDefault()

    const personExist = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    const numberExist = persons.find(person => person.number === newNumber)

    if(personExist) {
      if(numberExist) {
        alert(`Number ${newNumber} is already added to the phonebook`)
      }
      else {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
        {
          personService
          .changeNumber(personExist.id, personExist.name, newNumber)
          .then(returnedPerson => {
            setMessage(`${newName}'s number changed to ${newNumber}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000);
            setPersons(prevPersons => 
              prevPersons.map(person => 
                person.id === returnedPerson.id ? returnedPerson : person))
            setPeopleShown(prevPeopleShown =>
              prevPeopleShown.map(person =>
                person.id === returnedPerson.id ? returnedPerson : person))
            })
            .catch(error => {
              setErrorMessage(`Information of ${newName} has already been removed from server`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000);
            })
          }
      }
    }
    else if(numberExist) {
      alert(`Number ${newNumber} is already added to the phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
      .create(personObject)
      .then(returnedPerson => {
        setMessage(`Added ${newName}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000);
        setPersons(prevPersons => {
          const updatePersons = [...prevPersons, returnedPerson]
          setPeopleShown(updatePersons)
          return updatePersons
        })
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value
    setSearch(searchTerm)
    const result = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setPeopleShown(result)
  }

  const removePerson = (id) => {
    if(id){
      if(window.confirm('Are you sure?')) {
        personService
        .deletePerson(id)
        .then(() => {
          const deletedP = persons.find(p => p.id === id)
          setMessage(`Removed ${deletedP.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000);
        setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
        setPeopleShown(prevPeopleShown => prevPeopleShown.filter(person => person.id !== id))
        })
        .catch(error => {
          setErrorMessage(`Error occured while removing person`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
        })
      }
      else {
        console.log('Deletion was canceled')
      }
      }
      else {
        setErrorMessage('Attempted to remove person without id')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        console.error('Attempted to remove person without id')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} errorMessage={errorMessage}/>
      <Filter value={newSearch} onChange={handleSearchChange}/>
      <h2>Add new</h2>
      <PersonForm onSubmit={addPerson} valueName={newName} valueNumber={newNumber} onChangeName={handleNameChange} onChangeNumber={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons peopleShown={peopleShown} button={removePerson}/>
    </div>
  )

}

const Filter = (props) => {
  return (
    <div>
      filter shown with: <input value={props.value} onChange={props.onChange}></input>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div> name: <input value={props.valueName} onChange={props.onChangeName}></input></div>
      <div> number: <input value={props.valueNumber} onChange={props.onChangeNumber}></input></div>
      <div> <button type='submit'>add</button></div>
    </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.peopleShown.map(personShown => 
      <p key={personShown.id}>
        {personShown.name} {personShown.number}
        <button onClick={() => props.button(personShown.id)}>delete</button>
        </p>)}
    </div>
  )
}

export default App