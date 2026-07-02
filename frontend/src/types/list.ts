export type TodoList = {
  id: number;
  name: string;
  color: string;
  groupId?: number | null;
  position: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type TodoListGroup = {
  id: number;
  name: string;
  position: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type ListShareOwner = {
  id: number | string;
  name: string;
  email: string;
  initials: string;
};

export type ListShareRequest = {
  origin: string;
  owner: ListShareOwner;
};

export type ListShareResponse = {
  id: number;
  listId: number;
  code: string;
  inviteUrl: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  owner: ListShareOwner | null;
};

export type GetListsRequest = {
  userId?: number;
};

export type GetListsResponse = TodoList[];

export type GetListDetailResponse = TodoList;

export type CreateListRequest = {
  name: string;
  color: string;
  groupId?: number | null;
  position: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateListResponse = TodoList;

export type UpdateListRequest = Partial<{
  name: string;
  color: string;
  groupId?: number | null;
  position: number;
  updatedAt: string;
}>;

export type UpdateListResponse = TodoList;

export type GetListGroupsRequest = {
  userId?: number;
};

export type GetListGroupsResponse = TodoListGroup[];

export type CreateListGroupRequest = {
  name: string;
  position: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateListGroupResponse = TodoListGroup;

export type UpdateListGroupRequest = Partial<{
  name: string;
  position: number;
  updatedAt: string;
}>;

export type UpdateListGroupResponse = TodoListGroup;
