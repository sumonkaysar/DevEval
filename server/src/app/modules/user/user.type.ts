import { models } from "../../../prisma/db";

export type TUser = Awaited<ReturnType<typeof models.User.first>>;

export type TCreateUserInput = Parameters<typeof models.User.create>[0];

export type TUpdateUserInput = Parameters<typeof models.User.update>[0];
