import React, { Component } from "react";
import LeftControls from "./Leftcontrols";
import UserFeedback from "./Userfeedback";
import MainButton from "./MainButton";
import { connect } from "react-redux";
import { mainButtonClick } from "../../redux/actions/userActions";

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
				<LeftControls />
				<UserFeedback userFeedback={this.props.userFeedback} />
				<MainButton
					gameInfo={this.props.gameInfo}
					mainButtonClick={this.props.mainButtonClick}
				/>
			</div>
		);
	}
}

const mapStateToProps = ({ userFeedback, gameInfo }) => ({
	userFeedback,
	gameInfo
});

const mapActionsToProps = {
	mainButtonClick
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Bottombar);
