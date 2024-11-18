import qs from "qs";
import { BlogInput, BlogWithId } from "../src/types";
import { blogsService } from "../src/domain/services/blogs.service";
import { faker } from "@faker-js/faker";
import supertest, { Response } from "supertest";
import TestAgent from "supertest/lib/agent";
import { Result } from "../src/common/types/common.types";

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
): Promise<Result<BlogWithId | null>[]> => {
  const promises: Promise<Result<BlogWithId | null>>[] = [];

  for (let i = 0; i < count; i++) {
    const blog = blogsService.addBlog(getMockBlogInput(names?.[i] ?? null));

    promises.push(blog);
  }

  return Promise.all(promises);
};

export const getMockBlogInput = (name?: string | null): BlogInput => ({
  name: name || faker.person.firstName(),
  description: faker.commerce.productDescription(),
  websiteUrl: faker.internet.url(),
});

export const withAuthCredentials = async (
  //@ts-ignore
  req: (typeof supertest)["SuperTestStatic"]["Test"]
): Promise<Response> => req.set("Authorization", "Basic YWRtaW46cXdlcnR5");
