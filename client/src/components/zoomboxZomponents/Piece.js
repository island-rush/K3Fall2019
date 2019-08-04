import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages, typeTeamBorders } from "../constants";

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
	render() {
		return (
			<div
				style={{
					...pieceStyle,
					...typeImages[this.props.piece.pieceTypeId],
					...typeTeamBorders[this.props.piece.pieceTeamId]
				}}
			/>
		);
	}
}

Piece.propTypes = {
	piece: PropTypes.object.isRequired
};

export default Piece;
