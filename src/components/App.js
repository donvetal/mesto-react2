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
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import successImg from '../images/info-tooltip-success.svg';
import * as auth from '../auth.js';


function App(props) {
    const [loggedIn, setLoggedIn] = React.useState(false);

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
    const [email, setEmail] = React.useState({});

    const handleLogin = (e) => {
        e.preventDefault();
        setLoggedIn(true);
    };

    useEffect(() => {
        handleTokenCheck();
    }, []);

    const onLogin = (token) => {
        localStorage.setItem('token', token);
    };
    const onSignOut = () => {
        localStorage.removeItem('token');
    };


    const handleTokenCheck = () => {
        if (localStorage.getItem('token')) {
            const jwt = localStorage.getItem('token');
            // проверяем токен пользователя
            auth.getContent(jwt)
                .then((res) => {
                    // найдём выбранное пользователем количество калорий
                    // из списка возможных целей
                    if (res) {
                        setEmail({email: res.data.email});
                        // если есть цель, добавляем её в стейт
                        setLoggedIn(true);

                    }

                })
                .then(() => {
                    props.history.push("/");

                });

        }
    };

    const handleRegistrationClick = () => {
        setIsInfoTooltipOpen(true);
    };


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
        setIsInfoTooltipOpen(false);
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
                    <Header onSignOut={onSignOut} userData={email}/>
                    <Switch>
                        <Route path="/signin">
                            <Login handleLogin={handleLogin} onLogin={onLogin}/>
                        </Route>
                        <Route path="/signup">
                            <Register
                                onRegister={handleRegistrationClick}/>
                            <InfoTooltip
                                isOpen={isInfoTooltipOpen}
                                onClose={closeAllPopups}
                                image={successImg}
                                title={'Вы успешно зарегестрировались!'}

                            />
                        </Route>

                        <Route>
                            {loggedIn ? (<Redirect to="/"/>) : (<Redirect to="/signin"/>)}

                            <ProtectedRoute exact path="/"
                                            loggedIn={loggedIn}
                                            component={Main}
                                            onEditProfile={handleEditProfileClick}
                                            onAddPlace={handleAddPlaceClick}
                                            onEditAvatar={handleEditAvatarClick}
                                            cards={cards}
                                            handleCardClick={handleCardClick}
                                            setCards={setCards}
                                            onCardLike={handleCardLike}
                                            onCardDelete={handleCardDelete}

                            />
                            <ProtectedRoute exact path="/"
                                            loggedIn={loggedIn}
                                            component={Footer}
                            />
                            <ProtectedRoute exact path="/"
                                            loggedIn={loggedIn}
                                            component={EditProfilePopup}
                                            isOpen={isEditProfilePopupOpen}
                                            onUpdateUser={handleUpdateUser}
                                            onClose={closeAllPopups}
                            />
                            <ProtectedRoute exact path="/"
                                            loggedIn={loggedIn}
                                            component={AddPlacePopup}
                                            isOpen={isAddPlacePopupOpen}
                                            onAddPlaceSubmit={handleAddPlace}
                                            onClose={closeAllPopups}
                            />
                            <ProtectedRoute exact path="/"
                                            loggedIn={loggedIn}
                                            component={EditAvatarPopup}
                                            isOpen={isEditAvatarPopupOpen}
                                            onUpdateAvatar={handleUpdateAvatar}
                                            onClose={closeAllPopups}
                            />
                            <ProtectedRoute exact path="/"
                                            loggedIn={loggedIn}
                                            component={PopupWithForm}
                                            name="delete-image"
                                            title="Вы уверены?"
                                            buttonName="Да"

                            />
                            <ProtectedRoute exact path="/"
                                            loggedIn={loggedIn}
                                            component={ImagePopup}
                                            card={selectedCard}
                                            onClose={closeAllPopups}
                                            isOpen={isImagePopupOpen}
                            />

                        </Route>

                    </Switch>
                </div>
            </CurrentUserContext.Provider>
        </div>
    );
}


export default withRouter(App);

