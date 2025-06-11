export default defineEventHandler(async (event) => {
   const config = useRuntimeConfig() 

   const body = await readBody(event)

   const response = await fetch(config.dadataAddressApiUrl, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json',
         'Authorization': 'Token ' + config.dadataApiKey
      },
      body: JSON.stringify(body)
   })

   return await response.json()
})