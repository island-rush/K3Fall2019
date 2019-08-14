import React, { Component } from "react";
import LeftControls from "./Leftcontrols";
import UserFeedback from "./Userfeedback";
import MainControl from "./Maincontrol";
import { connect } from "react-redux";
import { startPlanning } from "../../redux/actions/userActions";

const bottombarStyle = {
	backgroundColor: "Green",
	position: "absolute",
	height: "10%",
	width: "73%",
	bottom: "0%",
	right: "0%"
};

class Bottombar extends Component {
	render() {
		return (
			<div
				style={bottombarStyle}
				onClick={event => {
					event.stopPropagation();
				}}
			>
				<LeftControls startPlanning={this.props.startPlanning} />
				<UserFeedback userFeedback={this.props.userFeedback} />
				<MainControl />
			</div>
		);
	}
}

const mapStateToProps = ({ userFeedback }) => ({
	userFeedback: userFeedback
});

const mapActionsToProps = {
	startPlanning
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Bottombar);
