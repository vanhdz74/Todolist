import { api } from "./axios";

import type {
  CreateListRequest,
  CreateListResponse,
  CreateListGroupRequest,
  CreateListGroupResponse,
  GetListGroupsRequest,
  GetListGroupsResponse,
  GetListDetailResponse,
  GetListsRequest,
  GetListsResponse,
  UpdateListGroupRequest,
  UpdateListGroupResponse,
  UpdateListRequest,
  UpdateListResponse,
  ListShareRequest,
  ListShareResponse,
} from "@/types/list";

// Call api vs axios
export const listApi = {
  getAll(params?: GetListsRequest) {
    return api.get<GetListsResponse>("/lists", {
      params,
    });
  },

  getById(id: number) {
    return api.get<GetListDetailResponse>(`/lists/${id}`);
  },

  create(data: CreateListRequest) {
    return api.post<CreateListResponse>("/lists", data);
  },

  update(id: number, data: UpdateListRequest) {
    return api.patch<UpdateListResponse>(`/lists/${id}`, data);
  },

  remove(id: number) {
    return api.delete<void>(`/lists/${id}`);
  },
};

// Các api CRUD vs group
export const listGroupApi = {
  getAll(params?: GetListGroupsRequest) {
    return api.get<GetListGroupsResponse>("/listGroups", {
      params,
    });
  },

  getById(id: number) {
    return api.get<UpdateListGroupResponse>(`/listGroups/${id}`);
  },

  create(data: CreateListGroupRequest) {
    return api.post<CreateListGroupResponse>("/listGroups", data);
  },

  update(id: number, data: UpdateListGroupRequest) {
    return api.patch<UpdateListGroupResponse>(`/listGroups/${id}`, data);
  },

  remove(id: number) {
    return api.delete<void>(`/listGroups/${id}`);
  },
};

// Share link mời
export const listShareApi = {
  getOrCreate(listId: number, data: ListShareRequest) {
    return api.post<ListShareResponse>(`/lists/${listId}/share`, data);
  },
};
