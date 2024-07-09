import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const TokenHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);
        const token = url.pathname.slice(1);

        localStorage.setItem('payToken', token);

        navigate('/');
    }, []);

    return null; // No UI needed for this component
};

export default TokenHandler;
