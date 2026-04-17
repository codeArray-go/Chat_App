import { genrateToken } from "../utils/token.js";
import cloudinary from "../lib/cloudinary.js";
import {
  ValidatorForLogin,
  ValidatorForProfilePicUpdate,
  ValidatorForSignUp,
} from "../utils/validator.js";
import { hashPassword } from "../utils/hash.js";
import {
  createNewUserRepo,
  extingEmailCheckRepo,
  updateProfilePicRepo,
} from "../repositories/auth.repository.js";
import bcrypt from "bcryptjs";

export const signUpService = async ({ full_name, email, password }, res) => {
  const error = ValidatorForSignUp({ full_name, email, password });
  if (error) throw new Error(error);

  const existingUser = await extingEmailCheckRepo(email);

  if (existingUser) {
    return "User already existing, try creating with different email address.";
  }

  const hashedPass = await hashPassword(password);
  const createdUser = await createNewUserRepo({ full_name, email, hashedPass });

  if (createdUser) {
    const token = genrateToken(createdUser.id, res);
    const data = {
      token,
      id: createdUser.id,
      full_name: createdUser.full_name,
      email: createdUser.email,
      profile_pic: createdUser.profile_pic,
    };
    return data;
  }
};

export const loginService = async ({ email, password }, res) => {
  const error = ValidatorForLogin({ email, password });
  if (error) throw new Error(error);

  const user = await extingEmailCheckRepo(email);
  if (!user) return "Invalid credentials.";

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) return "Invalid credentials.";

  const token = genrateToken(user.id, res);
  const data = {
    token,
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    profile_pic: user.profile_pic,
  };
  return data;
};

export const updateProfilePicService = async ({ profile_pic, userId }) => {
  const error = ValidatorForProfilePicUpdate({ profile_pic });
  if (error) throw new Error(error);

  const url = (await cloudinary.uploader.upload(profile_pic)).secure_url;
  const profilePic = await updateProfilePicRepo({ url, userId });
  return profilePic;
};
