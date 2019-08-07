import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages, typeTeamBorders, typeNames } from "../constants";
import Container from "./Container";

const pieceStyle = {
	backgroundColor: "grey",
	width: "15%",
	height: "24%",
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
		const contents =
			this.props.piece.pieceContents.pieces.length === 0 ? null : (
				<Container
					isOpen={false}
					pieces={this.props.piece.pieceContents.pieces}
				/>
			);

		return (
			<div
				style={this.style}
				title={this.title}
				onClick={() => {
					alert("clicked piece");
				}}
			>
				{contents}
				{/* <div style={containerStyle} /> */}
			</div>
		);
	}
}

Piece.propTypes = {
	piece: PropTypes.object.isRequired
};

export default Piece;
