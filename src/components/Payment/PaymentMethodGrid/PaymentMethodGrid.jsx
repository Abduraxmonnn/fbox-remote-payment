import {useTranslation} from 'react-i18next';

export default function PaymentMethodGrid({
                                              paymentMethods,
                                              selectedTip,
                                              customTipAmount,
                                              theme,
                                              handleButtonClick
                                          }) {
    const {t} = useTranslation();

    return (
        <div className="payment-methods-grid">
            {paymentMethods.map((method) => {
                const isDisabled = method.comingSoon || (method.disableWhenTip && (selectedTip > 0 || customTipAmount > 0));

                return (
                    <div
                        key={method.name}
                        className={`payment-method-card 
              ${method.isPopular ? 'popular-card' : ''} 
              ${isDisabled ? 'coming-soon-card' : ''}`}
                        onClick={!isDisabled ? () => handleButtonClick(method.key) : undefined}
                    >
                        {method.isPopular && <div className="popular-badge">{t("base.popular")}</div>}
                        {method.comingSoon && <div className="soon-badge">{t("base.comingSoon")}</div>}
                        {(method.disableWhenTip && (selectedTip > 0 || customTipAmount > 0)) && (
                            <div className="soon-badge disable-badge">{t("main.notAvailableWithTip")}</div>
                        )}

                        <div className="method-icon">
                            <img
                                src={
                                    isDisabled
                                        ? method.inactive_icon || '/placeholder.svg'
                                        : method.icon || '/placeholder.svg'
                                }
                                alt={`${method.name} icon`}
                                className="icon-image"
                            />
                        </div>

                        <span
                            className={`payment-provider ${theme === 'dark' && method.isPopular ? 'popular-provider' : ''}`}>
              {method.name}
            </span>
                    </div>
                );
            })}
        </div>
    );
}
