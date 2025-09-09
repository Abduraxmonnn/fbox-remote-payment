import {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import {images} from '../../constants';

import {
    BannerSection,
    AmountSection,
    InvoiceBreakdown,
    PaymentMethodGrid,
    TipSection,
} from "../../components/Payment";

import '../PaymentServices.scss';
import TipReceiver from "../../components/Payment/TipReceiver/TipReceiver";

const paymentMethods = [
    {key: 'payme', name: 'Payme', icon: images.payme_square_icon, isPopular: true},
    {key: 'click', name: 'Click', icon: images.click_square_icon},
    {
        key: 'uzum',
        name: 'Uzum',
        icon: images.uzum_square_icon,
        inactive_icon: images.inactive_uzum_square_icon,
        comingSoon: true,
    },
    {
        key: 'anorbank',
        name: 'Anorbank',
        icon: images.anorbank_square_icon,
        inactive_icon: images.inactive_anorbank_square_icon,
        comingSoon: true,
    },
];

export default function DefaultPaymentServices({address, amount, invoiceNumber}) {
    const {t} = useTranslation();
    const [theme, setTheme] = useState('light');
    const [selectedTip, setSelectedTip] = useState(null);
    const [customTipAmount, setCustomTipAmount] = useState('');
    const [isManualTipConfirmed, setIsManualTipConfirmed] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="payment-page default-page">
            <BannerSection
                banner={images.default_banner || '/placeholder.svg'}
                logo={images.default_store || '/placeholder.svg'}
            />

            <div className="content">
                <div className="address-container">
                    <p className="restaurant-address">
                        {address || t("default.addressNotProvided")}
                    </p>
                </div>

                <AmountSection
                    amount={amount || 0}
                    selectedTip={selectedTip}
                    customTipAmount={customTipAmount}
                    isManualTipConfirmed={isManualTipConfirmed}
                />

                <p className="invoice-number">
                    {invoiceNumber || t("default.invoiceMissing")}
                </p>

                <TipSection
                    selectedTip={selectedTip}
                    setSelectedTip={setSelectedTip}
                    customTipAmount={customTipAmount}
                    setCustomTipAmount={setCustomTipAmount}
                    isManualTipConfirmed={isManualTipConfirmed}
                    setIsManualTipConfirmed={setIsManualTipConfirmed}
                    transactionData={{
                        amount: amount || 0,
                        scan2payDefaultTipPercent: null,
                    }}
                    saveTipToStorage={() => {
                    }}
                    handleConfirmManualTip={() => {
                    }}
                />

                <TipReceiver onChange={(value) => console.log("Selected receiver:", value)}/>

                <InvoiceBreakdown
                    amount={amount || 0}
                    selectedTip={selectedTip}
                    customTipAmount={customTipAmount}
                    isManualTipConfirmed={isManualTipConfirmed}
                />

                <h3 className="section-title">{t("base.selectPaymentMethod")}</h3>

                <PaymentMethodGrid
                    paymentMethods={paymentMethods}
                    selectedTip={selectedTip}
                    customTipAmount={customTipAmount}
                    theme={theme}
                    handleButtonClick={(service) =>
                        console.log("Selected service:", service)
                    }
                />

                <p className="footer">scan2pay powered by FiscalBox</p>
            </div>
        </div>
    );
}
