import React, { Component } from "react"
import { connect } from "react-redux"
import { initialiseTable } from './../../actions/actions';
import Table from "../Table/Table"

class App extends Component {
    render() {
        return(
            <div className="app">
                <div className="content">
                    <Table />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    initialiseTable
}

export default connect(
    null,
    mapDispatchToProps
)(App)