import React, { Component } from "react";
import PropTypes from "prop-types";
import { TYPE_IMAGES } from "../../styleConstants";

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

//TODO: make this a styleConstant? (also used in BattlePiece.js)
const selected = [
	{ border: "2px solid red" }, //selected
	{ border: "2px solid black" } //not selected
];

class AircraftPiece extends Component {
	render() {
		const { aircraftPiece, aircraftPieceIndex, isSelected, aircraftClick } = this.props;
		const { pieceFuel } = aircraftPiece;

		return (
			<div style={aircraftPieceStyle}>
				<div
					style={{
						...boxStyle,
						...TYPE_IMAGES[aircraftPiece.pieceTypeId],
						...selected[isSelected ? 0 : 1]
					}}
					onClick={event => {
						event.preventDefault();
						aircraftClick();
						event.stopPropagation();
					}}
				>
					{aircraftPieceIndex}
				</div>
				Current Fuel=[{pieceFuel}] Adding=[] New Total=[]
			</div>
		);
	}
}

AircraftPiece.propTypes = {
	aircraftPiece: PropTypes.object.isRequired,
	aircraftPieceIndex: PropTypes.number.isRequired,
	isSelected: PropTypes.bool.isRequired,
	aircraftClick: PropTypes.func.isRequired
};

export default AircraftPiece;
