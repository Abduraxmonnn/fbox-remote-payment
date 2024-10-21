import React from 'react';
import { ChevronRight } from 'lucide-react';
import './PaymentServices.scss';
import {images} from "../../constants";

const paymentMethods = [
  { name: 'Payme', icon: images.payme_square_icon },
  { name: 'Click', icon: images.click_square_icon },
  { name: 'Uzum', icon: images.uzum_square_icon },
  { name: 'Anorbank', icon: images.anorbank_square_icon },
];

export default function PaymentServices() {
  return (
		<div className='payment-page'>
			<div className='banner'>
				<img
					src='https://via.placeholder.com/384x192'
					alt='Bon! restaurant banner'
					className='banner-image'
				/>
				<div className='banner-overlay'>
					<div className='logo-container'>
						<div className='logo'>Bon!</div>
						<div>
							<h1 className='restaurant-name'>Bon!</h1>
							<p className='restaurant-address'>✓ улица Тараса Шевченко, 28</p>
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

					<p className='footer'>design powered by FiscalBox</p>
				</div>
			</div>
		</div>
	)
}