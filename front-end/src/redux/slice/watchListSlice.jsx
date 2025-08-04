import axiosInstance from '@/api/axioInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/watchlist');
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Error fetching watchlist'
      );
    }
  }
);
export const addToWatchlist = createAsyncThunk(
  'watchlist/add',
  async (movieId, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/watchlist/${movieId}`);
      return res.data.movie;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Error adding movie'
      );
    }
  }
);
export const removeFromWatchlist = createAsyncThunk(
  'watchlist/remove',
  async (movieId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/watchlist/${movieId}`);
      return movieId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Error removing movie'
      );
    }
  }
);
const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.items = state.items.filter((item) => item._id !== removedId);
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});
export default watchlistSlice.reducer;
