//сохраняем т.к. при онлайн оплате страница перезагружается
export const currentOrder = useLocalStorage('current_order', null, {
   serializer: { read: v => JSON.parse(v), write: v => JSON.stringify(v) }
})

export const lastOrderForUser = ref(null)