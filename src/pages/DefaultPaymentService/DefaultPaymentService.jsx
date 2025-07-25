import { images } from '../../constants';
import { useEffect, useState } from 'react';
import '../PaymentServices.scss';
import {useTranslation} from "react-i18next";
import Localization from "../../components/Localization/Localization";

const paymentMethods = [
	{ name: 'Payme', icon: images.payme_square_icon, isPopular: true },
	{ name: 'Click', icon: images.click_square_icon },
	{ name: 'Uzum', icon: images.uzum_square_icon, inactive_icon: images.inactive_uzum_square_icon, comingSoon: true },
	{ name: 'Anorbank', icon: images.anorbank_square_icon, inactive_icon: images.inactive_anorbank_square_icon, comingSoon: true },
];

export default function DefaultPaymentServices({ address, amount, invoiceNumber }) {
	const { t } = useTranslation();
	const [theme, setTheme] = useState('light');
	const [selectedTip, setSelectedTip] = useState(null); // State to track selected tip percentage

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	const handleTipSelect = (tip) => {
		setSelectedTip(tip === selectedTip ? null : tip); // Toggle selection or deselect
	};

	const tipOptions = [
		{ label: `${t("default.noTip")}`, value: null },
		{ label: '5%', value: 5 },
		{ label: '10%', value: 10 },
		{ label: '15%', value: 15 },
		{ label: '20%', value: 20 },
	];

	return (
		<div className="payment-page default-page">
			<div className="banner">
				<Localization/>
				<img
					src={images.default_banner || '/placeholder.svg'}
					alt="Restaurant banner"
					className="banner-image"
				/>
				<div className="banner-overlay">
					<div className="logo-container">
						<div className="logo">
							<img
								src={images.default_store || '/placeholder.svg'}
								alt="Store logo"
								className="store-image"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="content">
				<div className="address-container">
					<p className="restaurant-address">{address || t("default.addressNotProvided")}</p>
				</div>

				<div className="amount-container">
					<p className="total-amount">
						{amount || 0} <span className="currency">{t("base.currency")}</span>
					</p>
				</div>

				<p className="invoice-number">{invoiceNumber || t("default.invoiceMissing")}</p>

				<h3 className="tip-title">{t("base.leaveTip")}</h3>
				<div className="tip-buttons">
					{tipOptions.map((tip) => (
						<button
							key={tip.value || 'none'}
							className={`tip-button ${selectedTip === tip.value ? 'selected' : ''}`}
							onClick={() => handleTipSelect(tip.value)}
							aria-label={`Select ${tip.label}`}
						>
							{tip.label}
						</button>
					))}
				</div>

				<h3 className="section-title">{t("base.selectPaymentMethod")}</h3>

				<div className="payment-methods-grid">
					{paymentMethods.map((method) => (
						<div
							key={method.name}
							className={`payment-method-card ${method.isPopular ? 'popular-card' : ''} ${method.comingSoon ? 'coming-soon-card' : ''}`}
							tabIndex={0}
							role="button"
							aria-label={`Select ${method.name} payment method${method.comingSoon ? ' (Coming Soon)' : ''}`}
						>
							{method.isPopular && <div className="popular-badge">{t("base.popular")}</div>}
							{method.comingSoon && <div className="soon-badge">{t("base.comingSoon")}</div>}
							<div className="method-icon">
								<img
									src={method.comingSoon ? method.inactive_icon || '/placeholder.svg' : method.icon || '/placeholder.svg'}
									alt={`${method.name} payment icon`}
									className="icon-image"
								/>
							</div>
							<span className={`payment-provider ${theme === 'dark' ? 'popular-provider' : ''}`}>
                {method.name}
              </span>
						</div>
					))}
				</div>

				<p className="footer">scan2pay powered by FiscalBox</p>
			</div>
		</div>
	);
}