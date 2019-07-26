import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import { clientSendingDataAction } from "./redux/actions/clientSendingDataAction";

class App extends Component {
	userClicked() {
		this.props.clientSendData("clientData");
	}

	render() {
		return (
			<div className="App">
				<p>This is the App.</p>
				<p>Points: {this.props.points}</p>
				<p onClick={() => this.userClicked()}>
					UserFeedback: {this.props.userFeedback}
				</p>
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
