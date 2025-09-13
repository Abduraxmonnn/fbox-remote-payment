import {Star} from "lucide-react";
import "./RatingStar.css";

const RatingStar = ({rating, setRating, hoveredStar, setHoveredStar, t}) => {
    const handleStarClick = (starIndex) => {
        setRating(starIndex);
    };

    const handleStarHover = (starIndex) => {
        setHoveredStar(starIndex);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    const renderStars = () => {
        return Array.from({length: 5}, (_, index) => {
            const starIndex = index + 1;
            const isActive = starIndex <= (hoveredStar || rating);

            return (
                <button
                    key={starIndex}
                    type="button"
                    className={`star ${isActive ? "active" : ""}`}
                    onClick={() => handleStarClick(starIndex)}
                    onMouseEnter={() => handleStarHover(starIndex)}
                    onMouseLeave={handleStarLeave}
                >
                    <Star size={32} fill={isActive ? "currentColor" : "none"}/>
                </button>
            );
        });
    };

    return (
        <div className="rating-section">
            <label className="rating-label">{t("main.feedback.starTitle")}</label>
            <div className="stars-container">{renderStars()}</div>
        </div>
    );
};

export default RatingStar;
