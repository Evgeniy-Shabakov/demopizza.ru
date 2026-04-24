export const ORDER_TYPE = Object.freeze({
   DELIVERY_TO_ADDRESS: {
      ID: 1,
      NAME: 'доставка до адреса',
      SHORT_NAME_FOR_ORDER_PANEL: 'доставка'
   },

   PICK_UP_AT_COUNTER: {
      ID: 2,
      NAME: 'самовывоз (выдача у бара)',
      SHORT_NAME_FOR_ORDER_PANEL: 'самовывоз'
   },

   PICK_UP_AT_CAR_WINDOW: {
      ID: 3,
      NAME: 'самовывоз (выдача в окне для авто)'
   },

   AT_RESTAURANT_AT_COUNTER: {
      ID: 4,
      NAME: 'в ресторане (выдача у бара)',
      SHORT_NAME_FOR_ORDER_PANEL: 'в ресторане'
   },

   AT_RESTAURANT_TO_TABLE: {
      ID: 5,
      NAME: 'в ресторане (к столику)',
      SHORT_NAME_FOR_ORDER_PANEL: 'в ресторане'
   },

   DELIVERY_TO_RESTAURANT_PARKING: {
      ID: 6,
      NAME: 'доставка на парковку у ресторана (к машине)'
   }
})