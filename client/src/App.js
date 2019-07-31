import React, { Component } from "react";
import { connect } from "react-redux";
import Sidebar from "./components/sidebarComponents/Sidebar";
import Bottombar from "./components/bottombarComponents/Bottombar";
import Gameboard from "./components/gameboardComponents/Gameboard";
import "./App.css";

class App extends Component {
	userClicked() {
		this.props.clientSendData("clientData");
	}

	appStyle = {
		position: "relative",
		backgroundColor: "black",
		height: "100%",
		width: "100%"
	};

	render() {
		return (
			<div className="App" style={this.appStyle}>
				<Sidebar />
				<Bottombar />
				<Gameboard />
			</div>
		);
	}
}

const mapStateToProps = ({ points, userFeedback }) => ({
	points: points,
	userFeedback: userFeedback
});

export default connect(mapStateToProps)(App);
