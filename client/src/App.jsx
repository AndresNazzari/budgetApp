import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import setAuthToken from './util/setAuthToken';
import { loadUserAction } from './redux/actions/user.action';
import { setToken } from './redux/states/user.state';

import Login from './views/login/Login';
import Signup from './views/signup/Signup';

if (localStorage.userToken) {
    setAuthToken(localStorage.userToken);
    store.dispatch(setToken({ userToken: localStorage.userToken }));
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUserAction());
    }, []);

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Login />} />
                    <Route exact path='/signup' element={<Signup />} />

                    <Route path='*' element={<Login />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
