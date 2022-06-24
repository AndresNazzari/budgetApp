import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import setAuthToken from './util/setAuthToken';
import { loadUserAction } from './redux/actions/user.action';
import { setToken } from './redux/states/user.state';
import Login from './views/login/Login';
import Signup from './views/signup/Signup';
import Home from './views/home/Home';
import NewOperation from './views/newOperation/NewOperation';
import Operations from './views/operations/Operations';
import PrivateRoute from './routing/PrivateRoute';

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
                    <Route exact path='/home' element={<PrivateRoute />}>
                        <Route exact path='/home' element={<Home />} />
                    </Route>
                    <Route exact path='/operations' element={<PrivateRoute />}>
                        <Route exact path='/operations' element={<NewOperation />} />
                    </Route>
                    <Route exact path='/operations/:op' element={<PrivateRoute />}>
                        <Route exact path='/operations/:op' element={<Operations />} />
                    </Route>
                    <Route path='*' element={<Login />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
