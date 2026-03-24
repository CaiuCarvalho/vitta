export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
}
