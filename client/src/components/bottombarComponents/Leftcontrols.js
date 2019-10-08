import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { confirmPlan, startPlan, cancelPlan, undoMove, containerMove } from "../../redux/actions";
import { LEFT_CONTROLS_IMAGES } from "../styleConstants";

const leftcontrolsStyle = {
	background: "grey",
	height: "80%",
	width: "25%",
	position: "relative",
	float: "left",
	margin: ".5%"
};

const buttonStyle = {
	background: "white",
	height: "80%",
	width: "18%",
	float: "left",
	margin: "1%",
	marginTop: "2%",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

const buttonTitles = {
	start: "Start Planning a Move for a Piece",
	undo: "Undo a Planned Move",
	cancel: "Cancel a Plan",
	confirm: "Confirm a Plan",
	container: "Open Container Controls Or Something Idk"
};

class Leftcontrols extends Component {
	render() {
		const { startPlan, cancelPlan, undoMove, containerMove, confirmPlan } = this.props;

		return (
			<div style={leftcontrolsStyle}>
				<div
					title={buttonTitles.start}
					style={{ ...buttonStyle, ...LEFT_CONTROLS_IMAGES.start }}
					onClick={event => {
						event.preventDefault();
						startPlan();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.cancel}
					style={{ ...buttonStyle, ...LEFT_CONTROLS_IMAGES.cancel }}
					onClick={event => {
						event.preventDefault();
						cancelPlan();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.undo}
					style={{ ...buttonStyle, ...LEFT_CONTROLS_IMAGES.undo }}
					onClick={event => {
						event.preventDefault();
						undoMove();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.container}
					style={{ ...buttonStyle, ...LEFT_CONTROLS_IMAGES.container }}
					onClick={event => {
						event.preventDefault();
						containerMove();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.confirm}
					style={{ ...buttonStyle, ...LEFT_CONTROLS_IMAGES.confirm }}
					onClick={event => {
						event.preventDefault();
						confirmPlan();
						event.stopPropagation();
					}}
				/>
			</div>
		);
	}
}

Leftcontrols.propTypes = {
	startPlan: PropTypes.func.isRequired,
	cancelPlan: PropTypes.func.isRequired,
	confirmPlan: PropTypes.func.isRequired,
	undoMove: PropTypes.func.isRequired,
	containerMove: PropTypes.func.isRequired
};

const mapActionsToProps = {
	startPlan,
	cancelPlan,
	confirmPlan,
	undoMove,
	containerMove
};

//Null for mapStateToProps since we aren't using any game state
export default connect(
	null,
	mapActionsToProps
)(Leftcontrols);
