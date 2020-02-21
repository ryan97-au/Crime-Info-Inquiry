import React from "react";

// Table component for showing the results of search and offences
class Table extends React.Component {
    render() {
        return (
            // in the "table" div
            <div className="table">
            <table>
                <thead>
                    <tr>
                        {/* column titles */}
                        {this.props.columns.map(column => (<th key={column.key}>{column.title}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.map(row => (
                        <tr key={row.key}>
                            {/* rows of data */}
                            {this.props.columns.map(column => (<td key={column.key}>{row[column.dataIndex]}</td>))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        );
    }
}

export default Table;