import React, {useEffect} from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";


function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);


    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    };
    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    };
    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    };
    const closeAllPopups = () => {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsImagePopupOpen(false);
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setIsImagePopupOpen(true);
    };


    const [cards, setCards] = React.useState([]);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);

    useEffect(() => {
        api.getCardList()
            .then(data => {
                setCards(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [currentUser, setCurrentUser] = React.useState({});

    useEffect(() => {
        api.getUserInfo()
            .then(data => {
                setCurrentUser(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    const handleUpdateUser = (currentUser) => {
        api.setUserInfo(currentUser.name, currentUser.about)
            .then(data => {
                setCurrentUser(data);
                closeAllPopups();

            })
            .catch(error => {
                console.log(error);
            });

    };

    const handleUpdateAvatar = (avatar) => {
        api.setUserAvatar(avatar)
            .then(data => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch(error => {
                console.log(error);
            });

    };

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch(error => {
                console.log(error);
            });
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(_ => {
                setCards((state) => state.filter((c) => c._id !== card._id));
            })
            .catch(error => {
                console.log(error);
            });
    }

    function handleAddPlace(e, card) {
        api.addNewCard(card)
            .then(card => {
                setCards([card, ...cards]);
                closeAllPopups();
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="App">
            <CurrentUserContext.Provider value={currentUser}>
                <div className="page">
                    <Header/>

                    <Main onEditProfile={handleEditProfileClick}
                          onAddPlace={handleAddPlaceClick}
                          onEditAvatar={handleEditAvatarClick}
                          cards={cards}
                          handleCardClick={handleCardClick}
                          setCards={setCards}
                          onCardLike={handleCardLike}
                          onCardDelete={handleCardDelete}
                    >
                    </Main>

                    <Footer/>

                    <EditProfilePopup isOpen={isEditProfilePopupOpen}
                                      onUpdateUser={handleUpdateUser}
                                      onClose={closeAllPopups}/>

                    <AddPlacePopup isOpen={isAddPlacePopupOpen}
                                   onAddPlaceSubmit={handleAddPlace}
                                   onClose={closeAllPopups}/>

                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                                     onUpdateAvatar={handleUpdateAvatar}
                                     onClose={closeAllPopups}/>

                    <PopupWithForm name="delete-image" title="Вы уверены?" buttonName="Да"/>

                    <ImagePopup
                        card={selectedCard}
                        onClose={closeAllPopups}
                        isOpen={isImagePopupOpen}
                    />

                </div>
            </CurrentUserContext.Provider>
        </div>
    );
}


export default App;

