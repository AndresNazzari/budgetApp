import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './states/user.state';
import { expenseSlice } from './states/expense.state';
import { incomeSlice } from './states/income.state';
import { categorySlice } from './states/category.state';
import { alertSlice } from './states/alert.state';

export default configureStore({
    reducer: {
        userReducer: userSlice.reducer,
        expenseReducer: expenseSlice.reducer,
        incomeReducer: incomeSlice.reducer,
        categoryReducer: categorySlice.reducer,
        alertsReducer: alertSlice.reducer,
    },
});
