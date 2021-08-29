import React from "react";
// import successImg from '../images/info-tooltip-success.svg';
import './styles/InfoTooltip.css';

import failImg from '../images/info-tooltip-fail.svg';


function InfoTooltip({isOpen, onClose}) {
    return (
        <div className={`popup popup_type_info-tooltip ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__content">
                <button onClick={onClose} type="button"
                        className={`popup__close popup__close_type_info-tooltip`}></button>
                <img src={failImg} alt="изображение" className="popup__info-tooltip-image"/>
                {/*<p className="popup__info-tooltip-title">Вы успешно зарегестрировались!</p>*/}
                <p className="popup__info-tooltip-title">Что-то пошло не так! Попробуйте ещё раз.</p>
            </div>
        </div>


    );
}

export default InfoTooltip;