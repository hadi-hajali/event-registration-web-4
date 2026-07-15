import { apiClient } from "../client";
import type { Category } from "../../types/category";

type CategoryRequest = {
  name: string;
  description: string;
};

export const getCategories = (includeInactive = false) => {
  return apiClient.get<Category[]>("/api/categories", { includeInactive });
};



export const createCategory = (
  data: CategoryRequest
) => {
  return apiClient.post<Category>(
    "/api/categories",
    data
  );
};



export const updateCategory = (
  id: number,
  data: CategoryRequest & { isActive: boolean }
) => {

  return apiClient.put<Category>(
    `/api/categories/${id}`,
    {
      id,
      ...data
    }
  );

};



export const deleteCategory = (
  id: number
) => {

  return apiClient.delete<void>(
    `/api/categories/${id}`
  );

};
