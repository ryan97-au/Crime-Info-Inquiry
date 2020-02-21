import React from "react";
import { withRouter } from "react-router-dom";
import Chart from "chart.js";

// package the component
class Main extends React.Component {
    // call after component rendering
    componentDidMount() {
        this.chart = new Chart('chart', {
            type: "bar" // the type of chart
        });
        this.showchart(); // to show the chart of the first search result
    }

    componentDidUpdate(prevProps) {
        // refresh when the filters are changed
        if (prevProps.location.search !== this.props.location.search)
            this.showchart();
            console.log(this.props.location.search); // show the current pathname
    }
    
    showchart() {
        this.chart.destroy(); // destroy the current chart before re-showing a new chart
        fetch(`https://localhost/search${this.props.location.search}`, {
            headers: { Authorization: `Bearer ${this.props.JWT}` } // authorization
        })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then(({ result }) => {
                console.log({ result }); // { result } makes the result become a total object
                // get all areas' information
                let labels = [], data = []; // define the empty arrays
                for (let area of result) {
                    labels.push(area.LGA); // get the names of Councils
                    data.push(area.total); // get the 'total' of each Council
                }
                this.chart = new Chart('chart', {
                    type: "bar",
                    data: {
                        labels, // the name of each Council
                        datasets: [
                            {
                                label: '# Offences', // the chart label
                                backgroundColor: 'rgb(128, 128, 128)', // the color of the bar in the chart
                                data // the 'total' of each Council
                            }
                        ]
                    }
                });
                this.chart.update(); // update and re-show the new chart
            })
            .catch(function(error) {
                console.log("There has been a problem with your fetch operation: ",error.message);
            });
    }
    
    render() {
        return <canvas id="chart" width="400" height="150"/>;
    }
}

export default withRouter(Main);