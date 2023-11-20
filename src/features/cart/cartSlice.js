import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';
import { openModal } from '../modal/modalSlice';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
  cartItems: [],
  amount: 4,
  total: 0,
  isLoading: true,
};

// * fetch version
// export const getCartItems = createAsyncThunk('cart/getCartItems', () => {
//   return fetch(url)
//     .then(resp => resp.json())
//     .catch(error => console.log(error));
// });

export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (_, thunkAPI) => {
    try {
      // console.log(thunkAPI.getState());
      // console.log(thunkAPI.dispatch(openModal()));

      const response = await axios(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('There was an error...');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find(item => item.id === payload);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find(item => item.id === payload);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: state => {
      let amount = 0;
      let total = 0;
      for (const item of state.cartItems) {
        amount += item.amount;
        total += item.amount * item.price;
      }
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCartItems.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, state => {
        state.isLoading = false;
      });
  },

  // * old way
  // extraReducers: {
  //   [getCartItems.pending]: state => {
  //     state.isLoading = true;
  //   },
  //   [getCartItems.fulfilled]: (state, action) => {
  //     state.isLoading = false;
  //     state.cartItems = action.payload;
  //   },
  //   [getCartItems.rejected]: (state, action) => {
  //     console.log(action.payload);
  //     state.isLoading = false;
  //   },
  // },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
