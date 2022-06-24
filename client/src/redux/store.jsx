import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './states/user.state';
import { categorySlice } from './states/category.state';
import { alertSlice } from './states/alert.state';

export default configureStore({
    reducer: {
        userReducer: userSlice.reducer,
        categoryReducer: categorySlice.reducer,
        alertsReducer: alertSlice.reducer,
    },
});
