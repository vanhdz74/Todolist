import { all } from "redux-saga/effects";

import { watchTaskSaga } from "@/redux/task/taskSaga";
import { watchListSaga } from "@/redux/list/listSaga";

// Đăng ký tất cả Saga.
export default function* rootSaga() {
  yield all([watchTaskSaga(), watchListSaga()]);
}
