import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages, typeTeamBorders } from "../constants";
import { TYPE_NAMES } from "../../gameData/gameConstants";
import Container from "./Container";

const pieceStyle = {
	backgroundColor: "grey",
	margin: "1%",
	float: "left",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat",
	position: "relative"
};

const topLevelStyle = {
	width: "15%",
	height: "24%"
};

const bottomLevelStyle = {
	width: "48%",
	height: "48%"
};

const selectedStyle = {
	boxShadow: "0px 0px 0px 2px rgba(255, 255, 255, 0.8) inset"
};

const zIndexLevels = [{ zIndex: 5 }, { zIndex: 10 }];

class Piece extends Component {
	render() {
		const contents =
			this.props.piece.pieceContents.pieces.length === 0 ? null : (
				<Container selected={this.props.selected} pieces={this.props.piece.pieceContents.pieces} pieceClick={this.props.pieceClick} />
			);

		const pieceCombinedStyle = {
			...pieceStyle,
			...(this.props.topLevel ? topLevelStyle : bottomLevelStyle),
			...zIndexLevels[this.props.selected ? 1 : 0],
			...typeImages[this.props.piece.pieceTypeId],
			...typeTeamBorders[this.props.piece.pieceTeamId],
			...(this.props.selected ? selectedStyle : "")
		};

		const title = `${TYPE_NAMES[this.props.piece.pieceTypeId]}\nMoves: ${this.props.piece.pieceMoves}\nFuel: ${this.props.piece.pieceFuel}`;

		return (
			<div
				style={{ ...pieceCombinedStyle }}
				title={title}
				onClick={event => {
					event.preventDefault();
					this.props.pieceClick(this.props.piece);
					event.stopPropagation();
				}}
			>
				{contents}
			</div>
		);
	}
}

Piece.propTypes = {
	piece: PropTypes.object.isRequired,
	topLevel: PropTypes.bool.isRequired,
	selected: PropTypes.bool.isRequired,
	pieceClick: PropTypes.func.isRequired
};

export default Piece;
