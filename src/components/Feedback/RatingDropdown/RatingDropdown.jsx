import React, {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {ChevronDown} from "lucide-react";
import {useTranslation} from "react-i18next";
import "./RatingDropdown.css"

const RatingDropdown = ({rating, setRating}) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const ratings = [1, 2, 3, 4, 5];

    return (
        <div className="rating-dropdown">
            <button
                type="button"
                className="dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {rating === 0 ? t("main.feedback.rateTitle") : t(`main.feedback.rating.${rating}`)}
                <ChevronDown className={`icon ${isOpen ? "rotate" : ""}`} size={18}/>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className="dropdown-menu"
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.2}}
                    >
                        {ratings.map((num) => (
                            <li
                                key={num}
                                onClick={() => {
                                    setRating(num);
                                    setIsOpen(false);
                                }}
                                className={`dropdown-item ${rating === num ? "active" : ""}`}
                            >
                                {t(`main.feedback.rating.${num}`)}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RatingDropdown;
