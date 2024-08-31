// // features/auth/authSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // Define the initial state
// const initialState = {
//   user: null,
//   status: 'idle',
//   error: null,
//   successMessage: '', // Add a success message field
// };

// // Create an async thunk for user registration
// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         'https://oae-be.onrender.com/api/oae/auth/register',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(userData),
//         }
//       );

//       const responseData = await response.json(); // Get the JSON response

//       if (!response.ok) {
//         return rejectWithValue(responseData); // Return the error data if the response is not ok
//       }

//       return responseData; // Return success data
//     } catch (error) {
//       return rejectWithValue({ message: 'Network error, please try again.' });
//     }
//   }
// );

// // Create a slice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.status = 'loading';
//         state.error = null; // Clear any previous error
//         state.successMessage = ''; // Clear any previous success message
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.user; // Adjust this based on your response structure
//         state.successMessage =
//           action.payload.message || 'Registration successful'; // Handle success message
//         state.error = null;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload.message || action.error.message; // Use error message from backend or default
//         state.successMessage = ''; // Clear success message on error
//       });
//   },
// });

// export default authSlice.reducer;
// features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  user: null,
  status: 'idle',
  error: null,
  successMessage: '',
};

// Create an async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://oae-be.onrender.com/api/oae/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      const responseData = await response.json(); // Get the JSON response

      if (!response.ok) {
        return rejectWithValue(responseData); // Return the error data if the response is not ok
      }

      return responseData; // Return success data
    } catch (error) {
      return rejectWithValue({ message: 'Network error, please try again.' });
    }
  }
);

// Create an async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://oae-be.onrender.com/api/oae/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        }
      );

      const responseData = await response.json(); // Get the JSON response

      if (!response.ok) {
        return rejectWithValue(responseData); // Return the error data if the response is not ok
      }

      return responseData; // Return success data
    } catch (error) {
      return rejectWithValue({ message: 'Network error, please try again.' });
    }
  }
);

// Create a slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle registration cases
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.successMessage =
          action.payload.message || 'Registration successful';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || action.error.message;
        state.successMessage = '';
      })
      // Handle login cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.successMessage = action.payload.message || 'Login successful';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || action.error.message;
        state.successMessage = '';
      });
  },
});

export default authSlice.reducer;
