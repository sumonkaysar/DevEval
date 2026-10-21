/* eslint-disable no-console */
import { hash } from "bcryptjs";
import { models } from "../../prisma/db";
import { env } from "../config/env.config";
import { TCreateUserInput } from "../modules/user/user.type";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await models.User.where({
      email: env.ADMIN_EMAIL,
    }).first();

    if (isAdminExist) {
      console.log(" admin already exists!");
      return;
    }

    console.log("Trying to create  admin...");

    const hashedPassword = await hash(
      env.ADMIN_PASS,
      Number(env.BCRYPTJS_SALT_ROUND),
    );

    const data: TCreateUserInput = {
      firstName: env.ADMIN_FIRST_NAME,
      lastName: env.ADMIN_LAST_NAME,
      email: env.ADMIN_EMAIL,
      password: hashedPassword,
    };

    await models.User.create(data);

    console.log("Admin created successfully");
  } catch (error) {
    console.log(error);
  }
};
