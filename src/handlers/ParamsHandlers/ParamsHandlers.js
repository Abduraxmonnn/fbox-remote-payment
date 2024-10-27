import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const ParamsHandler = () => {
    const navigate = useNavigate();
    const {transactionId} = useParams(); // Extract parameters from the path

    useEffect(() => {
        if (transactionId) {
            try {
                localStorage.setItem('transactionId', transactionId);
            } catch (error) {
                console.error("Error decoding parameters:", error);
            }
        }

        navigate('/');
    }, [transactionId, navigate]);

    return null; // No UI needed for this component
};

export default ParamsHandler;
