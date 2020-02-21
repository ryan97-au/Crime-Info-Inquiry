import React from "react";
import Table from "./table"; // import the Table component

// Offences component
class Offences extends React.Component {
    constructor() {
        super();
        this.state = { offences: [] }; // set the initial array
        
        fetch("https://localhost/offences")
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then(result => {
                this.setState({
                    offences: result.offences.map((param, i) => ({ name: param, key: i })) // get all offences
                }); // update the value of state
                console.log(JSON.stringify(result)); // show the array of the offences in console
            })
            .catch(function(error) {
                console.log("There has been a problem with your fetch operation: ",error.message);
            });
    }
    
    render() {
        return (
            <Table
                columns={[{ title: "Name", key: "name", dataIndex: "name" }]}
                data={this.state.offences} // print the table with the data of offences
            />
        );
    }
}

export default Offences;