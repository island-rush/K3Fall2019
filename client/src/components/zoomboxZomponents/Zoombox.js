import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Piece from "./Piece";
import { selectPiece, clearPieceSelection } from "../../redux/actions";
import { ZOOMBOX_BACKGROUNDS } from "../styleConstants";

const zoomboxStyle = {
	position: "absolute",
	left: "0%",
	bottom: "0%",
	height: "29%",
	width: "24%",
	boxShadow: "0px 0px 0px 2px rgba(0, 0, 0, 1) inset"
};

const invisibleStyle = {
	display: "none"
};

class Zoombox extends Component {
	render() {
		const { selectedPos, selectedPiece, gameboard, selectPiece, clearPieceSelection } = this.props;

		const isVisible = selectedPos !== -1;

		const pieces = !isVisible
			? null
			: gameboard[selectedPos].pieces.map((piece, index) => (
					<Piece pieceClick={selectPiece} selected={selectedPiece !== null && selectedPiece.pieceId === piece.pieceId} topLevel={true} key={index} piece={piece} />
			  ));

		const style = isVisible ? { ...zoomboxStyle, ...ZOOMBOX_BACKGROUNDS[gameboard[selectedPos].type] } : invisibleStyle;

		const onClick = event => {
			event.preventDefault();
			clearPieceSelection();
			event.stopPropagation();
		};

		return (
			<div style={style} onClick={onClick}>
				{pieces}
			</div>
		);
	}
}

Zoombox.propTypes = {
	selectedPos: PropTypes.number.isRequired,
	selectedPiece: PropTypes.object,
	gameboard: PropTypes.array.isRequired,
	selectPiece: PropTypes.func.isRequired,
	clearPieceSelection: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameboard, gameboardMeta }) => ({
	selectedPos: gameboardMeta.selectedPosition,
	selectedPiece: gameboardMeta.selectedPiece,
	gameboard: gameboard
});

const mapActionsToProps = {
	selectPiece: selectPiece,
	clearPieceSelection: clearPieceSelection
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Zoombox);
