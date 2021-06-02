import mongoose from "mongoose";
const Schema = mongoose.Schema;
import slugify from "slugify";
import * as Joi from "joi";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, minlength: 3 },
    confirmPassword: { type: String, required: true, minlength: 3 },
    referralCode: { type: String, required: true },
    parentReferralCode: { type: String, required: false, default: null },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      default: "null",
      ref: "users",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  this.slug = slugify(this.name);
  next();
});

userSchema.methods.joiValidate = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
    confirmPassword: Joi.ref("password"),
    referralCode: Joi.string().required(),
    parentReferralCode: Joi.string(),
    parent: Joi.string(),
  });
  return schema.validate(obj);
};

const User = mongoose.model("users", userSchema);

module.exports = User;
