import { api } from '@/api/api'

export const company = ref(null)

export async function loadCompany() {
  const response = await api.get('/company')
  company.value = response.data.data
}
