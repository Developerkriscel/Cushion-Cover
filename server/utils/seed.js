import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";
import Banner from "../models/Banner.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Newsletter from "../models/Newsletter.js";
import Review from "../models/Review.js";
import { banners, categories, coupons, products } from "./sampleData.js";

dotenv.config();
await connectDB();

const importData = async () => {
  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    Coupon.deleteMany(),
    Banner.deleteMany(),
    Order.deleteMany(),
    Cart.deleteMany(),
    Newsletter.deleteMany(),
    Review.deleteMany()
  ]);

  await User.create({
    name: "Elegant Admin",
    email: "admin@eleganthomedecor.com",
    password: "Admin@12345",
    role: "admin",
    phone: "+91 90000 00000"
  });

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(createdCategories.map((category) => [category.slug, category._id]));

  await Product.insertMany(
    products.map(({ categorySlug, ...product }) => ({
      ...product,
      category: categoryMap[categorySlug]
    }))
  );
  await Coupon.insertMany(coupons);
  await Banner.insertMany(banners);

  console.log("Seed data imported");
  process.exit();
};

const destroyData = async () => {
  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    Category.deleteMany(),
    Coupon.deleteMany(),
    Banner.deleteMany(),
    Order.deleteMany(),
    Cart.deleteMany(),
    Newsletter.deleteMany(),
    Review.deleteMany()
  ]);
  console.log("Data destroyed");
  process.exit();
};

if (process.argv[2] === "-d") destroyData();
else importData();
