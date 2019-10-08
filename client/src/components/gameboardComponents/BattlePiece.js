import React, { Component } from "react";
import PropTypes from "prop-types";
import { TYPE_IMAGES, DICE_IMAGES } from "../styleConstants";

const battlePieceStyle = {
	backgroundColor: "white",
	height: "15%",
	width: "96%",
	margin: "1%",
	padding: "1%",
	borderRadius: "2%"
};

//TODO: could probably refactor how this is called to a cleaner way...
const battlePieceWonStyle = [
	{},
	{
		border: "2px solid red"
	}
];

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

const selected = [
	{ border: "2px solid red" }, //selected
	{ border: "2px solid black" } //not selected
];

class BattlePiece extends Component {
	render() {
		const { isFriendly, battlePieceClick, targetPieceClick, enemyBattlePieceClick, battlePiece, battlePieceIndex, isSelected } = this.props;

		const battlePieceBox = (
			<div
				onClick={event => {
					event.preventDefault();
					isFriendly ? battlePieceClick(battlePiece, battlePieceIndex) : enemyBattlePieceClick(battlePiece, battlePieceIndex);
					event.stopPropagation();
				}}
				style={{
					...boxStyle,
					...TYPE_IMAGES[battlePiece.piece.pieceTypeId],
					...selected[isSelected ? 0 : 1]
				}}
			>
				{battlePieceIndex}
			</div>
		);

		//TODO: need actual arrow images instead of piece images
		const arrowBox = battlePiece.targetPiece == null ? null : <div style={{ ...boxStyle }}>-----></div>;

		const targetBox =
			battlePiece.targetPiece == null ? null : (
				<div
					onClick={event => {
						event.preventDefault();
						targetPieceClick(battlePiece, battlePieceIndex);
						event.stopPropagation();
					}}
					style={{ ...boxStyle, ...TYPE_IMAGES[battlePiece.targetPiece.pieceTypeId] }}
				>
					{battlePiece.targetPieceIndex}
				</div>
			);

		const diceBox = battlePiece.diceRoll == null ? null : <div style={{ ...boxStyle, ...DICE_IMAGES[battlePiece.diceRoll] }}>{battlePiece.diceRoll}</div>;

		return (
			<div style={{ ...battlePieceStyle, ...battlePieceWonStyle[battlePiece.win != null && battlePiece.win ? 1 : 0] }}>
				{battlePieceBox}
				{arrowBox}
				{targetBox}
				{diceBox}
			</div>
		);
	}
}

BattlePiece.propTypes = {
	isFriendly: PropTypes.bool.isRequired,
	battlePiece: PropTypes.object.isRequired,
	battlePieceIndex: PropTypes.number.isRequired,
	isSelected: PropTypes.bool.isRequired,
	battlePieceClick: PropTypes.func.isRequired,
	enemyBattlePieceClick: PropTypes.func.isRequired,
	targetPieceClick: PropTypes.func.isRequired
};

export default BattlePiece;
