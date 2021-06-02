import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import mongoose from "mongoose";
import { transport } from "../config/nodemailer.config";
import Invite from "../models/invites.model";
import { nanoid } from "nanoid";
import { validateEmail } from "../helper/validate-email";

export const registerUser = async (userDetails, res) => {
  try {
    const { name, email, password, confirmPassword } = userDetails;
    // Some simple validations
    if (!name || !email || !password || password !== confirmPassword) {
      return res.status(400).json({ msg: "Please enter all fields correctly" });
    }
    let parent;
    // Checking for existing users
    let existingUser = await User.findOne({ email }).exec();
    if (existingUser) return res.status(400).json({ msg: "User already exists", email: email });
    if (userDetails.parentReferralCode) {
      const parentUser = await User.findOne({
        referralCode: userDetails.parentReferralCode,
      }).exec();
      if (parentUser) {
        parent = parentUser._id;
      } else {
        return res
          .status(404)
          .json({ msg: "Referral code is not valid ! Please check again" });
      }
    } else {
      parent = userDetails.parent ? userDetails.parent : null;
    }
    const newUser = new User({
      name,
      email,
      password,
      confirmPassword,
      parent,
    });
    const userValidation = newUser.joiValidate(newUser);
    if (userValidation.error) {
      return res.status(400).json({
        msg: "Validation error !! Please check the request body",
        error: userValidation.error.details,
      });
    }
    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.confirmPassword = hash;
        newUser.referralCode = nanoid();
        newUser.parent = parent ? parent : null;
        newUser.parentReferralCode = userDetails.parentReferralCode
          ? userDetails.parentReferralCode
          : null;
        // Saving newUser details
        newUser.save().then((user) => {
          // buildAncestors(user._id, parent)
          jwt.sign(
            { id: user.id, email: user.email, referralCode: user.referralCode },
            "secretkey",
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              return res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  referralCode: user.referralCode,
                },
              });
            }
          );
        });
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};

export const loginUser = async (userDetails, res) => {
  const { email, password } = userDetails;
  // Some simple validations
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const validationResult = validateEmail({ email });
  if (validationResult.error) {
    return res
      .status(400)
      .json({ msg: "Validation Error ! Please enter email in correct format" });
  }
  // Checking for existing users
  await User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exist" });
    // Create salt & hash
    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
        jwt.sign(
          { id: user.id, email: user.email, referralCode: user.referralCode },
          "secretkey",
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            return res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                referralCode: user.referralCode,
              },
            });
          }
        );
      })
      .catch((err) => {
        return res.status(400).json({ msg: "User not found", error: err });
      });
  });
};

export const findAllUsers = async (req, res) => {
  try {
    if (req.query.slug) {
      User.find({ slug: req.query.slug })
        .select({
          _id: false,
          name: true,
          email: true,
          "ancestors.slug": true,
          "ancestors.name": true,
          "ancestors.email": true,
        })
        .then((users) => {
          return res.status(200).json({ message: "Success", userList: users });
        })
        .catch((err) => {
          throw err;
        });
    } else {
      User.find()
        .then((users) => {
          return res.status(200).json({ message: "Success", userList: users });
        })
        .catch((err) => {
          throw err;
        });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error", error: error });
  }
};

export const findUserById = async (id, res) => {
  try {
    await User.findById({ _id: id })
      .then((user) => {
        return res.status(200).json({
          message: "Success",
          data: user,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Error ! User not found",
          err: err.message,
        });
      });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

export const updateUser = async (id, userDetails, res) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "BAD REQUEST",
        error: "Please enter valid object ID",
      });
    }
    await User.findByIdAndUpdate({ _id: id }, userDetails, (err, response) => {
      if (err) {
        return res.status(400).json({ message: "Error ! User not found" });
      }
      return res
        .status(200)
        .json({ message: "User updated", userDetails: response });
    });
  } catch (error) {
    return res.status(400).json({ message: "Error", error: error });
  }
};

