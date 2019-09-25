import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages, diceImages } from "../constants";

const battlePieceStyle = {
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

const selected = [
	{ border: "2px solid red" }, //selected
	{ border: "2px solid black" } //not selected
];

class BattlePiece extends Component {
	render() {
		const { isFriendly, battlePieceClick, targetPieceClick, enemyBattlePieceClick, battlePiece, battlePieceIndex, isSelected } = this.props;

		const battlePieceBox = (
			<div
				onClick={() => {
					isFriendly ? battlePieceClick(battlePiece) : enemyBattlePieceClick(battlePiece);
				}}
				style={{
					...boxStyle,
					...typeImages[battlePiece.piece.pieceTypeId],
					...selected[isSelected ? 0 : 1]
				}}
			>
				{battlePieceIndex}
			</div>
		);

		//TODO: need actual arrow images instead of piece images
		const arrowBox = battlePiece.targetPiece === null ? null : <div style={{ ...boxStyle, ...typeImages[19] }}>arrow -></div>;

		const targetBox =
			battlePiece.targetPiece === null ? null : (
				<div
					onClick={() => {
						targetPieceClick(battlePiece);
					}}
					style={{ ...boxStyle, ...typeImages[battlePiece.targetPiece.pieceTypeId] }}
				></div>
			);

		const diceBox = battlePiece.diceRolled === 0 ? null : <div style={{ ...boxStyle, ...diceImages[battlePiece.piece.pieceTypeId] }} />;

		return (
			<div style={battlePieceStyle}>
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
