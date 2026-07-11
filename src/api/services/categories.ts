import { apiClient } from "../client";
import type { Category } from "../../types/category";


export const getCategories = () => {
  return apiClient.get<Category[]>("/categories");
};



export const createCategory = (
  data: {
    name: string;
    description: string;
  }
) => {
  return apiClient.post<Category>(
    "/categories",
    data
  );
};



export const updateCategory = (
  id: number,
  data: {
    name: string;
    description: string;
    isActive: boolean;
  }
) => {

  return apiClient.put<Category>(
    `/categories/${id}`,
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
    `/categories/${id}`
  );

};
