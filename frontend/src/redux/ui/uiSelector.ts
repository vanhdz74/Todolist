import type { RootState } from "@/app/store";

export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;
