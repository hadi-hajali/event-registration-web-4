export type Category = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryRequest = {
  name: string;
  description: string;
  isActive: boolean;
};

export type UpdateCategoryRequest = CreateCategoryRequest;
