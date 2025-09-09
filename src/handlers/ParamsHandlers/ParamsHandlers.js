import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const ParamsHandler = () => {
    const navigate = useNavigate();
    const {transaction_id} = useParams()

    useEffect(() => {
			if (transaction_id) {
				try {
					localStorage.setItem('transactionId', transaction_id)
				} catch (error) {
					console.error('Error decoding parameters:', error)
				}
			}

			navigate('/pay/')
		}, [transaction_id, navigate])

    return null; // No UI needed for this component
};

export default ParamsHandler;
