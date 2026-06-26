import { all } from "redux-saga/effects";

import { watchTaskSaga } from "@/redux/task/taskSaga";

// Đăng ký tất cả Saga.
export default function* rootSaga() {
  yield all([
    watchTaskSaga(),
    // watchUserSaga();
  ]);
}
