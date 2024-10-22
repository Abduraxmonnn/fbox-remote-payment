import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ChevronRight } from 'lucide-react'
import './PaymentServices.scss'
import { images } from '../../constants'
import { INIT_API, INIT_LOCAL_API } from '../../api'

Modal.setAppElement('#root')

const paymentMethods = [
	{ name: 'Payme', icon: images.payme_square_icon },
	{ name: 'Click', icon: images.click_square_icon },
	{ name: 'Uzum', icon: images.uzum_square_icon },
	{ name: 'Anorbank', icon: images.anorbank_square_icon },
]

export default function PaymentServices() {
	const [selectedService, setSelectedService] = useState(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [modalContent, setModalContent] = useState('')

	const isSafari = () => {
		return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	}

	const isIphone = () => {
		return /iPhone/i.test(navigator.userAgent)
	}

	useEffect(() => {
		AOS.init({ duration: 2000 })
	}, [])

	const handleButtonClick = async service => {
		setSelectedService(service) // Set the selected service

		const body = {
			params: {
				source: service, // Use the service passed to the function
				first: localStorage.getItem('params_first'),
				second: localStorage.getItem('params_second'),
			},
		}

		try {
			const response = await INIT_API.post('/', body, {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_SERVER_TOKEN}`,
				},
			})

			if (response.data.status === 'successfully') {
				const url = response.data.message
				if (isSafari() || isIphone()) {
					setModalContent(url)
					setModalIsOpen(true)
				} else {
					window.open(url, '_blank') // Open in new tab for other browsers
				}
			} else if (response.data.status === 'error') {
				alert('Транзакция уже обработана.')
			} else {
				console.log('Response status:', response.data.status)
				console.log('Message:', response.data.message)
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const isServiceEnabled = service => {
		const enabledServices = ['payme', 'click']
		return enabledServices.includes(service)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	return (
		<div className='payment-page'>
			<div className='banner'>
				<img
					src={images.default_banner}
					alt='Restaurant banner'
					className='banner-image'
				/>
				<div className='banner-overlay'>
					<div className='logo-container'>
						<div className='logo'>
							<img
								src={images.default_store}
								alt='store-image'
								className='store-image'
							/>
						</div>
						<div>
							<h1 className='restaurant-name'>Bon!</h1>
							<p className='restaurant-address'>
								<img
									src={images.locationIcon}
									alt='locaiton icon'
									className='location-image'
								/>
								улица Тараса Шевченко, 28
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='content'>
				<h2 className='section-title'>Итого к оплате</h2>
				<p className='total-amount'>89 500</p>
				<p className='invoice-number'>Счет №46454</p>

				<h3 className='section-title'>Способы оплаты</h3>

				<div className='button-section'>
					<div className='divider'></div>

					<h4 className='section-title'>Выберите способы оплаты</h4>

					{paymentMethods.map(method => (
						<div key={method.name} className='payment-method'>
							<div className='method-info'>
								<div className='method-icon'>
									<img
										src={method.icon}
										alt={`${method.name} icon`}
										className='icon-image'
									/>
								</div>
								<span>{method.name}</span>
							</div>
							<ChevronRight className='chevron' />
						</div>
					))}

					<p className='footer'>Design powered by FiscalBox</p>
				</div>
			</div>
		</div>
	)
}
