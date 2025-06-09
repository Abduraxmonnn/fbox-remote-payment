import Modal from 'react-modal'
import 'aos/dist/aos.css'
import '../PaymentServices.scss'
import {images} from '../../constants'
import {useEffect, useState} from "react";

Modal.setAppElement('#root')

const paymentMethods = [
    {name: 'Payme', icon: images.payme_square_icon, isPopular: true},
    {name: 'Click', icon: images.click_square_icon},
    {name: 'Uzum', icon: images.uzum_square_icon, inactive_icon: images.inactive_uzum_square_icon, comingSoon: true},
    {name: 'Anorbank', icon: images.anorbank_square_icon, inactive_icon: images.inactive_anorbank_square_icon, comingSoon: true},
]

export default function DefaultPaymentServices() {
	const [theme, setTheme] = useState("cream"); // Default theme

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return (
        <div className="payment-page default-page">
            <div className="banner">
                <img src={images.default_banner || "/placeholder.svg"} alt="Restaurant banner"
                     className="banner-image"/>
                <div className="banner-overlay">
                    <div className="logo-container">
                        <div className="logo">
                            <img src={images.default_store || "/placeholder.svg"} alt="store-image"
                                 className="store-image"/>
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
						<div key={method.name}
							 className={`payment-method-card ${method.isPopular ? "popular-card" : ""} ${method.comingSoon ? "coming-soon-card" : ""}`}>
							{method.isPopular && <div className="popular-badge">Популярный</div>}
							{method.comingSoon && <div className="soon-badge">Скоро</div>}
							<div className="method-icon">
								<img
									src={
										method.comingSoon
											? method.inactive_icon || "/placeholder.svg"
											: method.icon || "/placeholder.svg"
									}
									alt={`${method.name} icon`}
									className="icon-image"
								/>
							</div>
							<span className={`payment-provider ${theme === 'dark' ? "popular-provider" : ""}`}>{method.name}</span>
						</div>
					))}
				</div>

				<p className="footer">scan2pay powered by FiscalBox</p>
			</div>
		</div>
	)
}