import {
  registerUserSchema,
  changeSubscriptionSchema,
} from "../schemas/usersSchemas.js";

import {
  signUpUser,
  logOutUser,
  signInUser,
  changeSubscription,
} from "../services/usersServices.js";

import HttpError from "../helpers/HttpError.js";

export const registerUser = async (req, res, next) => {
  try {
    const { error } = registerUserSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const data = await signUpUser(req.body);

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
