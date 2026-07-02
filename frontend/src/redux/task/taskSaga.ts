import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { AxiosResponse } from "axios";

import { taskApi } from "@/services/task.api";

import type {
  CreateTaskResponse,
  GetTasksResponse,
  TaskAttachment,
  TaskCategory,
  TaskCategoryLink,
  TaskStep,
  UpdateTaskResponse,
} from "@/types/task";

import {
  getTasksRequest,
  getTasksSuccess,
  getTasksFailure,
  getTaskDetailRequest,
  getTaskDetailSuccess,
  getTaskDetailFailure,
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  removeTaskRequest,
  removeTaskSuccess,
  removeTaskFailure,
} from "./taskSlice";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;

  return "Có lỗi xảy ra";
};

const groupByTaskId = <Item extends { taskId: number }>(items: Item[]) => {
  return items.reduce<Record<number, Item[]>>((result, item) => {
    result[item.taskId] = [...(result[item.taskId] ?? []), item];

    return result;
  }, {});
};

// Lấy danh sách task
function* getTasksSaga(
  action: ReturnType<typeof getTasksRequest>,
): SagaIterator {
  try {
    const response: AxiosResponse<GetTasksResponse> = yield call(
      taskApi.getAll,
      action.payload,
    );

    try {
      const [
        stepsResponse,
        categoriesResponse,
        taskCategoriesResponse,
        attachmentsResponse,
      ]: [
        AxiosResponse<TaskStep[]>,
        AxiosResponse<TaskCategory[]>,
        AxiosResponse<TaskCategoryLink[]>,
        AxiosResponse<TaskAttachment[]>,
      ] = yield all([
        call(taskApi.getSteps),
        call(taskApi.getCategories),
        call(taskApi.getTaskCategories),
        call(taskApi.getAttachments),
      ]);

      const stepsByTaskId = groupByTaskId(stepsResponse.data);
      const attachmentsByTaskId = groupByTaskId(attachmentsResponse.data);
      const categoryById = new Map(
        categoriesResponse.data.map((category) => [category.id, category]),
      );
      const categoryLinksByTaskId = groupByTaskId(taskCategoriesResponse.data);
      const tasks = response.data.map((task) => ({
        ...task,
        steps: stepsByTaskId[task.id] ?? [],
        categories: (categoryLinksByTaskId[task.id] ?? [])
          .map((link) => categoryById.get(link.categoryId))
          .filter((category): category is TaskCategory => Boolean(category)),
        attachments: attachmentsByTaskId[task.id] ?? [],
      }));

      yield put(getTasksSuccess(tasks));
    } catch {
      yield put(getTasksSuccess(response.data));
    }
  } catch (error) {
    yield put(getTasksFailure(getErrorMessage(error)));
  }
}

// Lấy chi tiết một task khi mở panel
function* getTaskDetailSaga(
  action: ReturnType<typeof getTaskDetailRequest>,
): SagaIterator {
  try {
    const taskId = action.payload;

    const [
      taskResponse,
      stepsResponse,
      categoriesResponse,
      taskCategoriesResponse,
      attachmentsResponse,
    ]: [
      AxiosResponse<UpdateTaskResponse>,
      AxiosResponse<TaskStep[]>,
      AxiosResponse<TaskCategory[]>,
      AxiosResponse<TaskCategoryLink[]>,
      AxiosResponse<TaskAttachment[]>,
    ] = yield all([
      call(taskApi.getById, taskId),
      call(taskApi.getSteps, { taskId }),
      call(taskApi.getCategories),
      call(taskApi.getTaskCategories, { taskId }),
      call(taskApi.getAttachments, { taskId }),
    ]);

    const categoryById = new Map(
      categoriesResponse.data.map((category) => [category.id, category]),
    );
    const categories = taskCategoriesResponse.data.reduce<TaskCategory[]>(
      (result, link) => {
        const category = categoryById.get(link.categoryId);

        if (category) {
          result.push({ ...category, linkId: link.id });
        }

        return result;
      },
      [],
    );

    yield put(
      getTaskDetailSuccess({
        ...taskResponse.data,
        steps: stepsResponse.data.sort(
          (first, second) => first.order - second.order,
        ),
        categories,
        attachments: attachmentsResponse.data,
      }),
    );
  } catch (error) {
    yield put(getTaskDetailFailure(getErrorMessage(error)));
  }
}

// Tạo task
function* createTaskSaga(
  action: ReturnType<typeof createTaskRequest>,
): SagaIterator {
  try {
    const response: AxiosResponse<CreateTaskResponse> = yield call(
      taskApi.create,
      action.payload,
    );

    yield put(createTaskSuccess(response.data));
  } catch (error) {
    yield put(createTaskFailure(getErrorMessage(error)));
  }
}

// Cập nhật task
function* updateTaskSaga(
  action: ReturnType<typeof updateTaskRequest>,
): SagaIterator {
  try {
    const { id, data } = action.payload;

    const response: AxiosResponse<UpdateTaskResponse> = yield call(
      taskApi.update,
      id,
      data,
    );

    yield put(updateTaskSuccess(response.data));
  } catch (error) {
    yield put(updateTaskFailure(getErrorMessage(error)));
  }
}

// Xóa task
function* removeTaskSaga(
  action: ReturnType<typeof removeTaskRequest>,
): SagaIterator {
  try {
    const id = action.payload;

    yield call(taskApi.remove, id);

    yield put(removeTaskSuccess(id));
  } catch (error) {
    yield put(removeTaskFailure(getErrorMessage(error)));
  }
}

export function* watchTaskSaga() {
  yield takeLatest(getTasksRequest.type, getTasksSaga);
  yield takeLatest(getTaskDetailRequest.type, getTaskDetailSaga);
  yield takeLatest(createTaskRequest.type, createTaskSaga);
  yield takeEvery(updateTaskRequest.type, updateTaskSaga);
  yield takeLatest(removeTaskRequest.type, removeTaskSaga);
}
