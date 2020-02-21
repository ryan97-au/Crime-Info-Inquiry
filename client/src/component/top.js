import React from "react";
import { withRouter } from "react-router-dom";
import logo from "../img/QLD_Gov.PNG"; // import the picture

// Top component in the "top" div
class Top extends React.Component {
    constructor(props) {
        super(props); // for accessing this.props in constructor
        this.state = {
            JWT: null, // set JWT is null
            email: "",
            password: ""
        };
    }

    // register function
    register() {
        fetch("https://localhost/register", {
            method: "POST",
            body: `email=${this.state.email}&password=${this.state.password}`,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then(result => {
                this.props.history.push("/register_success"); // push and jump to the register_success route in index.js
                console.log(JSON.stringify(result)); // show the register message in console
            })
            .catch(function(error) {
                alert("Oops! It looks like that email already exists!");
                console.log("There has been a problem with your fetch operation: ",error.message);
            });
    }

    // login function
    login() {
        fetch("https://localhost/login", {
            method: "POST",
            body: `email=${this.state.email}&password=${this.state.password}`,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then(result => {
                this.props.history.push("/login_success"); // push and jump to the login_success route
                this.setState({ JWT: result.token }); // update the value of JWT's state
                this.props.onLogin(result.token);
                console.log(JSON.stringify(result)); // show the token in console
            })
            .catch(function(error) {
                alert("Error! Your email or password is incorrect!");
                console.log("There has been a problem with your fetch operation: ",error.message);
            });
    }

    render() {
        return (
            <div className="top">
                <img src={logo} alt="QLD" />
                <nav>
                    <ul>
                        <h1>Getting Started with Crime!</h1>
                        <div>
                            
                            <form>
                                <label htmlFor="email">Email:&nbsp;&nbsp;</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={e => this.setState({ email: e.target.value })} // enter and update the email
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label htmlFor="password">Password:&nbsp;&nbsp;</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={e => this.setState({ password: e.target.value })} // update the pwd
                                />
                            </form>
                            
                            <div>
                                <button
                                    id="regBtn" 
                                    disabled={this.state.JWT} // register once
                                    onClick={this.register.bind(this)} // do register event function
                                >
                                    Register
                                </button>
                                <button
                                    id="logBtn" 
                                    disabled={this.state.JWT} // disabled after logging in, login once
                                    onClick={this.login.bind(this)} // do login event function
                                >
                                    Login
                                </button>
                                <button
                                    id="offBtn"
                                    onClick={() => this.props.history.push("/offences")} // push and jump to the offences route
                                >
                                    Offences
                                </button>
                            </div>
                        
                        </div>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default withRouter(Top);