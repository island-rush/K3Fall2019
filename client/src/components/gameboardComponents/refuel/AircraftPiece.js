import React, { Component } from "react";
import PropTypes from "prop-types";
import { TYPE_IMAGES } from "../../styleConstants";
import { TYPE_FUEL, TYPE_NAME_IDS } from "../../../gameData/gameConstants";

const aircraftPieceStyle = {
	backgroundColor: "white",
	height: "15%",
	width: "96%",
	margin: "1%",
	padding: "1%",
	borderRadius: "2%"
};

const boxStyle = {
	backgroundRepeat: "no-repeat",
	backgroundSize: "90% 90%",
	backgroundPosition: "center",
	border: "2px solid black",
	height: "92%",
	width: "23%",
	float: "left",
	margin: ".5%",
	position: "relative"
};

const textDivStyle = {
	position: "relative",
	float: "left"
};

class AircraftPiece extends Component {
	render() {
		const { aircraftPiece, aircraftPieceIndex, aircraftClick, undoFuelSelection } = this.props;
		const { pieceFuel, pieceTypeId } = aircraftPiece;

		const tankerDisplay =
			aircraftPiece.tankerPieceIndex == null ? null : (
				<div
					style={{ ...boxStyle, ...TYPE_IMAGES[TYPE_NAME_IDS["Tanker"]] }}
					onClick={event => {
						event.preventDefault();
						undoFuelSelection(aircraftPiece, aircraftPieceIndex);
						event.stopPropagation();
					}}
				>
					{aircraftPiece.tankerPieceIndex}
				</div>
			);

		const fuelToAdd = aircraftPiece.tankerPieceIndex == null ? 0 : TYPE_FUEL[aircraftPiece.pieceTypeId] - aircraftPiece.pieceFuel;

		return (
			<div style={aircraftPieceStyle}>
				<div
					style={{
						...boxStyle,
						...TYPE_IMAGES[aircraftPiece.pieceTypeId]
					}}
					onClick={event => {
						event.preventDefault();
						aircraftClick(aircraftPiece, aircraftPieceIndex);
						event.stopPropagation();
					}}
				>
					{aircraftPieceIndex}
				</div>
				<div style={textDivStyle}>
					<p>Current Fuel=[{pieceFuel}]</p>
					<p>Adding=[{fuelToAdd}] </p>
					<p>Max=[{TYPE_FUEL[pieceTypeId]}]</p>
				</div>
				{tankerDisplay}
			</div>
		);
	}
}

AircraftPiece.propTypes = {
	aircraftPiece: PropTypes.object.isRequired,
	aircraftPieceIndex: PropTypes.number.isRequired,
	aircraftClick: PropTypes.func.isRequired,
	undoFuelSelection: PropTypes.func.isRequired
};

export default AircraftPiece;
