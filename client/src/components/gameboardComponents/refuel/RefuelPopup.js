import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { confirmFuelSelections, aircraftClick, tankerClick } from "../../../redux/actions";
import AircraftPiece from "./AircraftPiece";
import TankerPiece from "./TankerPiece";

const refuelPopupStyle = {
	position: "absolute",
	display: "block",
	width: "80%",
	height: "80%",
	top: "10%",
	right: "10%",
	backgroundColor: "white",
	border: "2px solid black",
	zIndex: 4
};

const leftSectionStyle = {
	position: "relative",
	overflow: "scroll",
	float: "left",
	backgroundColor: "grey",
	height: "96%",
	width: "48%",
	margin: "1%"
};

const rightSectionStyle = {
	position: "relative",
	overflow: "scroll",
	backgroundColor: "grey",
	height: "96%",
	width: "48%",
	float: "right",
	margin: "1%"
};

const confirmButtonStyle = {
	position: "absolute",
	bottom: "-7%",
	right: "2%"
};

const invisibleStyle = {
	display: "none"
};

class RefuelPopup extends Component {
	render() {
		const { refuel, confirmFuelSelections, aircraftClick, tankerClick } = this.props;

		const { tankers, aircraft } = refuel;

		const tankerPieces = tankers.map((tankerPiece, index) => (
			<TankerPiece tankerClick={tankerClick} key={index} tankerPiece={tankerPiece} tankerPieceIndex={index} isSelected={false} />
		));
		const aircraftPieces = aircraft.map((aircraftPiece, index) => (
			<AircraftPiece aircraftClick={aircraftClick} key={index} aircraftPiece={aircraftPiece} aircraftPieceIndex={index} isSelected={false} />
		));

		return (
			<div style={refuel.active ? refuelPopupStyle : invisibleStyle}>
				<div style={leftSectionStyle}>Aircraft{aircraftPieces}</div>
				<div style={rightSectionStyle}>Tankers{tankerPieces}</div>
				<button
					onClick={event => {
						event.preventDefault();
						confirmFuelSelections();
						event.stopPropagation();
					}}
					style={confirmButtonStyle}
				>
					Confirm Fuel Selections
				</button>
			</div>
		);
	}
}

RefuelPopup.propTypes = {
	refuel: PropTypes.object.isRequired,
	confirmFuelSelections: PropTypes.func.isRequired,
	tankerClick: PropTypes.func.isRequired,
	aircraftClick: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameboardMeta }) => ({
	refuel: gameboardMeta.refuel
});

const mapActionsToProps = {
	confirmFuelSelections,
	tankerClick,
	aircraftClick
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(RefuelPopup);
