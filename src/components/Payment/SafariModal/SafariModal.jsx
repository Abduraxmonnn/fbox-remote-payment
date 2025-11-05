import Modal from 'react-modal';
import {useTranslation} from 'react-i18next';
import "/SafariModal.scss"

export default function SafariModal({isOpen, onClose, url}) {
    const {t} = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Payment Link"
            className="payment-modal"
            overlayClassName="payment-modal-overlay"
        >
            <div className="modal-content">
                <h2 className="modal-title">{t("main.payLinkTitle")}</h2>
                <div className="modal-buttons">
                    <button className="modal-button primary-button" onClick={() => {
                        window.open(url, '_blank');
                        onClose();
                    }}>
                        {t("main.openNewTab")}
                    </button>
                    <button className="modal-button secondary-button" onClick={onClose}>
                        {t("main.close")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}