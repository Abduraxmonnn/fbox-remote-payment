import Modal from 'react-modal'
import 'aos/dist/aos.css'
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
		<div className="payment-page default-page">
			<div className="banner">
				<img src={images.default_banner || "/placeholder.svg"} alt="Restaurant banner" className="banner-image" />
				<div className="banner-overlay">
					<div className="logo-container">
						<div className="logo">
							<img src={images.default_store || "/placeholder.svg"} alt="store-image" className="store-image" />
						</div>
					</div>
				</div>
			</div>

			<div className="content">
				<div className="address-container">
					<p className="restaurant-address">улица Тараса Шевченко, 28</p>
				</div>

				<div className="amount-container">
					<p className="total-amount">
						141 800 <span className="currency">сум</span>
					</p>
				</div>

				<p className="invoice-number">Счет №446454</p>

				<h3 className="section-title">Выберите способ оплаты</h3>

				<div className="payment-methods-grid">
					{paymentMethods.map((method) => (
						<div key={method.name} className="payment-method-card">
							<div className="method-icon">
								<img src={method.icon || "/placeholder.svg"} alt={`${method.name} icon`} className="icon-image" />
							</div>
							<span className="payment-provider">{method.name}</span>
						</div>
					))}
				</div>

				<p className="footer">scan2pay powered by FiscalBox</p>
			</div>
		</div>
	)
}