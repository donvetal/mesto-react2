import React from "react";
import {withRouter} from "react-router-dom";
import './styles/Login.css';
import * as auth from '../auth.js';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.password || !this.state.email) {

            return;
        }
        auth.authorize(this.state.password, this.state.email)
            .then((data) => {
                if (data.hasOwnProperty('token')) {
                    this.props.onLogin(data.token);
                    this.setState({
                        password: '',
                        email: ''
                    }, () => {
                        this.props.handleLogin(true);
                        this.props.history.push('/');
                    });
                } else {
                    this.props.handleLogin(false);
                }
            })
            .catch(err => {
                this.props.handleLogin(false);
                console.log(err);
            });
    }

    render() {
        return (
            <div className="login">
                <p className="login__title">
                    Вход
                </p>
                <form  onSubmit={this.handleSubmit} className="login__form">
                    <input onChange={this.handleChange} value={this.state.email} id="email" type="email" name="email"
                           placeholder="Email"
                           className="login__input login__input_type_email"
                           minLength="5" maxLength="40" required
                    />

                    <input onChange={this.handleChange} value={this.state.password} id="password" type="password"
                           name="password"
                           placeholder="Пароль"
                           className="login__input login__input_password"
                           minLength="8" maxLength="200" required/>

                    <button  type="submit" className="login__btn">Войти</button>
                </form>

            </div>
        );
    }
}

export default withRouter(Login);