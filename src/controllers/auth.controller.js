import fastifyJwt from "@fastify/jwt";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcryptjs from "bcryptjs";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @function loginManager
 * @route POST /auth/manager/login
 * @description login route for manager
 */

const loginManager = async (request, reply) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "Invalid email address");
  if (user.role !== "manager")
    throw new ApiError(400, "Wrong email address for manager");
  const validPassword = await bcryptjs.compare(password, user.password);
  if (!validPassword) throw new ApiError(400, "Invalid credentials");

  const accessToken = await reply.jwtSign(
    {
      id: user._id,
      email: user.email,
    },
    { expiresIn: "1d" },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  reply
    .cookie("accessToken", accessToken, options)
    .code(200)
    .send(new ApiResponse(200, "Manager login successfull", { accessToken }));
};

/**
 * @function loginUser
 * @route POST /api/u/login
 * @description User login functionality
 */
const loginUser = async (request, reply) => {
  const { email, password } = request.body;
  if ([email, password].some((field) => field === undefined))
    throw new ApiError("Request body is missing [name, password]");
  const [err, user] = await asyncHandler(User.findOne({ email }));
  console.log(user);
  if (err) return reply.send(err);
};

/**
 * @function createManager
 * @route POST /api/manager/register
 */
const createManager = async (request, reply) => {
  const { name, email, password, phoneNumber } = request.body;
  if (
    [name, email, password, phoneNumber].some(
      (field) => field?.trim() === undefined || field?.trim() === "",
    )
  )
    throw new ApiError("Request body is missing [name, email, password]");

  const existingManager = await User.findOne({ email });
  if (existingManager) throw new ApiError("Manager email already exists");

  const hashedPassword = await bcryptjs.hash(password, 10);
  const manager = await User.create({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
    role: "manager",
  });
  if (!manager) throw new ApiError("Failed to create manager");
  reply.code(201).send(new ApiResponse(201, "Manager created successfully"));
};

export { loginManager, loginUser, createManager };
