import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { refuelPopupMinimizeToggle, confirmFuelSelections, aircraftClick, tankerClick, undoFuelSelection } from "../../../redux/actions";
import { REFUEL_POPUP_IMAGES } from "../../styleConstants";
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

const refuelPopupMinimizeStyle = {
	position: "absolute",
	display: "block",
	width: "7%",
	height: "12%",
	top: "0%",
	left: "-8%",
	backgroundColor: "white",
	border: "2px solid black",
	zIndex: 4,
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

const isMinimizedStyle = {
	border: "2px solid red",
	top: "45%",
	margin: "2%"
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
		const { refuel, confirmFuelSelections, aircraftClick, tankerClick, undoFuelSelection, refuelPopupMinimizeToggle } = this.props;

		const { tankers, aircraft, selectedTankerPieceId } = refuel;

		const tankerPieces = tankers.map((tankerPiece, index) => (
			<TankerPiece tankerClick={tankerClick} key={index} tankerPiece={tankerPiece} tankerPieceIndex={index} isSelected={selectedTankerPieceId === tankerPiece.pieceId} />
		));
		const aircraftPieces = aircraft.map((aircraftPiece, index) => (
			<AircraftPiece undoFuelSelection={undoFuelSelection} aircraftClick={aircraftClick} key={index} aircraftPiece={aircraftPiece} aircraftPieceIndex={index} />
		));

		return (
			<div style={refuel.active ? null : invisibleStyle}>
				<div style={!refuel.isMinimized ? refuelPopupStyle : invisibleStyle}>
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
					<div
						onClick={event => {
							event.preventDefault();
							refuelPopupMinimizeToggle();
							event.stopPropagation();
						}}
						style={{ ...refuelPopupMinimizeStyle, ...REFUEL_POPUP_IMAGES.minIcon }}
					/>
				</div>
				<div
					style={{ ...(refuel.isMinimized ? refuelPopupMinimizeStyle : invisibleStyle), ...REFUEL_POPUP_IMAGES.minIcon, ...isMinimizedStyle}}
					onClick={event => {
						event.preventDefault();
						refuelPopupMinimizeToggle();
						event.stopPropagation();
					}}
				/>
			</div>
		);
	}
}

RefuelPopup.propTypes = {
	refuel: PropTypes.object.isRequired,
	confirmFuelSelections: PropTypes.func.isRequired,
	tankerClick: PropTypes.func.isRequired,
	aircraftClick: PropTypes.func.isRequired,
	undoFuelSelection: PropTypes.func.isRequired,
	refuelPopupMinimizeToggle: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameboardMeta }) => ({
	refuel: gameboardMeta.refuel
});

const mapActionsToProps = {
	confirmFuelSelections,
	tankerClick,
	aircraftClick,
	undoFuelSelection,
	refuelPopupMinimizeToggle
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(RefuelPopup);
