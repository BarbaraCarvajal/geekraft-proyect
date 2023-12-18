import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
      maxlength: 1024,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: {},
      trim: true,
      required: true,
      type: String,
    },
    role: {
      type: Number,
      trim: true,
      default: 0,
    },
    ask: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
  },
  { timestamps: true }
);
export default mongoose.model("users", userSchema);
