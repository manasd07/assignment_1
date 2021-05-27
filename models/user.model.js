import mongoose from "mongoose";
const Schema = mongoose.Schema;
import slugify from "slugify";

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
    // ancestors:[{
    //     _id:{
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:"users",
    //         index:true
    //     },
    //     name:String,
    //     email:String,
    //     slug:String
    // }],
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  this.slug = slugify(this.name);
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
