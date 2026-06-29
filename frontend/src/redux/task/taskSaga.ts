import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { AxiosResponse } from "axios";

import { taskApi } from "@/services/task.api";
import type { GetTasksResponse } from "@/types/task";

import { getTasksRequest, getTasksSuccess, getTasksFailure } from "./taskSlice";

// Saga xử lý side effect.
function* getTasksSaga(): SagaIterator {
  try {
    // Saga gọi taskApi.getAll()
    const response: AxiosResponse<GetTasksResponse> = yield call(taskApi.getAll);

    // Dispatch action getTasksSuccess với dữ liệu trả về từ API
    yield put(getTasksSuccess(response.data));
  } catch {
    yield put(getTasksFailure());
  }
}

export function* watchTaskSaga() {
  yield takeLatest(getTasksRequest.type, getTasksSaga);
}
