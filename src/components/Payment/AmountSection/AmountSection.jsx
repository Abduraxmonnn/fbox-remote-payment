import AnimatedAmount from "../../AnimatedAmount/AnimatedAmount";
import {useTranslation} from "react-i18next";

export default function AmountSection({amount, selectedTip, customTipAmount, isManualTipConfirmed}) {
    const {t} = useTranslation();

    return (
        <div className="amount-container">
            <p className="total-amount">
                <AnimatedAmount
                    baseAmount={amount}
                    tipPercentage={typeof selectedTip === 'number' ? selectedTip : 0}
                    customTipAmount={
                        selectedTip === 'manual' && isManualTipConfirmed ? Number(customTipAmount) : 0
                    }
                />
                <span className="currency">{t("base.currency")}</span>
            </p>
        </div>
    );
}
