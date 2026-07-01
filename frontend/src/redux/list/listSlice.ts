import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  CreateListGroupRequest,
  CreateListRequest,
  GetListGroupsRequest,
  GetListsRequest,
  TodoList,
  TodoListGroup,
  UpdateListGroupRequest,
  UpdateListRequest,
} from "@/types/list";

type UpdateListPayload = {
  id: number;
  data: UpdateListRequest;
};

type UpdateListGroupPayload = {
  id: number;
  data: UpdateListGroupRequest;
};

interface ListState {
  lists: TodoList[];
  groups: TodoListGroup[];
  selectedList: TodoList | null;
  loading: boolean;
  groupLoading: boolean;
  loaded: boolean;
  groupsLoaded: boolean;
  error: string | null;
}

const initialState: ListState = {
  lists: [],
  groups: [],
  selectedList: null,
  loading: false,
  groupLoading: false,
  loaded: false,
  groupsLoaded: false,
  error: null,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    getListsRequest(
      state,
      action: PayloadAction<GetListsRequest | undefined>,
    ) {
      void action;
      state.loading = true;
      state.error = null;
    },

    getListsSuccess(state, action: PayloadAction<TodoList[]>) {
      state.loading = false;
      state.loaded = true;
      state.lists = [...action.payload].sort(
        (first, second) => first.position - second.position,
      );
    },

    getListsFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload ?? "Không thể tải danh sách list";
    },

    getListDetailRequest(state, action: PayloadAction<number>) {
      void action;
      state.loading = true;
      state.error = null;
    },

    getListDetailSuccess(state, action: PayloadAction<TodoList>) {
      state.loading = false;
      state.selectedList = action.payload;
    },

    getListDetailFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload ?? "Không thể tải chi tiết list";
    },

    createListRequest(state, action: PayloadAction<CreateListRequest>) {
      void action;
      state.loading = true;
      state.error = null;
    },

    createListSuccess(state, action: PayloadAction<TodoList>) {
      state.loading = false;
      state.lists.push(action.payload);
      state.lists.sort((first, second) => first.position - second.position);
    },

    createListFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload ?? "Không thể tạo list";
    },

    updateListRequest(state, action: PayloadAction<UpdateListPayload>) {
      void action;
      state.loading = true;
      state.error = null;
    },

    updateListSuccess(state, action: PayloadAction<TodoList>) {
      state.loading = false;

      const index = state.lists.findIndex(
        (list) => list.id === action.payload.id,
      );

      if (index !== -1) {
        state.lists[index] = action.payload;
        state.lists.sort((first, second) => first.position - second.position);
      }

      if (state.selectedList?.id === action.payload.id) {
        state.selectedList = action.payload;
      }
    },

    updateListFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload ?? "Không thể cập nhật list";
    },

    removeListRequest(state, action: PayloadAction<number>) {
      void action;
      state.loading = true;
      state.error = null;
    },

    removeListSuccess(state, action: PayloadAction<number>) {
      state.loading = false;
      state.lists = state.lists.filter((list) => list.id !== action.payload);

      if (state.selectedList?.id === action.payload) {
        state.selectedList = null;
      }
    },

    removeListFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload ?? "Không thể xóa list";
    },

    getListGroupsRequest(
      state,
      action: PayloadAction<GetListGroupsRequest | undefined>,
    ) {
      void action;
      state.groupLoading = true;
      state.error = null;
    },

    getListGroupsSuccess(state, action: PayloadAction<TodoListGroup[]>) {
      state.groupLoading = false;
      state.groupsLoaded = true;
      state.groups = [...action.payload].sort(
        (first, second) => first.position - second.position,
      );
    },

    getListGroupsFailure(state, action: PayloadAction<string | undefined>) {
      state.groupLoading = false;
      state.error = action.payload ?? "Không thể tải danh sách group";
    },

    createListGroupRequest(
      state,
      action: PayloadAction<CreateListGroupRequest>,
    ) {
      void action;
      state.groupLoading = true;
      state.error = null;
    },

    createListGroupSuccess(state, action: PayloadAction<TodoListGroup>) {
      state.groupLoading = false;
      state.groups.push(action.payload);
      state.groups.sort((first, second) => first.position - second.position);
    },

    createListGroupFailure(state, action: PayloadAction<string | undefined>) {
      state.groupLoading = false;
      state.error = action.payload ?? "Không thể tạo group";
    },

    updateListGroupRequest(
      state,
      action: PayloadAction<UpdateListGroupPayload>,
    ) {
      void action;
      state.groupLoading = true;
      state.error = null;
    },

    updateListGroupSuccess(state, action: PayloadAction<TodoListGroup>) {
      state.groupLoading = false;

      const index = state.groups.findIndex(
        (group) => group.id === action.payload.id,
      );

      if (index !== -1) {
        state.groups[index] = action.payload;
        state.groups.sort((first, second) => first.position - second.position);
      }
    },

    updateListGroupFailure(state, action: PayloadAction<string | undefined>) {
      state.groupLoading = false;
      state.error = action.payload ?? "Không thể cập nhật group";
    },

    removeListGroupRequest(state, action: PayloadAction<number>) {
      void action;
      state.groupLoading = true;
      state.error = null;
    },

    removeListGroupSuccess(state, action: PayloadAction<number>) {
      state.groupLoading = false;
      state.groups = state.groups.filter((group) => group.id !== action.payload);
      state.lists = state.lists.map((list) =>
        list.groupId === action.payload ? { ...list, groupId: null } : list,
      );
    },

    removeListGroupFailure(state, action: PayloadAction<string | undefined>) {
      state.groupLoading = false;
      state.error = action.payload ?? "Không thể xóa group";
    },

    selectList(state, action: PayloadAction<TodoList | null>) {
      state.selectedList = action.payload;
    },
  },
});

export const {
  getListsRequest,
  getListsSuccess,
  getListsFailure,

  getListDetailRequest,
  getListDetailSuccess,
  getListDetailFailure,

  createListRequest,
  createListSuccess,
  createListFailure,

  updateListRequest,
  updateListSuccess,
  updateListFailure,

  removeListRequest,
  removeListSuccess,
  removeListFailure,

  getListGroupsRequest,
  getListGroupsSuccess,
  getListGroupsFailure,

  createListGroupRequest,
  createListGroupSuccess,
  createListGroupFailure,

  updateListGroupRequest,
  updateListGroupSuccess,
  updateListGroupFailure,

  removeListGroupRequest,
  removeListGroupSuccess,
  removeListGroupFailure,

  selectList,
} = listSlice.actions;

export default listSlice.reducer;
