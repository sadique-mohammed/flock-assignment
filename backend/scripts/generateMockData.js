import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Wishlist from "../models/wishlistModel.js";
import connectToDB from "../config/db.js";

dotenv.config();

const mockUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
  },
  {
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
  },
];

const productCategories = [
  {
    category: "Electronics",
    products: [
      {
        name: "Wireless Headphones",
        price: 99.99,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      },
      {
        name: "Smart Watch",
        price: 199.99,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop",
      },
      {
        name: "Bluetooth Speaker",
        price: 79.99,
        imageUrl:
          "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop",
      },
      {
        name: "Tablet",
        price: 349.99,
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
      },
    ],
  },
  {
    category: "Books",
    products: [
      {
        name: "The Great Gatsby",
        price: 15.99,
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
      },
      {
        name: "To Kill a Mockingbird",
        price: 12.99,
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop",
      },
      {
        name: "1984",
        price: 14.99,
        imageUrl:
          "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&h=500&fit=crop",
      },
    ],
  },
  {
    category: "Clothing",
    products: [
      {
        name: "Casual T-Shirt",
        price: 29.99,
        imageUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      },
      {
        name: "Winter Jacket",
        price: 89.99,
        imageUrl:
          "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
      },
      {
        name: "Running Shoes",
        price: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      },
    ],
  },
];

const wishlistTemplates = [
  { name: "Birthday Wishlist", description: "Things I want for my birthday!" },
  { name: "Holiday Gifts", description: "Gift ideas for the holidays" },
  { name: "Home Decor Ideas", description: "Items to make the house look better" },
  { name: "Wedding Registry", description: "For our upcoming wedding" },
  { name: "Tech Gadgets", description: "Cool tech products I want to get" },
];

async function generateData() {
  try {
    console.log("Connecting to database...");
    await connectToDB();

    await User.deleteMany({});
    await Wishlist.deleteMany({});
    console.log("Cleared existing data");

    const createdUsers = [];
    for (const user of mockUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${user.name}`);
    }

    const wishlists = [];

    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];

      for (let j = 0; j < 2; j++) {
        const template = wishlistTemplates[Math.floor(Math.random() * wishlistTemplates.length)];

        const wishlist = new Wishlist({
          name: `${user.name}'s ${template.name}`,
          description: template.description,
          userId: user._id,
          products: [],
          collaborators: [],
        });

        const numProducts = Math.floor(Math.random() * 3) + 3;

        for (let k = 0; k < numProducts; k++) {
          const category = productCategories[Math.floor(Math.random() * productCategories.length)];
          const product = category.products[Math.floor(Math.random() * category.products.length)];

          const isOwnProduct = Math.random() > 0.5;
          let adderUser;

          if (isOwnProduct) {
            adderUser = user;
          } else {
            const otherUsers = createdUsers.filter((u) => u._id.toString() !== user._id.toString());
            adderUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];

            if (!wishlist.collaborators.some((c) => c.toString() === adderUser._id.toString())) {
              wishlist.collaborators.push(adderUser._id);
            }
          }

          wishlist.products.push({
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            addedBy: adderUser._id,
          });
        }

        if (wishlist.collaborators.length === 0) {
          const otherUsers = createdUsers.filter((u) => u._id.toString() !== user._id.toString());
          if (otherUsers.length > 0) {
            const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
            wishlist.collaborators.push(randomUser._id);
          }
        }

        const savedWishlist = await wishlist.save();
        console.log(
          `Created wishlist: ${wishlist.name} for user: ${user.name} with ${wishlist.products.length} products and ${wishlist.collaborators.length} collaborators`
        );
        wishlists.push(savedWishlist);
      }
    }

    console.log("Mock data generation complete!");
    console.log(`Created ${createdUsers.length} users and ${wishlists.length} wishlists`);

    process.exit(0);
  } catch (error) {
    console.error("Error generating mock data:", error);
    process.exit(1);
  }
}

generateData();