export const deleteUser = async (id, res) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "BAD REQUEST",
        error: "Please enter valid object ID",
      });
    }
    User.findByIdAndRemove({ _id: id }, (err, response) => {
      if (err) {
        return res.status(400).json({ message: "Error", error: err });
      }
      if (response !== null) {
        return res
          .status(200)
          .json({ message: "Deleted successfully", response: response });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    });
  } catch (error) {
    return res.status(400).json({ message: "Error", error: error });
  }
};

export const inviteUser = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Please enter email to invite" });
  }
  const toEmail = req.body.email;
  const validationResult = validateEmail({ email: toEmail });
  if (validationResult.error) {
    return res
      .status(400)
      .json({ msg: "Validation Error ! Please enter email in correct format" });
  }
  let fromEmail, parentReferralCode;
  const header = req.headers["authorization"];
  const bearer = header.split(" ");
  const token = bearer[1];
  jwt.verify(token, "secretkey", (err, data) => {
    if (err) {
      return res.status(400).json({ message: "Failure", error: err });
    }
    fromEmail = data.email;
    parentReferralCode = data.referralCode;
  });
  if (fromEmail === toEmail) {
    return res.status(400).json({
      message: "Failure",
      error: "Bad Request ! Cannot invite to self.",
    });
  }
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: "Nodemailer invite",
    text: `Hey ! You have been invited by ${fromEmail} for joining the tree. Use this referral code while registering. Referral Code : ${parentReferralCode}`,
    attachments: [
      {
        filename: "sampleSend.webp",
        path: __dirname + "/assets/attachments/sampleSend.webp",
      },
    ],
  };
  transport.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.status(400).json({ message: "ERROR", error });
    }
    const newInvite = new Invite({
      invitedBy: fromEmail,
      invitedTo: toEmail,
    });
    await newInvite.save();
    console.log("Message sent : %s", info.messageId);
    return res
      .status(200)
      .json({ message: "Mail sent successfully", info: info });
  });
};

export const listDescendants = async (req, res) => {
  try {
    if (!req.params.id) return res
        .status(400)
        .json({ message: "Bad Request", error: "No ID found in params" });
    const response = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "descendants",
        },
      },
      { $unwind: "$descendants" },
      {
        $sort: {
          _id: 1,
          "descendants._id": 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          descendants: {
            $push: "$descendants",
          },
        },
      },
      {
        $project: {
          "descendants.email": 1,
          "descendants._id": 1,
          "descendants.name": 1,
        },
      },
    ]);
    if (!response.length) {
      return res.status(200).json({
        message: "Success",
        response: "This is a leaf node",
        data: { _id: req.params.id, descendants: null },
      });
    }
    return res.status(200).json({
      message: "Success",
      data: response.length ? response : "No descendants for this user",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTopMostAncestor = async (req, res) => {
  if (!req.params.id) return res
      .status(400)
      .json({ message: "Bad Request", error: "No id found in params" });
  const userId = req.params.id;
  const response = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    {
      $graphLookup: {
        from: "users",
        startWith: "$parent",
        connectFromField: "parent",
        connectToField: "_id",
        as: "ancestors",
      },
    },
    { $unwind: "$ancestors" },
    {
      $sort: {
        _id: 1,
        "ancestors._id": 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        ancestors: {
          $push: "$ancestors",
        },
      },
    },
    {
      $project: {
        "ancestors.email": 1,
        "ancestors._id": 1,
        "ancestors.name": 1,
        "ancestors.parent": 1,
      },
    },
  ]);
  if (!response.length) {
    return res.status(200).json({
      message: "Success",
      response: "This is a root node",
      data: { _id: userId, ancestors: null },
    });
  }
  const topMostAncestor = response[0].ancestors.filter((val) => {
    return val.parent === null;
  });
  return res
    .status(200)
    .json({ message: "Success", topMostAncestorDetails: topMostAncestor });
};
