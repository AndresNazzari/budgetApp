import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../redux/actions/user.action';
import Alert from '../layout/alert/Alert';
import styles from './style/Signup.module.scss';
import logoSignup from './assets/logo-signup.png';
import { setAlertAction } from '../../redux/actions/alert.action';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userState = useSelector((store) => store.userReducer);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    useEffect(() => {
        userState.isAuthenticated && navigate('/home');
    }, [userState.isAuthenticated, navigate, dispatch]);

    const { name, email, password, password2 } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = (e) => {
        e.preventDefault();
        if (password !== password2) {
            dispatch(setAlertAction('paswword do not match', 'danger'));
        } else {
            dispatch(signup(formData));
        }
    };

    return (
        <>
            <Alert />
            <div className={styles.signupPage}>
                <div className={styles.signupLeft}>
                    <div>
                        <h2>Welcome to BudgetApp</h2>
                        <img src={logoSignup} alt='login logo' />
                    </div>
                </div>

                <div className={styles.signupRight}>
                    <form action='' onSubmit={(e) => handleSignup(e)}>
                        <h2>Please Sign Up</h2>
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            name='name'
                            value={name}
                            onChange={(e) => onChange(e)}
                            placeholder='Enter your Name'
                            className={userState.error ? styles.inputError : ''}
                            autoComplete='on'
                        />
                        <label htmlFor='email'>Email</label>
                        <input
                            type='text'
                            name='email'
                            value={email}
                            onChange={(e) => onChange(e)}
                            placeholder='Enter your email'
                            className={userState.error ? styles.inputError : ''}
                            autoComplete='on'
                        />
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            minLength={6}
                            name='password'
                            value={password}
                            placeholder='Enter your password'
                            onChange={(e) => onChange(e)}
                            className={userState.error ? styles.inputError : ''}
                            autoComplete='on'
                        />
                        <label htmlFor='password2'>Repeat password</label>
                        <input
                            type='password'
                            name='password2'
                            value={password2}
                            minLength={6}
                            placeholder='Enter your password'
                            onChange={(e) => onChange(e)}
                            className={userState.error ? styles.inputError : ''}
                            autoComplete='on'
                        />
                        <button type='submit'>Signup</button>
                        <p>
                            Already a member?
                            <Link to={'/'}>Login now</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Signup;
