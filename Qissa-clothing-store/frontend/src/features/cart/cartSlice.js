import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import { logout } from '../auth/authSlice';

function extractError(err) {
  const data = err.response?.data;
  if (data?.message) return data.message;
  if (data?.errors) {
    const msgs = Object.values(data.errors).flat();
    return msgs.length > 0 ? msgs.join('. ') : 'Validation failed';
  }
  return null;
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await cartService.getCart();
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to load cart');
    }
  },
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, color, size, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await cartService.addToCart({ product, color, size, quantity });
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to add item');
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, color, size, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await cartService.updateCartItem(productId, { color, size, quantity });
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to update quantity');
    }
  },
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async ({ productId, color, size }, { rejectWithValue }) => {
    try {
      const { data } = await cartService.removeCartItem(productId, { color, size });
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to remove item');
    }
  },
);

export const clearCartItems = createAsyncThunk(
  'cart/clearCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await cartService.clearCart();
      return data.data;
    } catch (err) {
      return rejectWithValue(extractError(err) || 'Failed to clear cart');
    }
  },
);

const initialState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  loading: false,
  adding: false,
  updating: false,
  clearing: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
    resetCart() {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ({ ...initialState }))

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.adding = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      .addCase(updateCartItem.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updating = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      .addCase(removeCartItem.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.updating = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      .addCase(clearCartItems.pending, (state) => {
        state.clearing = true;
        state.error = null;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.clearing = false;
        state.items = [];
        state.subtotal = 0;
        state.totalItems = 0;
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.clearing = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
