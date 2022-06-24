import { createSlice } from '@reduxjs/toolkit';
import { FetchState } from '../../constants/fetchState';

export const initialState = {
    categories: [],
    fetchState: FetchState.NOT_FETCHED,
    error: null,
};

export const categorySlice = createSlice({
    name: 'categoryReducer',
    initialState: initialState,
    reducers: {
        requestCategories: (state, action) => ({
            ...state,
            fetchState: FetchState.FETCHING,
        }),
        requestSuccess: (state, action) => {
            return {
                ...state,
                ...action.payload,
                fetchState: FetchState.FETCHED,
            };
        },
        requestFailed: (state, action) => {
            return {
                ...state,
                error: { ...state.error, ...action.payload },
                fetchState: FetchState.FETCHED,
            };
        },
        createCategory: (state, action) => {},
        removeCategory: (state, action) => {},
    },
});

export const {
    requestCategories,
    requestSuccess,
    requestFailed,
    createCategory,
    removeCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
