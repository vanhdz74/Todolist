import { configureStore } from "@reduxjs/toolkit";

import createSagaMiddleware from "redux-saga";

import taskReducer from "@/redux/task/taskSlice";

import rootSaga from "./rootSaga";

// Khởi tạo Redux Store.
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    task: taskReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
