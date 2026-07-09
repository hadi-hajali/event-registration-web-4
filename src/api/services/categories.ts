import { del, get, post, put } from '../client';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types/category';

export async function getCategories(includeInactive: boolean): Promise<Category[]> {
  const query = includeInactive ? '?includeInactive=true' : '?includeInactive=false';
  return get<Category[]>(`/api/categories${query}`);
}

export async function getCategoryById(id: number): Promise<Category> {
  return get<Category>(`/api/categories/${id}`);
}

export async function createCategory(payload: CreateCategoryRequest): Promise<Category> {
  return post<Category>('/api/categories', payload);
}

export async function updateCategory(id: number, payload: UpdateCategoryRequest): Promise<Category> {
  return put<Category>(`/api/categories/${id}`, payload);
}

export async function deleteCategory(id: number): Promise<void> {
  await del(`/api/categories/${id}`);
}
