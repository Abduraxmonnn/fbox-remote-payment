import Modal from 'react-modal'
import 'aos/dist/aos.css'
import { ChevronRight } from 'lucide-react'
import '../PaymentServices.scss'
import { images } from '../../constants'

Modal.setAppElement('#root')

const paymentMethods = [
	{ name: 'Payme', icon: images.payme_square_icon },
	{ name: 'Click', icon: images.click_square_icon },
	{ name: 'Uzum', icon: images.uzum_square_icon },
	{ name: 'Anorbank', icon: images.anorbank_square_icon, },
]

export default function DefaultPaymentServices() {
	return (
		<div className='payment-page default-page'>
			<filter id='blur'>
				<feGaussianBlur stdDeviation='3.5' edgeMode='duplicate' />
			</filter>
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
							<h1 className='restaurant-name'>
								Scan 2 Pay
							</h1>
							<p className='restaurant-address'>
								<img
									src={images.locationIcon}
									alt='locaiton icon'
									className='location-image'
								/>
								Uzbekistan, Tashkent
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='content'>
				<h2 className='section-title'>
					Итого к оплате
				</h2>
				<p className='total-amount'>
					{(0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')}
				</p>
				<p className='invoice-number'>
					Счет №46454
				</p>

				<h3 className='section-title'>
					Выберите способы оплаты
				</h3>

				<div className='button-section'>
					<div className='divider'></div>

					{paymentMethods.map(method => (
						<div
							key={method.name}
							className='payment-method'
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
		</div>
	)
}
