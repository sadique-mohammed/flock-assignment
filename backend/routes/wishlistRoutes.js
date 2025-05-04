import express from "express";
import {
  createWishlist,
  getUserWishlists,
  getWishlistById,
  deleteWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  updateProductInWishlist,
  inviteToWishlist,
  getWishlistInvitations,
} from "../controllers/wishlistController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protectRoute, getUserWishlists);
router.post("/create", protectRoute, createWishlist);
router.get("/:wishlistId", protectRoute, getWishlistById);
router.delete("/:wishlistId", protectRoute, deleteWishlist);
router.post("/:wishlistId/products", protectRoute, addProductToWishlist);
router.patch("/:wishlistId/products/:productId", protectRoute, updateProductInWishlist);
router.delete("/:wishlistId/products/:productId", protectRoute, removeProductFromWishlist);

router.get("/:wishlistId/invitations", protectRoute, getWishlistInvitations);
router.post("/:wishlistId/invite", protectRoute, inviteToWishlist);

export default router;
