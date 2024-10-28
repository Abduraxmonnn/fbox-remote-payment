import Modal from 'react-modal'
import AOS from 'aos'
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
					data-aos='zoom-in'
				/>
				<div className='banner-overlay'>
					<div className='logo-container'>
						<div className='logo' data-aos='zoom-in'>
							<img
								src={images.default_store}
								alt='store-image'
								className='store-image'
							/>
						</div>
						<div>
							<h1 className='restaurant-name' data-aos='flip-down'>
								Scan 2 Pay
							</h1>
							<p className='restaurant-address' data-aos='flip-down'>
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
				<h2 className='section-title' data-aos='zoom-in-up'>
					Итого к оплате
				</h2>
				<p className='total-amount' data-aos='zoom-in-up'>
					000 000
				</p>
				<p className='invoice-number' data-aos='zoom-in-up'>
					Счет №46454
				</p>

				<h3 className='section-title' data-aos='zoom-in-up'>
					Выберите способы оплаты
				</h3>

				<div className='button-section'>
					<div className='divider' data-aos='zoom-in'></div>

					{paymentMethods.map(method => (
						<div
							key={method.name}
							className='payment-method'
							data-aos='zoom-in'
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
