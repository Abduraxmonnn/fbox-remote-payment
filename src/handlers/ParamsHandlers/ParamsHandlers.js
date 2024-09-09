import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const ParamsHandler = () => {
    const navigate = useNavigate();
    const {params_first, params_second} = useParams(); // Extract parameters from the path

    useEffect(() => {
        if (params_first && params_second) {
            try {
                localStorage.setItem('params_first', params_first);
                localStorage.setItem('params_second', params_second);
            } catch (error) {
                console.error("Error decoding parameters:", error);
            }
        }

        navigate('/');
    }, [params_first, params_second, navigate]);

    return null; // No UI needed for this component
};

export default ParamsHandler;
