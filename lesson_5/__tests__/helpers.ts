import qs from "qs";
import { BlogWithId } from "../src/types";
import { blogsService } from "../src/domain/services/blogs.service";
import { faker } from "@faker-js/faker";

export const generateFiltersOptions = (
  pageSize?: number,
  pageNumber?: number,
  sortBy?: string,
  sortDirection?: string,
  searchNameTerm?: string
) =>
  `?${qs.stringify({
    pageSize,
    pageNumber,
    sortBy,
    sortDirection,
    searchNameTerm,
  })}`;

export const addMockBlogs = async (
  count: number,
  names?: string[]
): Promise<(BlogWithId | null)[]> => {
  const promises: Promise<BlogWithId | null>[] = [];

  for (let i = 0; i < count; i++) {
    const blog = blogsService.addBlog({
      name: names?.[i] || faker.person.firstName(),
      description: faker.commerce.productDescription(),
      websiteUrl: faker.internet.url(),
    });

    promises.push(blog);
  }

  return Promise.all(promises);
};
