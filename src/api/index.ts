import axios from 'axios'

export async function getFakeData() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
  return response.data
}
