import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser as loginUserService, signupUser as signupUserService } from "../services/auth";

const loadPersistedState = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return {
      user: user ? JSON.parse(user) : null,
      token,
    };
  } catch (error) {
    console.error("Failed to load auth state from localStorage:", error);
    return { user: null, token: null };
  }
};

const persistedState = loadPersistedState();

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUserService(credentials);

      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signupUserService(userData);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

const initialState = {
  user: persistedState.user,
  token: persistedState.token,
  loading: false,
  error: null,
  isAuthenticated: !!persistedState.token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setAuthToken } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;
