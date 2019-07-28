import React, { Component } from "react";
import { connect } from "react-redux";
import { clientSendingDataAction } from "./redux/actions/clientSendingDataAction";

import "./App.css";

import Sidebar from "./components/Sidebar";
import Bottombar from "./components/Bottombar";

class App extends Component {
	userClicked() {
		this.props.clientSendData("clientData");
	}

	appStyle = {
		backgroundColor: "black",
		width: "100vw",
		height: "100vh"
		// minHeight: "100vh"
	};

	render() {
		return (
			<div className="App" style={this.appStyle}>
				<Sidebar />
				<Bottombar />
			</div>
		);
	}
}

const mapStateToProps = ({ points, userFeedback }) => ({
	points: points,
	userFeedback: userFeedback
});

const mapActionsToProps = {
	clientSendData: clientSendingDataAction
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(App);
