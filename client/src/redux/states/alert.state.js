import { createSlice } from '@reduxjs/toolkit';

export const initialState = [];

export const alertSlice = createSlice({
    name: 'alertsReducer',
    initialState: initialState,
    reducers: {
        setAlert: (state, action) => {
            return [...state, action.payload];
        },
        removeAlert: (state, action) => state.filter((alert) => alert.id !== action.payload),
    },
});

export const { setAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;
