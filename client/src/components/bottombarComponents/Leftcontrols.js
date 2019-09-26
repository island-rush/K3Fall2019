import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { startPlan, cancelPlan, confirmPlan, undoMove, containerMove } from "../../redux/actions/userActions";

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

const buttonImages = {
	start: { backgroundImage: 'url("./images/buttonImages/iconPlanning.png")' },
	undo: { backgroundImage: 'url("./images/buttonImages/iconUndo.png")' },
	cancel: { backgroundImage: 'url("./images/buttonImages/iconCancel.png")' },
	confirm: { backgroundImage: 'url("./images/buttonImages/iconConfirm.png")' },
	container: {
		backgroundImage: 'url("./images/buttonImages/iconContainer.png")'
	}
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
		return (
			<div style={leftcontrolsStyle}>
				<div
					title={buttonTitles.start}
					style={{ ...buttonStyle, ...buttonImages.start }}
					onClick={event => {
						event.preventDefault();
						this.props.startPlan();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.cancel}
					style={{ ...buttonStyle, ...buttonImages.cancel }}
					onClick={event => {
						event.preventDefault();
						this.props.cancelPlan();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.undo}
					style={{ ...buttonStyle, ...buttonImages.undo }}
					onClick={event => {
						event.preventDefault();
						this.props.undoMove();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.container}
					style={{ ...buttonStyle, ...buttonImages.container }}
					onClick={event => {
						event.preventDefault();
						this.props.containerMove();
						event.stopPropagation();
					}}
				/>
				<div
					title={buttonTitles.confirm}
					style={{ ...buttonStyle, ...buttonImages.confirm }}
					onClick={event => {
						event.preventDefault();
						this.props.confirmPlan();
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
	planning: PropTypes.object.isRequired,
	confirmPlan: PropTypes.func.isRequired,
	undoMove: PropTypes.func.isRequired,
	containerMove: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameboardMeta }) => ({
	planning: gameboardMeta.planning
});

const mapActionsToProps = {
	startPlan,
	cancelPlan,
	confirmPlan,
	undoMove,
	containerMove
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Leftcontrols);
