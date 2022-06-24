import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../../components/Alert';
import styles from './style/Login.module.scss';
import logoLogin from './assets/logo-login.png';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return <div>Login</div>;
};

export default Login;
