import Localization from "../../Localization/Localization";

export default function BannerSection({banner, logo}) {
    return (
        <div className="banner">
            <Localization/>
            <img src={banner} alt="Banner" className="banner-image"/>
            <div className="banner-overlay">
                <div className="logo-container">
                    <div className="logo">
                        <img src={logo} alt="store-logo" className="store-image"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
