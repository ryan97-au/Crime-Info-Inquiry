import React from "react";
import { withRouter } from "react-router-dom";
import Table from "./table"; // import the Table component

// package the component
class Main extends React.Component {
    constructor(props) {
        super(props); // for accessing this.props in constructor
        this.state = { searchResult: [] }; // set the initial array searchResult
        this.showsearch(); // to show the first search result
    }
    
    componentDidUpdate(prevProps) {
        // refresh table when search the different params
        if (prevProps.location.search !== this.props.location.search)
            this.showsearch();
            console.log(this.props.location.search); // show the current pathname
    }
    
    showsearch() {
        fetch(`https://localhost/search${this.props.location.search}`, {
            headers: { Authorization: `Bearer ${this.props.JWT}` } // authorization
        })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(({ result }) => {
                var searchResult = result.map((param, i) => Object.assign(param, { key: i })); // Object {param, key}
                this.setState({
                    searchResult // get the data of all areas
                }); // update the value of searchResult's state
                console.log(searchResult); // to see the format of the array
                console.log(JSON.stringify(result)); // show the detailed info of each Council in console
            })
            .catch(function(error) {
                console.log("There has been a problem with your fetch operation: ",error.message);
            });
    }
    
    render() {
        return (
            // show the results with table
            <Table
                columns={[
                    { title: "LGA", key: "LGA", dataIndex: "LGA" },
                    { title: "total", key: "total", dataIndex: "total" }
                ]}
                data={this.state.searchResult} // print the table with the data of current searchResult
            />
        );
    }
}
// get history, location from props
export default withRouter(Main);