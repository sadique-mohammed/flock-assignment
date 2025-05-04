import { apiRequest } from "./api";

export const getWishlists = (token) => {
  return apiRequest("/api/wishlist", "GET", null, token);
};

export const getWishlistById = (wishlistId, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}`, "GET", null, token);
};

export const createWishlist = (wishlistData, token) => {
  return apiRequest("/api/wishlist/create", "POST", wishlistData, token);
};

export const updateWishlist = (wishlistId, wishlistData, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}`, "PUT", wishlistData, token);
};

export const deleteWishlist = (wishlistId, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}`, "DELETE", null, token);
};

export const addProduct = (wishlistId, product, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}/products`, "POST", product, token);
};

export const removeProduct = (wishlistId, productId, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}/products/${productId}`, "DELETE", null, token);
};

export const shareWishlist = (wishlistId, shareData, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}/share`, "POST", shareData, token);
};

export const inviteUsers = (wishlistId, emails, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}/invite`, "POST", { emails }, token);
};

export const getInvitations = (wishlistId, token) => {
  return apiRequest(`/api/wishlist/${wishlistId}/invitations`, "GET", null, token);
};

export const updateProduct = (wishlistId, productId, productData, token) => {
  return apiRequest(
    `/api/wishlist/${wishlistId}/products/${productId}`,
    "PATCH",
    productData,
    token
  );
};
