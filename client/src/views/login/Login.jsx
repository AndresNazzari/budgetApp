import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/user.action';
import Alert from '../../components/alert/Alert';
import styles from './style/Login.module.scss';
import logoLogin from './assets/logo-login.png';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const userState = useSelector((store) => store.userReducer);

    useEffect(() => {
        userState.isAuthenticated && navigate('/home');
    }, [userState.isAuthenticated, navigate, dispatch]);

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <>
            <Alert />
            <div className={styles.loginPage}>
                <div className={styles.loginLeft}>
                    <div>
                        <h2>Welcome to BudgetApp</h2>
                        <img src={logoLogin} alt='login logo' />
                    </div>
                </div>

                <div className={styles.loginRight}>
                    <form action='' onSubmit={(e) => handleLogin(e)}>
                        <h2>Please log in</h2>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='text'
                            id='emailInput'
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            className={userState.error ? styles.inputError : ''}
                            autoComplete='on'
                        />
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='passwordInput'
                            minLength={6}
                            placeholder='Enter your password'
                            onChange={(e) => setPassword(e.target.value)}
                            className={userState.error ? styles.inputError : ''}
                            autoComplete='on'
                        />

                        <button type='submit'>Login</button>
                        <p>
                            Not a member? <Link to={'/signup'}>Signup now</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
