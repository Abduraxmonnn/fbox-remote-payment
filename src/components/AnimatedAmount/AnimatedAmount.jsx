import {useEffect, useState} from "react";

export default function AnimatedAmount({baseAmount, tipPercentage, customTipAmount}) {
    const [displayedAmount, setDisplayedAmount] = useState(baseAmount || 0);

    useEffect(() => {
        let newAmount = baseAmount;

        if (customTipAmount) {
            newAmount += parseFloat(customTipAmount || 0);
        } else if (tipPercentage) {
            newAmount += (baseAmount * tipPercentage) / 100;
        }

        const duration = 400;
        const frameRate = 30;
        const totalFrames = Math.round((duration / 1000) * frameRate);
        const diff = newAmount - displayedAmount;
        const step = diff / totalFrames;

        let frame = 0;

        const animate = () => {
            frame++;
            setDisplayedAmount((prev) => {
                const next = prev + step;
                return step > 0 ? Math.min(next, newAmount) : Math.max(next, newAmount);
            });
            if (frame < totalFrames) requestAnimationFrame(animate);
        };

        animate();
    }, [baseAmount, tipPercentage, customTipAmount]);

    return (
        <>
            {displayedAmount
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$& ")}
        </>
    );
}
