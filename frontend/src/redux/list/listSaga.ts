import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { AxiosResponse } from "axios";

import { listApi, listGroupApi } from "@/services/list.api";

import type {
  CreateListGroupResponse,
  CreateListResponse,
  GetListGroupsResponse,
  GetListDetailResponse,
  GetListsResponse,
  UpdateListGroupResponse,
  UpdateListResponse,
} from "@/types/list";

import {
  createListFailure,
  createListGroupFailure,
  createListGroupRequest,
  createListGroupSuccess,
  createListRequest,
  createListSuccess,
  getListDetailFailure,
  getListDetailRequest,
  getListDetailSuccess,
  getListGroupsFailure,
  getListGroupsRequest,
  getListGroupsSuccess,
  getListsFailure,
  getListsRequest,
  getListsSuccess,
  removeListGroupFailure,
  removeListGroupRequest,
  removeListGroupSuccess,
  removeListFailure,
  removeListRequest,
  removeListSuccess,
  updateListGroupFailure,
  updateListGroupRequest,
  updateListGroupSuccess,
  updateListFailure,
  updateListRequest,
  updateListSuccess,
} from "./listSlice";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;

  return "Có lỗi xảy ra";
};

function* getListsSaga(
  action: ReturnType<typeof getListsRequest>,
): SagaIterator {
  try {
    const response: AxiosResponse<GetListsResponse> = yield call(
      listApi.getAll,
      action.payload,
    );

    yield put(getListsSuccess(response.data));
  } catch (error) {
    yield put(getListsFailure(getErrorMessage(error)));
  }
}

function* getListDetailSaga(
  action: ReturnType<typeof getListDetailRequest>,
): SagaIterator {
  try {
    const response: AxiosResponse<GetListDetailResponse> = yield call(
      listApi.getById,
      action.payload,
    );

    yield put(getListDetailSuccess(response.data));
  } catch (error) {
    yield put(getListDetailFailure(getErrorMessage(error)));
  }
}

function* createListSaga(
  action: ReturnType<typeof createListRequest>,
): SagaIterator {
  try {
    const response: AxiosResponse<CreateListResponse> = yield call(
      listApi.create,
      action.payload,
    );

    yield put(createListSuccess(response.data));
  } catch (error) {
    yield put(createListFailure(getErrorMessage(error)));
  }
}

function* updateListSaga(
  action: ReturnType<typeof updateListRequest>,
): SagaIterator {
  try {
    const { id, data } = action.payload;

    const response: AxiosResponse<UpdateListResponse> = yield call(
      listApi.update,
      id,
      data,
    );

    yield put(updateListSuccess(response.data));
  } catch (error) {
    yield put(updateListFailure(getErrorMessage(error)));
  }
}

function* removeListSaga(
  action: ReturnType<typeof removeListRequest>,
): SagaIterator {
  try {
    const id = action.payload;

    yield call(listApi.remove, id);

    yield put(removeListSuccess(id));
  } catch (error) {
    yield put(removeListFailure(getErrorMessage(error)));
  }
}

function* getListGroupsSaga(
  action: ReturnType<typeof getListGroupsRequest>,
): SagaIterator {
  try {
    const response: AxiosResponse<GetListGroupsResponse> = yield call(
      listGroupApi.getAll,
      action.payload,
    );

    yield put(getListGroupsSuccess(response.data));
  } catch (error) {
    yield put(getListGroupsFailure(getErrorMessage(error)));
  }
}

function* createListGroupSaga(
  action: ReturnType<typeof createListGroupRequest>,
): SagaIterator {
  try {
    const response: AxiosResponse<CreateListGroupResponse> = yield call(
      listGroupApi.create,
      action.payload,
    );

    yield put(createListGroupSuccess(response.data));
  } catch (error) {
    yield put(createListGroupFailure(getErrorMessage(error)));
  }
}

function* updateListGroupSaga(
  action: ReturnType<typeof updateListGroupRequest>,
): SagaIterator {
  try {
    const { id, data } = action.payload;

    const response: AxiosResponse<UpdateListGroupResponse> = yield call(
      listGroupApi.update,
      id,
      data,
    );

    yield put(updateListGroupSuccess(response.data));
  } catch (error) {
    yield put(updateListGroupFailure(getErrorMessage(error)));
  }
}

function* removeListGroupSaga(
  action: ReturnType<typeof removeListGroupRequest>,
): SagaIterator {
  try {
    const id = action.payload;

    yield call(listGroupApi.remove, id);

    yield put(removeListGroupSuccess(id));
  } catch (error) {
    yield put(removeListGroupFailure(getErrorMessage(error)));
  }
}

export function* watchListSaga() {
  yield takeLatest(getListsRequest.type, getListsSaga);
  yield takeLatest(getListDetailRequest.type, getListDetailSaga);
  yield takeLatest(createListRequest.type, createListSaga);
  yield takeLatest(updateListRequest.type, updateListSaga);
  yield takeLatest(removeListRequest.type, removeListSaga);
  yield takeLatest(getListGroupsRequest.type, getListGroupsSaga);
  yield takeLatest(createListGroupRequest.type, createListGroupSaga);
  yield takeLatest(updateListGroupRequest.type, updateListGroupSaga);
  yield takeLatest(removeListGroupRequest.type, removeListGroupSaga);
}
