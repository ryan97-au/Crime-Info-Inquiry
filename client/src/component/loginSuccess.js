import React from "react";
import { withRouter } from "react-router-dom";

// package the component
class Main extends React.Component {
    filters = ["area", "age", "gender", "year"]; // four filters
    constructor() {
        super();
        this.state = {
            offence: null,
            area: null,
            age: null,
            gender: null,
            year: null
        };
    }
    
    render() {
        return (
            <span>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;Offences:&nbsp;&nbsp;</label>
                <input 
                    onChange={e => this.setState({ offence: e.target.value })} // update the value of offence
                    placeholder="Enter an offence"
                    id="offence"
                />
                
                {/* areas filter */}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                    onChange={e => this.setState({ area: e.target.value })} // update the value of area
                    placeholder="Enter an area"
                    id="area"
                />
                
                {/* ages filter */}
                <select 
                    onChange={e => this.setState({ age: e.target.value })} // update the value of age
                    id="age"
                >
                    {/* 'Select an age' do not have value */}
                    <option value="">Select an age</option>
                    <option value="Adult">Adult</option>
                    <option value="Juvenile">Juvenile</option>
                </select>
                
                {/* genders filter */}
                <select 
                    onChange={e => this.setState({ gender: e.target.value })} // update the value of gender
                    id="gender"
                >
                    {/* 'Select a gender' do not have value */}
                    <option value="">Select a gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Not Stated">Not Stated</option>
                </select>
                
                {/* years filter */}
                <select 
                    onChange={e => this.setState({ year: e.target.value })} // update the value of year
                    id="year"
                >
                    {/* 'Select a year' do not have value */}
                    <option value="">Select a year</option>
                    <option value="2001">2001</option>
                    <option value="2002">2002</option>
                    <option value="2003">2003</option>
                    <option value="2004">2004</option>
                    <option value="2005">2005</option>
                    <option value="2006">2006</option>
                    <option value="2007">2007</option>
                    <option value="2008">2008</option>
                    <option value="2009">2009</option>
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                </select>
                
                {/* search button */}
                <button
                    id="serBtn"
                    onClick={() => {
                        this.props.history.push( // click serBtn, push the url and jump to the /search route
                            `/search?offence=${this.state.offence}&${this.filters
                                .filter(filter => this.state[filter])
                                .map(
                                    filter =>`${filter}=${encodeURI(this.state[filter])}` // encoding strings
                                )
                                .join("&")}` // use "&" to combine elements of different filters
                        ); // get the pathname
                    }}
                    disabled={!this.state.offence} // if no offence is selected, can't use search btn
                >Search</button>
                
                {/* print chart button */}
                <button
                    id="chartBtn"
                    onClick={() => {
                        this.props.history.push( // click chartBtn, push the url and jump to the /chart route
                            `/chart?offence=${this.state.offence}&${this.filters
                                .filter(filter => this.state[filter])
                                .map(
                                    filter =>`${filter}=${encodeURI(this.state[filter])}` // encoding strings
                                )
                                .join("&")}` // use "&" to combine elements of different filters
                        );
                    }}
                    disabled={!this.state.offence} // if no offence is selected, can't use chart btn
                >Print chart</button>
                
                {/* print map button */}
                <button
                    id="mapBtn"
                    onClick={() => {
                        this.props.history.push(
                            `/map?offence=${this.state.offence}&${this.filters
                                .filter(filter => this.state[filter])
                                .map(
                                    filter =>`${filter}=${encodeURI(this.state[filter])}`
                                )
                                .join("&")}`
                        );
                    }}
                    disabled={!this.state.offence} // if no offence is selected, can't use map btn
                >Print map</button>
            </span>
        );
    }
}

export default withRouter(Main);