import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { userLoginZodSchema, userRegisterZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(userRegisterZodSchema),
  AuthControllers.registerUser,
);

router.post(
  "/login",
  validateRequest(userLoginZodSchema),
  AuthControllers.credentialsLogin,
);

router.get("/logout", checkAuth(), AuthControllers.logout);

router.patch("/change-password", checkAuth(), AuthControllers.changePassword);

router.get("/refresh-token", AuthControllers.getNewAccessToken);

export const AuthRoutes = router;
