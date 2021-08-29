import React from 'react';
import {withRouter} from 'react-router-dom';
import * as auth from '../auth.js';
import './styles/Register.css';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.password);
        console.log(this.state.email);
        // const{password, email} = this.state;
        auth.register(this.state.password, this.state.email)
            .then((res) => {
                console.log('>>>>', res)
                if (res) {
                    this.setState({
                        message: ''
                    }, () => {
                        this.props.history.push('/singin');
                    });
                } else {
                    this.setState({
                        message: 'Что-то пошло не так!'
                    });
                }
            });
    };

    render() {
        return (
            <div className="register">
                <p className="register__title">
                    Регистрация
                </p>
                <form  className="register__form">

                    <input onChange={this.handleChange} value={this.state.email} id="email" type="email" name="email"
                           placeholder="Email"
                           className="register__input register__input_type_email"
                           minLength="5" maxLength="40" required
                    />


                    <input onChange={this.handleChange} value={this.state.password} id="password" type="password"
                           name="password"
                           placeholder="Пароль"
                           className="register__input register__input_password"
                           minLength="8" maxLength="200" required/>


                    <button type="submit" onSubmit={this.handleSubmit}
                            className="register__btn">Зарегистрироваться
                    </button>
                    <p className="register__signin">Уже зарегистрированы? Войти</p>

                </form>

            </div>
        );
    }

}

export default withRouter(Register);
