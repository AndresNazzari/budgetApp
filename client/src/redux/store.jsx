import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './states/user.state';
import { alertSlice } from './states/alert.state';

export default configureStore({
    reducer: { userReducer: userSlice.reducer, alertsReducer: alertSlice.reducer },
});
