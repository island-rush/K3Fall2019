import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LeftControls from "./Leftcontrols";
import UserFeedback from "./Userfeedback";
import MainButton from "./MainButton";
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
		const { userFeedback, gameInfo, mainButtonClick } = this.props;

		return (
			<div
				style={bottombarStyle}
				onClick={event => {
					event.stopPropagation();
				}}
			>
				<LeftControls />
				<UserFeedback userFeedback={userFeedback} />
				<MainButton gameInfo={gameInfo} mainButtonClick={mainButtonClick} />
			</div>
		);
	}
}

Bottombar.propTypes = {
	userFeedback: PropTypes.string.isRequired,
	gameInfo: PropTypes.object.isRequired,
	mainButtonClick: PropTypes.func.isRequired
};

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
