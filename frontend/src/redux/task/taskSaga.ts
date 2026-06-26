import { call, put, takeLatest } from "redux-saga/effects";

import { taskApi } from "@/services/task.api";

import { getTasksRequest, getTasksSuccess, getTasksFailure } from "./taskSlice";

// Saga xử lý side effect.
function* getTasksSaga() {
  try {
    // Saga gọi taskApi.getAll()
    const response = yield call(taskApi.getAll);

    // Dispatch action getTasksSuccess với dữ liệu trả về từ API
    yield put(getTasksSuccess(response.data));
  } catch {
    yield put(getTasksFailure());
  }
}

export function* watchTaskSaga() {
  yield takeLatest(getTasksRequest.type, getTasksSaga);
}
