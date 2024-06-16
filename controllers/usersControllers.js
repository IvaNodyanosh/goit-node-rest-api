import {
  registerUserSchema,
  changeSubscriptionSchema,
  emailValidateSchema,
} from "../schemas/usersSchemas.js";

import {
  signUpUser,
  logOutUser,
  signInUser,
  changeSubscription,
  changeAvatarUser,
  verifyUserEmail,
  repeatedVerifyEmail,
} from "../services/usersServices.js";

import Jimp from "jimp";

import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import { sendEmails } from "../helpers/sendEmails.js";

import fs from "fs/promises";

import path from "path";

import { fileURLToPath } from "url";

export const registerUser = async (req, res, next) => {
  const verificationToken = nanoid();

  try {
    const { error } = registerUserSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const data = await signUpUser(req.body, verificationToken);

    sendEmails(data.email, verificationToken);

    res
      .status(201)
      .json({ user: { email: data.email, subscription: "starter" } });
  } catch (error) {
    next(error);
  }
};

export const logInUser = async (req, res, next) => {
  try {
    const { error } = registerUserSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { token, user } = await signInUser(req.body);

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

export const logout = async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await logOutUser(_id);

    res.status(204).json(data);
  } catch (error) {
    next(error);
  }
};

export const changeSubscriptionUser = async (req, res) => {
  const { error } = changeSubscriptionSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }

  const { _id: id } = req.user;
  const { subscription } = req.body;

  try {
    const data = await changeSubscription(id, subscription);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const changeAvatar = async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const { _id } = req.user;
  console.log(req.file);
  const { path: temporaryName, originalname } = req.file;
  const nameFile = `${_id}_${originalname}`;
  const fileName = path.join(__dirname, "../public/avatars", nameFile);
  const avatarURL = `/avatars/${nameFile}`;

  try {
    await changeAvatarUser(_id, avatarURL);

    Jimp.read(temporaryName, (err, img) => {
      if (err) next(err);
      img
        .resize(250, 250) // resize
        .write(fileName); // save
    });

    fs.unlink(temporaryName);
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const { isError, message } = await verifyUserEmail(verificationToken);

    if (isError) {
      throw HttpError(404, message);
    }

    res.status(200).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const repeatedVerify = async (req, res, next) => {
  try {
    const { error } = emailValidateSchema.validate(req.body);
    const { email } = req.body;

    if (error) {
      throw HttpError(400, error.message);
    }

    const { isError, message, token } = await repeatedVerifyEmail(email);

    if (isError) {
      throw HttpError(404, message);
    }

    sendEmails(email, token);

    res.status(200).json({message})
  } catch (error) {
    next(error);
  }
};
