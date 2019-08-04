import React, { Component } from "react";
import LeftControls from "./Leftcontrols";
import UserFeedback from "./Userfeedback";
import MainControl from "./Maincontrol";
import { connect } from "react-redux";

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
			<div style={bottombarStyle}>
				<LeftControls />
				<UserFeedback userFeedback={this.props.userFeedback} />
				<MainControl />
			</div>
		);
	}
}

const mapStateToProps = ({ userFeedback }) => ({
	userFeedback: userFeedback
});

export default connect(mapStateToProps)(Bottombar);
