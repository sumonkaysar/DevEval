import { models } from "../../../prisma/db";

export enum Role {
  ADMIN = "ADMIN",
  MENTOR = "MENTOR",
  STUDENT = "STUDENT",
}

export type TUser = NonNullable<Awaited<ReturnType<typeof models.User.first>>>;

export type TCreateUserInput = Parameters<typeof models.User.create>[0];

export type TUpdateUserInput = Parameters<typeof models.User.update>[0];
