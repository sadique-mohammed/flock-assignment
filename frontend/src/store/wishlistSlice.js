import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as wishlistService from "../services/wishlist";

export const fetchWishlists = createAsyncThunk(
  "wishlist/fetchWishlists",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await wishlistService.getWishlists(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch wishlists");
    }
  }
);

export const createWishlist = createAsyncThunk(
  "wishlist/createWishlist",
  async (wishlistData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await wishlistService.createWishlist(wishlistData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create wishlist");
    }
  }
);

export const fetchWishlistById = createAsyncThunk(
  "wishlist/fetchWishlistById",
  async (wishlistId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await wishlistService.getWishlistById(wishlistId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch wishlist");
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  "wishlist/addProductToWishlist",
  async ({ wishlistId, product }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await wishlistService.addProduct(wishlistId, product, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add product to wishlist");
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk(
  "wishlist/removeProductFromWishlist",
  async ({ wishlistId, productId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await wishlistService.removeProduct(wishlistId, productId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove product from wishlist");
    }
  }
);

export const deleteWishlist = createAsyncThunk(
  "wishlist/deleteWishlist",
  async (wishlistId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await wishlistService.deleteWishlist(wishlistId, token);
      return { wishlistId, response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete wishlist");
    }
  }
);

export const inviteUsersToWishlist = createAsyncThunk(
  "wishlist/inviteUsersToWishlist",
  async ({ wishlistId, emails }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await wishlistService.inviteUsers(wishlistId, emails, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to invite users to wishlist");
    }
  }
);

export const updateProductInWishlist = createAsyncThunk(
  "wishlist/updateProductInWishlist",
  async ({ wishlistId, productId, productData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await wishlistService.updateProduct(wishlistId, productId, productData, token);

      const updatedWishlist = await wishlistService.getWishlistById(wishlistId, token);
      return updatedWishlist;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update product in wishlist");
    }
  }
);

const initialState = {
  wishlists: [],
  currentWishlist: null,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlists: (state) => {
      state.wishlists = [];
      state.currentWishlist = null;
      state.error = null;
    },
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchWishlists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlists.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = action.payload;
      })
      .addCase(fetchWishlists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists.push(action.payload);
      })
      .addCase(createWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchWishlistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWishlist = action.payload;
      })
      .addCase(fetchWishlistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addProductToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWishlist = action.payload;

        const index = state.wishlists.findIndex((w) => w._id === action.payload._id);
        if (index !== -1) {
          state.wishlists[index] = action.payload;
        }
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeProductFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.currentWishlist = action.payload;

        const wishlistIndex = state.wishlists.findIndex((w) => w._id === action.payload._id);
        if (wishlistIndex !== -1) {
          state.wishlists[wishlistIndex] = action.payload;
        }
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.filter((w) => w._id !== action.payload.wishlistId);
        if (state.currentWishlist && state.currentWishlist._id === action.payload.wishlistId) {
          state.currentWishlist = null;
        }
      })
      .addCase(deleteWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProductInWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductInWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWishlist = action.payload;
        const wishlistIndex = state.wishlists.findIndex((w) => w._id === action.payload._id);
        if (wishlistIndex !== -1) {
          state.wishlists[wishlistIndex] = action.payload;
        }
      })
      .addCase(updateProductInWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlists, clearWishlistError } = wishlistSlice.actions;

export const selectAllWishlists = (state) => state.wishlist.wishlists;
export const selectCurrentWishlist = (state) => state.wishlist.currentWishlist;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
