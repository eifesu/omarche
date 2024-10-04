import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { marketsApi } from "./api/markets.api"
import { ordersApi } from "./api/orders.api"
import { productsApi } from "./api/products.api"
import { sellersApi } from "./api/sellers.api"
import { staffApi } from "./api/staff.api"

export const store = configureStore({
  reducer: {
    [marketsApi.reducerPath]: marketsApi.reducer,
    [sellersApi.reducerPath]: sellersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(marketsApi.middleware)
      .concat(sellersApi.middleware)
      .concat(productsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(staffApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
