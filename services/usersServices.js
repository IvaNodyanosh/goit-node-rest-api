import { User } from "../schemas/usersSchemas.js";

import HttpError from "../helpers/HttpError.js";

import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import gravatar from "gravatar";

import { config } from "dotenv";

config();

const { SECRET_KEY } = process.env;

export async function signUpUser(userInform) {
  const { email, password } = userInform;
  const user = await User.findOne({ email: userInform.email });
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const data = await User.create({ email, password: hashPassword, avatarURL });

  return data;
}

export async function signInUser(userInform) {
  const { email, password } = userInform;
  const user = await User.findOne({ email });

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user || !passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };

  const token = jsonwebtoken.sign(payload, SECRET_KEY, {
    expiresIn: "23h",
  });

  await User.findOneAndUpdate({ _id: user._id }, { token });

  return { token, user };
}

export async function logOutUser(id) {
  return await User.findOneAndUpdate({ _id: id }, { token: "" }, { new: true });
}

export async function changeSubscription(id, subscription) {
  return await User.findOneAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
}

export async function changeAvatarUser(id, avatarURL) {
  return await User.findOneAndUpdate({ _id: id }, { avatarURL }, { new: true });
}
