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
} from "@/types/list";

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

export const listGroupApi = {
  getAll(params?: GetListGroupsRequest) {
    return api.get<GetListGroupsResponse>("/listGroups", {
      params,
    });
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
