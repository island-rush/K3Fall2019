import React, { Component } from "react";
import PropTypes from "prop-types";
import Piece from "./Piece";

const containerStyle = {
	backgroundColor: "white",
	width: "200%",
	height: "200%"
};

const invisibleStyle = {
	display: "none"
};

class Container extends Component {
	render() {
		const { pieces, selected, pieceClick } = this.props;

		const containedPieces = pieces.map((piece, index) => (
			<Piece
				pieceClick={pieceClick}
				topLevel={false}
				key={index}
				piece={piece}
				selected={false} //pieces inside containers are never open (TODO: change values to distinguish between selected and isOpen (selecting multiple pieces, other actions...))
			/>
		));

		return (
			<div style={selected ? containerStyle : invisibleStyle} title={""}>
				{containedPieces}
			</div>
		);
	}
}

Container.propTypes = {
	pieces: PropTypes.array.isRequired,
	selected: PropTypes.bool.isRequired,
	pieceClick: PropTypes.func.isRequired
};

export default Container;
