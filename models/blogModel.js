import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.model("BlogPost", blogPostSchema);
