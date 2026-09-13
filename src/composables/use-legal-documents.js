import { api } from '@/api/api'

export const legalDocuments = ref(null)

export async function loadLegalDocuments() {
   const response = await api.get('/legal-documents')
   legalDocuments.value = response.data.data
}
