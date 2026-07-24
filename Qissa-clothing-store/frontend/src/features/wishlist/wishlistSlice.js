import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';

function extractError(err) {
  const data = err.response?.data;
  if (data?.message) return data.message;
  if (data?.errors) {
    const msgs = Object.values(data.errors).flat();
    return msgs.length > 0 ? msgs.join('. ') : 'Operation failed';
  }
  return null;
}

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await wishlistService.getWishlist();
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to load wishlist');
    }
  },
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await wishlistService.addToWishlist(productId);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to add to wishlist');
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await wishlistService.removeFromWishlist(productId);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to remove from wishlist');
    }
  },
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await wishlistService.clearWishlist();
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to clear wishlist');
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.products || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default wishlistSlice.reducer;
