import {useEffect, useState} from "react";

export default function AnimatedAmount({baseAmount, tipPercentage}) {
    const [displayedAmount, setDisplayedAmount] = useState(baseAmount || 0);

    useEffect(() => {
        const newAmount = tipPercentage
            ? baseAmount + (baseAmount * tipPercentage) / 100
            : baseAmount;

        const duration = 500; // in ms
        const frameRate = 100;
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
    }, [baseAmount, tipPercentage]);

    return (
        <>
            {displayedAmount
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$& ")}
        </>
    );
}
