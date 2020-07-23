import React, { Component } from 'react'
import axios from 'axios';

import AuthContext from '../components/context/authContext';

export default class Auth extends Component {

    state = {
        email: '',
        password: '',
        isLogin: true
    }

    static contextType = AuthContext;

    submitHandler = (event) => {
        
        event.preventDefault();

        const email = this.state.email;
        const password = this.state.password;
                

        if ( email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login (email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation  CreateUser($email: String!, $password: String!) {
                        createUser( userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            }

        }
        

        axios.post('http://localhost:4000/graphql', requestBody)
        .then( response => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to fetch!');
            }
            return response;
        })
        .then( response => {
            if (response.data.data.login.token) {
                this.context.login(
                    response.data.data.login.token, 
                    response.data.data.login.userId, 
                    response.data.data.login.tokenExpiration
                )
            }
        })
        .catch( error => {
            console.log(error)
        })
        
    }

    switchModeHandler = () => {
        this.setState( prevState => {
            return { isLogin: !prevState.isLogin };
        })
    }

    render() {
        return (
            <div>
                <main className="pa4 black-80 pv7">
                    <form className="w-90 w-80-m w-40-l center" onSubmit={this.submitHandler}>
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f4 fw6 ph0 mh0">{this.state.isLogin === true ? 'Login' : 'Sign Up'}</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input onChange={(e)=> { this.setState({ email: e.target.value }) }} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input onChange={(e)=> { this.setState({ password: e.target.value }) }} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
                        </div>
                        </fieldset>
                        <div className="">
                        <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Submit" />
                        </div>
                        <div className="lh-copy mt3">
                        <button onClick={this.switchModeHandler} className="f6 link dim black db">{this.state.isLogin ? 'Sign Up' : 'Login' }</button>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}
