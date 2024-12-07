import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export async function authDecorator(request, reply) {
  await request.jwtVerify();
}

export async function authManger(request, reply) {
  const user = await User.findById(request.user.id);
  if (!user) throw new Error();

  if (user.isDeleted || user.role !== "manager")
    throw new ApiError(401, "Unauthorized access");
}
