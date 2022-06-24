import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PrivateRoute = () => {
    const navigate = useNavigate();
    const userState = useSelector((store) => store.userReducer);

    useEffect(() => {
        if (!userState.isAuthenticated) {
            {
                navigate('/');
            }
        }
    }, [userState.isAuthenticated, navigate]);

    return <Outlet />;
};

export default PrivateRoute;
