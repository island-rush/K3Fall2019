import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "./Container";
import { TYPE_IMAGES, TYPE_TEAM_BORDERS } from "../styleConstants";
import { TYPE_NAMES } from "../../gameData/gameConstants";

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
		const { piece, topLevel, selected, pieceClick } = this.props;

		const contents = piece.pieceContents.pieces.length === 0 ? null : <Container selected={selected} pieces={piece.pieceContents.pieces} pieceClick={pieceClick} />;

		const pieceCombinedStyle = {
			...pieceStyle,
			...(topLevel ? topLevelStyle : bottomLevelStyle),
			...zIndexLevels[selected ? 1 : 0],
			...TYPE_IMAGES[piece.pieceTypeId],
			...TYPE_TEAM_BORDERS[piece.pieceTeamId],
			...(selected ? selectedStyle : "")
		};

		const title = `${TYPE_NAMES[piece.pieceTypeId]}\nMoves: ${piece.pieceMoves}\nFuel: ${piece.pieceFuel}`;

		return (
			<div
				style={{ ...pieceCombinedStyle }}
				title={title}
				onClick={event => {
					event.preventDefault();
					pieceClick(piece);
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
