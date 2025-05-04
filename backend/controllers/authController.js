import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Wishlist from "../models/wishlistModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const mockProducts = [
  {
    name: "Wireless Headphones",
    price: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
  },
  {
    name: "Smart Watch",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop",
  },
  {
    name: "Tablet",
    price: 349.99,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
  },
  {
    name: "The Great Gatsby",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
  },
  {
    name: "Winter Jacket",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=500&fit=crop",
  },
];

async function createMockWishlistsForUser(userId) {
  try {
    const otherUsers = await User.find({ _id: { $ne: userId } }).limit(3);

    const wishlistTemplates = [
      {
        name: "My Birthday Wishlist",
        description: "Things I want for my birthday celebration!",
      },
      {
        name: "Tech Gadgets",
        description: "Cool tech products I'm saving up for",
      },
    ];

    const createdWishlists = [];

    for (const template of wishlistTemplates) {
      const wishlist = new Wishlist({
        name: template.name,
        description: template.description,
        userId: userId,
        products: [],
        collaborators: [],
      });

      const numProducts = Math.floor(Math.random() * 2) + 3;

      for (let i = 0; i < numProducts; i++) {
        const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];

        const isOwnProduct = Math.random() > 0.5;
        let adderUser;

        if (isOwnProduct || otherUsers.length === 0) {
          adderUser = userId;
        } else {
          adderUser = otherUsers[Math.floor(Math.random() * otherUsers.length)]._id;

          if (!wishlist.collaborators.includes(adderUser)) {
            wishlist.collaborators.push(adderUser);
          }
        }

        wishlist.products.push({
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          addedBy: adderUser,
        });
      }

      if (wishlist.collaborators.length === 0 && otherUsers.length > 0) {
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        wishlist.collaborators.push(randomUser._id);
      }

      const savedWishlist = await wishlist.save();
      createdWishlists.push(savedWishlist);
    }

    return createdWishlists;
  } catch (error) {
    console.error("Error creating mock wishlists:", error);
    return [];
  }
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
    });
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    await createMockWishlistsForUser(newUser._id);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error - SignUp failed", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error - Login failed", error: error.message });
  }
};
