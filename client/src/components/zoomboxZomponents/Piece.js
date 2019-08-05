import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages, typeTeamBorders, typeNames } from "../constants";

const pieceStyle = {
	backgroundColor: "grey",
	width: "10%",
	paddingTop: "10%",
	margin: "1%",
	float: "left",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

class Piece extends Component {
	title = `${typeNames[this.props.piece.pieceTypeId]}\nMoves: ${
		this.props.piece.pieceMoves
	}\nFuel: ${this.props.piece.pieceFuel}`;

	style = {
		...pieceStyle,
		...typeImages[this.props.piece.pieceTypeId],
		...typeTeamBorders[this.props.piece.pieceTeamId]
	};

	render() {
		return <div style={this.style} title={this.title} />;
	}
}

Piece.propTypes = {
	piece: PropTypes.object.isRequired
};

export default Piece;
