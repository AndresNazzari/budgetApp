import { createSlice } from '@reduxjs/toolkit';
import { FetchState } from '../../constants/fetchState';

export const initialState = {
    expenses: [],
    fetchState: FetchState.NOT_FETCHED,
    error: null,
};

export const expenseSlice = createSlice({
    name: 'expenseReducer',
    initialState: initialState,
    reducers: {
        requestExpense: (state, action) => ({
            ...state,
            fetchState: FetchState.FETCHING,
        }),
        requestExpenseSuccess: (state, action) => {
            return {
                ...state,
                expenses: [action.payload, ...state.expenses],
                fetchState: FetchState.FETCHED,
            };
        },
        requestExpensesSuccess: (state, action) => {
            return {
                ...state,
                expenses: [...action.payload],
                fetchState: FetchState.FETCHED,
            };
        },
        requestUpdateExpenseSuccess: (state, action) => {
            return {
                ...state,
                expenses: state.expenses.map((expense) => {
                    return expense.expense_id === action.payload.expense_id
                        ? { ...expense, ...action.payload }
                        : expense;
                }),
                fetchState: FetchState.FETCHED,
            };
        },
        requestExpenseFailed: (state, action) => {
            return {
                ...state,
                error: { ...state.error, ...action.payload },
                fetchState: FetchState.FETCHED,
            };
        },

        requestRemoveExpenseSuccess: (state, action) => {
            return {
                ...state,
                expenses: state.expenses.filter((expense) => expense.expense_id !== action.payload),
                fetchState: FetchState.FETCHED,
            };
        },
    },
});

export const {
    requestExpense,
    requestExpenseSuccess,
    requestExpensesSuccess,
    requestUpdateExpenseSuccess,
    requestExpenseFailed,
    requestRemoveExpenseSuccess,
} = expenseSlice.actions;

export default expenseSlice.reducer;
