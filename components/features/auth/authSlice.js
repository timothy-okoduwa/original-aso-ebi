
import AsyncStorage from '@react-native-async-storage/async-storage';
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
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ userId, otp }, { rejectWithValue }) => {
    console.log('this is user id from authslice :',userId,otp)
    try {
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/auth/${userId}/verify`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
     body: JSON.stringify({ otp }), 
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        return rejectWithValue(responseData);
      }

      return responseData;
    } catch (error) {
      return rejectWithValue({ message: error.message });
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
// Store the token in AsyncStorage
      const token = responseData.data; // JWT token
      await AsyncStorage.setItem('authToken', token);
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
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
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
        .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = '';
      })
         .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload.message || 'OTP verified successfully';
        state.error = null;
        // Optionally set state.user here if additional user info comes back
      })
       .addCase(verifyOtp.rejected, (state, action) => {
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
        state.token = action.payload.data; // JWT token
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
export const { setUser, setToken } = authSlice.actions;
export default authSlice.reducer;











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