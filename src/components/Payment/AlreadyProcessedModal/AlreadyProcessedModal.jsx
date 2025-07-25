import Modal from 'react-modal';
import {useTranslation} from 'react-i18next';

export default function AlreadyProcessedModal({isOpen, onClose}) {
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
                <h2 className="modal-title processed">
                    {t("main.alreadyProcessed")}
                </h2>
                <div className="modal-buttons">
                    <button className="modal-button secondary-button" onClick={onClose}>
                        {t("main.close")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
