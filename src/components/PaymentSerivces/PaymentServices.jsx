import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ChevronRight } from 'lucide-react';
import '../PaymentServices.scss';
import { images } from '../../constants';
import { DATA_LOCAL_API } from '../../api';
import DefaultPaymentServices from '../DefaultPaymentService/DefaultPaymentService';

Modal.setAppElement('#root');

const paymentMethods = [
  { name: 'Payme', icon: images.payme_square_icon },
  { name: 'Click', icon: images.click_square_icon },
  {
    name: 'Uzum',
    icon: images.uzum_square_icon,
    isWork: 'Скоро доступно',
  },
  {
    name: 'Anorbank',
    icon: images.anorbank_square_icon,
    isWork: 'Скоро доступно',
  },
];

export default function PaymentServices() {
	const [transactionData, setTransactionData] = useState(null)
	const [selectedService, setSelectedService] = useState(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [modalContent, setModalContent] = useState('')

	const fetchTransactionData = async () => {
		const body = {
			transaction_id: localStorage.getItem('transactionId'),
		}

		try {
			const response = await DATA_LOCAL_API.post('/', body, {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_SERVER_TOKEN}`,
				},
			})

			const data = {
				marketName: response.data.company_name,
				marketAddress: response.data.company_address,
				amount: response.data.amount,
				orderId: response.data.order_id,
				marketLogo: response.data.company_logo,
				marketBanner: response.data.company_banner,
			}

			setTransactionData(data)
		} catch (err) {
			console.error('Something went wrong:', err)
		}
	}

	useEffect(() => {
		AOS.init({ duration: 2000 })
		fetchTransactionData()
	}, [])

	// Log transactionData whenever it changes
	useEffect(() => {
		if (transactionData) {
			console.log('transactionData: ', transactionData)
		}
	}, [transactionData])

return (
	<div className='payment-page'>
		{transactionData ? (
			<>
				<div className='banner'>
					<img
						src={transactionData.marketBanner || images.default_banner}
						alt='Restaurant banner'
						className='banner-image'
						data-aos='zoom-in'
					/>
					<div className='banner-overlay'>
						<div className='logo-container'>
							<div className='logo' data-aos='zoom-in'>
								<img
									src={transactionData.marketLogo || images.default_store}
									alt='store-image'
									className='store-image'
								/>
							</div>
							<div>
								<h1 className='restaurant-name' data-aos='flip-down'>
									{transactionData.marketName}
								</h1>
								<p className='restaurant-address' data-aos='flip-down'>
									<img
										src={images.locationIcon}
										alt='location icon'
										className='location-image'
									/>
									{transactionData.company_address || 'Узбекистан'}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className='content'>
					<h2 className='section-title' data-aos='zoom-in-up'>
						Итого к оплате
					</h2>
					<p className='total-amount' data-aos='zoom-in-up'>
						{transactionData.amount}
					</p>
					<p className='invoice-number' data-aos='zoom-in-up'>
						Счет №{transactionData.orderId}
					</p>

					<h3 className='section-title' data-aos='zoom-in-up'>
						Способы оплаты
					</h3>

					<div className='button-section'>
						<div className='divider' data-aos='zoom-in'></div>

						<h4 className='section-title' data-aos='zoom-in'>
							Выберите способы оплаты
						</h4>

						{paymentMethods.map(method => (
							<div
								key={method.name}
								className='payment-method'
								data-aos='zoom-out-up'
							>
								<div className='method-info'>
									<div className='method-icon'>
										<img
											src={method.icon}
											alt={`${method.name} icon`}
											className='icon-image'
										/>
									</div>
									<span className='payment-provider'>
										{method.name}
										{method.isWork && (
											<span className='soon-payment-provider'>
												{' '}
												- {method.isWork}
											</span>
										)}
									</span>
								</div>
								<ChevronRight className='chevron' />
							</div>
						))}

						<p className='footer'>Design powered by FiscalBox</p>
					</div>
				</div>
			</>
		) : (
			<>
        {DefaultPaymentServices()}
			</>
		)}
	</div>
)
}
