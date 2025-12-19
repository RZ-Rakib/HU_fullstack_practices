import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  return(
    axios 
      .get(baseUrl)
      .then(response => response.data)
  )
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)

  return response.data

}

const update = (id, updatedObject) => {
  return (
    axios 
      .put(`${baseUrl}/${id}`, updatedObject)
      .then(response => response.data)
  )
}

const remove = (id) => {
  return (
    axios
      .delete(`${baseUrl}/${id}`)
      .then(resposne => resposne.data)
  )
}

export default {getAll, create, update, remove, setToken}