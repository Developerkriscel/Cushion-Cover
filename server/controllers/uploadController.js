import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";

const uploadBuffer = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "elegant-home-decor/products", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(file.buffer);
  });

export const uploadImages = asyncHandler(async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    res.status(500);
    throw new Error("Cloudinary is not configured");
  }
  const files = req.files || [];
  const uploads = await Promise.all(files.map(uploadBuffer));
  res.status(201).json(
    uploads.map((image) => ({
      url: image.secure_url,
      publicId: image.public_id
    }))
  );
});
