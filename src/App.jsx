import { useEffect, useState } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => { 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [persons, setPersons] = useState([])
  const [newSearch, setSearch] = useState('')
  const [message, setMessage] = useState('Message')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  },[])

  const addPerson = (event) => {
    event.preventDefault()

    const personExist = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    const numberExist = persons.find(person => person.number === newNumber)

    const newPerson = { "name": newName, "number": newNumber }

    if(personExist) {

      if(numberExist) {
        alert(`Number ${newNumber} is already added to the phonebook`)
      }
      else {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
        {
          personService
          .changeNumber(personExist._id, newPerson)
          .then((returnedPerson) => {
            console.log('returned person:', returnedPerson)
            setMessage(`${newName}'s number changed to ${newNumber}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000);
            const updatedPersons = persons.map((person) => {
              if (person._id == personExist._id) {
                return returnedPerson.data
              }
              return person
            })
            console.log("These are the updated: ", updatedPersons)
            setPersons(updatedPersons)
            

            // setPersons(prevPersons => {
            //   const updatedList = prevPersons.map(p => p.id === returnedPerson.id ? {...p, number: newNumber} : p)
            //   console.log('PÄIVTYSSSS', updatedList, returnedPerson)
            //   return updatedList
            // })
          })
            .catch(error => {
              console.log(error.message)
              setErrorMessage(`Error is ${error.message}`)
              setTimeout(() => setErrorMessage(null), 5000);
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
        const updatedPersons = [...persons, returnedPerson]
        setPersons(updatedPersons)
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
    }
  

  const removePerson = (_id) => {
    if(_id){
      if(window.confirm('Are you sure?')) {
        personService
        .deletePerson(_id)
        .then(() => {
          const deletedP = persons.find(p => p._id === _id)
          setMessage(`Removed ${deletedP.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000);
          const filteredPersons = persons.filter(person => person._id !== _id)
        setPersons(filteredPersons)
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
      <Persons persons={persons} button={removePerson} searchTerm={newSearch}/>
    </div>
  )
}

export default App