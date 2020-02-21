import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";

// import components
import Top from "./component/top";
import LoginSuccess from "./component/loginSuccess";
import Offences from "./component/offences";
import Search from "./component/search";
import Chart from "./component/chart";
import Bottom from "./component/bottom";

// import style
import './index.css';

// import pictures
import login_success from "./img/Successfully_1350.png";
import register_success from "./img/Successfully_Reg_1350.png";

// main component in "main" div
class Main extends React.Component {
    render() {
        return (
            <div className="main">
                <div className="main-top">
                    {/* <LoginSuccess /> is to display search, chart and map parts after successful login */}
                    {this.props.JWT && <LoginSuccess />}
                </div>
            </div>
        );
    }
}

// this is the main app
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            JWT: null // set JWT is null
        };
    }
    
    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <Top onLogin={JWT => this.setState({ JWT })} />

                    {/* show the main part in 'main' div */}
                    <Main JWT={this.state.JWT} />
                    
                    {/* render the register_success pic */}
                    <Route
                        path="/register_success"
                        render={() => (<img src={register_success} width="100%" alt="success"/>)}
                    />
                    {/* render the login_success pic */}
                    <Route
                        path="/login_success"
                        render={() => (<img src={login_success} width="100%" alt="success"/>)}
                    />
                    <Route path="/offences" component={Offences} />
                    {/* render the Search part */}
                    <Route path="/search" render={() => <Search JWT={this.state.JWT} />}/>
                    {/* render the Chart part */}
                    <Route path="/chart" render={() => <Chart JWT={this.state.JWT} />}/>
                    
                    <Bottom />
                </div>
            </BrowserRouter>
        );
    }
}
// render App in the "root" div when the app launches.
ReactDOM.render(<App />, document.getElementById('root'));
