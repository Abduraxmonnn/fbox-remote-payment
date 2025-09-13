import "./PaymentActions.scss"

export default function PaymentActions({
                                           handlePaymentButtonClick,
                                           selectedPaymentMethod,
                                           selectedTip,
                                           customTipAmount,
                                           handleProviderSelectionClick,
                                       }) {
    const isDisabled =
        selectedPaymentMethod.comingSoon ||
        (selectedPaymentMethod.disableWhenTip && (selectedTip > 0 || customTipAmount > 0))

    return (
        <div className="payment-button-container">
            <button
                className="main-payment-button"
                onClick={handlePaymentButtonClick}
                disabled={isDisabled}
            >
                <span className="payment-text">Pay Now</span>

                {/* make this a div instead of a nested button */}
                <div
                    className="provider-selection-button"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleProviderSelectionClick()
                    }}
                >
                    <img
                        src={selectedPaymentMethod.icon}
                        alt={`${selectedPaymentMethod.name} icon`}
                        className="provider-icon"
                    />
                </div>
            </button>
        </div>
    )
}
