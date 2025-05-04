import Wishlist from "../models/wishlistModel.js";

export const createWishlist = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Wishlist name is required" });
  }
  const newWishlist = new Wishlist({
    name,
    userId: req.userId,
  });
  try {
    await newWishlist.save();
    res.status(201).json(newWishlist);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create wishlist" });
  }
};

export const getUserWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ userId: req.userId }).populate(
      "products.addedBy",
      "name email"
    );
    res.json(wishlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getWishlistById = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const wishlist = await Wishlist.findById(wishlistId).populate("products.addedBy", "name email");

    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    if (wishlist.userId.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to access this wishlist" });
    }

    res.status(200).json(wishlist);
  } catch (err) {
    console.error(`Error fetching wishlist: ${err.message}`);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    if (wishlist.userId.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to delete this wishlist" });
    }

    await Wishlist.findByIdAndDelete(wishlistId);
    res.status(200).json({ msg: "Wishlist deleted successfully" });
  } catch (err) {
    console.error(`Error deleting wishlist: ${err.message}`);
    res.status(500).json({ msg: "Server error" });
  }
};

export const addProductToWishlist = async (req, res) => {
  try {
    const { name, imageUrl, price, url } = req.body;
    if (!name || !price) {
      return res.status(400).json({ msg: "Product name and price are required" });
    }

    const { wishlistId } = req.params;
    const wishlist = await Wishlist.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    const newProduct = {
      name,
      imageUrl:
        imageUrl ||
        "https://thumbs.dreamstime.com/b/vector-illustration-wishlist-inscription-birthday-party-brush-lettering-modern-calligraphy-desirable-gifts-vector-142683227.jpg?w=768",
      price,
      url: url || null,
      addedBy: req.userId,
    };

    wishlist.products.push(newProduct);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlistId).populate(
      "products.addedBy",
      "name email"
    );
    res.status(201).json(updatedWishlist);
  } catch (err) {
    console.error(`Error adding product to wishlist: ${err.message}`);
    res.status(500).json({ msg: "Server error" });
  }
};

export const removeProductFromWishlist = async (req, res) => {
  try {
    const { wishlistId, productId } = req.params;
    const wishlist = await Wishlist.findById(wishlistId);
    if (!wishlist) return res.status(404).json({ msg: "Wishlist not found" });

    const product = wishlist.products.id(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    wishlist.products = wishlist.products.filter((p) => p._id.toString() !== productId);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlistId).populate(
      "products.addedBy",
      "name email"
    );
    res.status(200).json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProductInWishlist = async (req, res) => {
  try {
    const { wishlistId, productId } = req.params;
    const { name, imageUrl, price } = req.body;

    const wishlist = await Wishlist.findById(wishlistId);
    if (!wishlist) return res.status(404).json({ msg: "Wishlist not found" });

    const product = wishlist.products.id(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (name) product.name = name;
    if (imageUrl) product.imageUrl = imageUrl;
    if (price) product.price = price;

    await wishlist.save();
    res.status(200).json({ msg: "Product updated", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const inviteToWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ msg: "At least one email address is required" });
    }

    const wishlist = await Wishlist.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    if (
      wishlist.userId.toString() !== req.userId &&
      !wishlist.collaborators.some((id) => id.toString() === req.userId)
    ) {
      return res.status(403).json({ msg: "Not authorized to invite others to this wishlist" });
    }

    const newInvitations = [];
    for (const email of emails) {
      if (!wishlist.invitations.some((invite) => invite.email === email)) {
        wishlist.invitations.push({ email });
        newInvitations.push(email);
      }
    }

    await wishlist.save();

    res.status(200).json({
      msg: "Invitations sent successfully",
      invitedEmails: newInvitations,
    });
  } catch (err) {
    console.error(`Error inviting to wishlist: ${err.message}`);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getWishlistInvitations = async (req, res) => {
  try {
    const { wishlistId } = req.params;

    const wishlist = await Wishlist.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found" });
    }

    if (wishlist.userId.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to view invitations for this wishlist" });
    }

    res.status(200).json(wishlist.invitations);
  } catch (err) {
    console.error(`Error getting wishlist invitations: ${err.message}`);
    res.status(500).json({ msg: "Server error" });
  }
};
