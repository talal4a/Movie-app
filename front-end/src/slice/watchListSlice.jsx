import axiosInstance from '@/api/axioInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Fetch watchlist (full movie details)
export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/watchlist');
      return res.data.data; // movie array
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// Add movie by ID
export const addToWatchlist = createAsyncThunk(
  'watchlist/add',
  async (movieId, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/watchlist/${movieId}`);
      return res.data.watchlist; // returns array of movie IDs
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// Remove movie by ID
export const removeFromWatchlist = createAsyncThunk(
  'watchlist/remove',
  async (movieId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/watchlist/${movieId}`);
      return res.data.watchlist;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
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
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.items = [...state.items];
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.meta.arg
        );
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
