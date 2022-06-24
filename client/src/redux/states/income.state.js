import { createSlice } from '@reduxjs/toolkit';
import { FetchState } from '../../constants/fetchState';
export const initialState = {
    incomes: [],
    fetchState: FetchState.NOT_FETCHED,
    error: null,
};

export const incomeSlice = createSlice({
    name: 'incomeReducer',
    initialState: initialState,
    reducers: {
        requestIncome: (state, action) => ({
            ...state,
            fetchState: FetchState.FETCHING,
        }),
        requestIncomeSuccess: (state, action) => {
            return {
                ...state,
                incomes: [action.payload, ...state.incomes],
                fetchState: FetchState.FETCHED,
            };
        },
        requestIncomesSuccess: (state, action) => {
            return {
                ...state,
                incomes: [...action.payload],
                fetchState: FetchState.FETCHED,
            };
        },
        requestUpdateIncomeSuccess: (state, action) => {
            return {
                ...state,
                incomes: state.incomes.map((income) => {
                    return income.income_id === action.payload.income_id
                        ? { ...income, ...action.payload }
                        : income;
                }),
                fetchState: FetchState.FETCHED,
            };
        },
        requestIncomeFailed: (state, action) => {
            return {
                ...state,
                error: { ...state.error, ...action.payload },
                fetchState: FetchState.FETCHED,
            };
        },
        requestRemoveIncomeSuccess: (state, action) => {
            return {
                ...state,
                incomes: state.incomes.filter((income) => income.income_id !== action.payload),
                fetchState: FetchState.FETCHED,
            };
        },
    },
});

export const {
    requestIncome,
    requestIncomeSuccess,
    requestIncomesSuccess,
    requestUpdateIncomeSuccess,
    requestIncomeFailed,
    requestRemoveIncomeSuccess,
} = incomeSlice.actions;

export default incomeSlice.reducer;
