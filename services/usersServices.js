import { User } from "../schemas/usersSchemas.js";

import HttpError from "../helpers/HttpError.js";

import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import gravatar from "gravatar";

import { config } from "dotenv";

config();

const { SECRET_KEY } = process.env;

export async function signUpUser(userInform, verificationToken) {
  const { email, password } = userInform;
  const user = await User.findOne({ email: userInform.email });
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const data = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  return data;
}

export async function signInUser(userInform) {
  const { email, password } = userInform;
  const user = await User.findOne({ email });

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user || !passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verify");
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

export async function verifyUserEmail(verificationToken) {
  const user = await User.findOne({ verificationToken });
  const data = { isError: false, message: "" };

  if (!user) {
    data.isError = true;
    data.message = "User not found";
    return data
  }

  const userUpdate = await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true }
  );

  if (userUpdate) {
    data.message = "Verification successful";
    return data
  }
}

export async function repeatedVerifyEmail(email) {
  const user = await User.findOne({ email });
  const data = { isError: false, message: "" };

  if (!user) {
    data.isError = true;
    data.message = "User not found";
    return data;
  } 

  if (user.verify) {
    data.isError = true;
    data.message = "Verification has already been passed";
    return data;
  }

  data.token = user.verificationToken;
  data.message = "Verification email sent";

  return data;
}