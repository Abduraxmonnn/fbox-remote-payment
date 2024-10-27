import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const ParamsHandler = () => {
    const navigate = useNavigate();
    const {transaction_id} = useParams() // Extract parameters from the path
    console.log('transaction_id: ', transaction_id)

    useEffect(() => {
			if (transaction_id) {
				try {
					localStorage.setItem('transactionId', transaction_id)
				} catch (error) {
					console.error('Error decoding parameters:', error)
				}
			}

			navigate('/')
		}, [transaction_id, navigate])

    return null; // No UI needed for this component
};

export default ParamsHandler;
