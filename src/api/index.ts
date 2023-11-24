import axios from 'axios'

export async function getReportData() {
  const response = await axios.get('https://api.github.com/repos/TanStack/query')
  return response.data
}
