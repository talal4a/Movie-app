import axiosInstance from '@/api/axioInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch full movie watchlist
export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/watchlist');
      return res.data.data; // Should return array of full movie objects
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Error fetching watchlist'
      );
    }
  }
);

// Add a movie to watchlist by ID
export const addToWatchlist = createAsyncThunk(
  'watchlist/add',
  async (movieId, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/watchlist/${movieId}`);
      return res.data.movie; // Should return full movie object
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Error adding movie'
      );
    }
  }
);

// Remove a movie from watchlist by ID
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

// Slice definition
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
      // Fetch Watchlist
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
