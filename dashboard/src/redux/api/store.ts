import { configureStore } from "@reduxjs/toolkit";
import { marketApi } from "./market";
import { sellerApi } from "./seller";
import { orderApi } from "./order";
import { productApi } from "./product";
import { giftCardApi } from "./giftcard";
import { promocodeApi } from "./promocode";
import { shipperApi } from "./shipper";
import { agentApi } from "./agent";
import { imageApi } from "./image";
import { authApi } from "./auth";

export const store = configureStore({
  reducer: {
    [marketApi.reducerPath]: marketApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [giftCardApi.reducerPath]: giftCardApi.reducer,
    [promocodeApi.reducerPath]: promocodeApi.reducer,
    [shipperApi.reducerPath]: shipperApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      marketApi.middleware,
      sellerApi.middleware,
      orderApi.middleware,
      productApi.middleware,
      giftCardApi.middleware,
      promocodeApi.middleware,
      shipperApi.middleware,
      agentApi.middleware,
      imageApi.middleware,
      authApi.middleware
    ),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
