import { createSlice } from '@reduxjs/toolkit';
import { FetchState } from '../../constants/fetchState';

export const initialState = {
    user_id: '',
    name: '',
    email: '',
    avatar: '',
    userToken: null,
    isAuthenticated: false,
    fetchState: FetchState.NOT_FETCHED,
    error: false,
};

export const userSlice = createSlice({
    name: 'userReducer',
    initialState: initialState,
    reducers: {
        clearLogin: (state, action) => {},
        requestLogin: (state, action) => {},
        requestLoginSuccess: (state, action) => {},
        requestLoginFailed: (state, action) => {},
        requestLoadSuccess(state, action) {},
        setToken: (state, action) => {},
    },
});

export const {
    clearLogin,
    requestLogin,
    requestLoginSuccess,
    requestLoginFailed,
    requestLoadSuccess,
    setToken,
} = userSlice.actions;

export default userSlice.reducer;
