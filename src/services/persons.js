import axios from "axios";
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = personObject => {
    const request = axios.post(baseUrl, personObject)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
        const request = axios.delete(`${baseUrl}/${id}`)
        return request.then(response => response.data)
}

const changeNumber = (id, sameName, newNumber) => {
    const request = axios.put(`${baseUrl}/${id}`, {name: sameName, number: newNumber})
    return request.then(response => response.data)
}

export default {getAll, create, deletePerson, changeNumber}