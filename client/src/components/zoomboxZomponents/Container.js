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
		const pieces = this.props.pieces.map((piece, index) => (
			<Piece
				pieceClick={this.props.pieceClick}
				topLevel={false}
				key={index}
				piece={piece}
				isOpen={false} //pieces inside containers are never open
			/>
		));

		return (
			<div
				style={this.props.isOpen ? containerStyle : invisibleStyle}
				title={""}
			>
				{pieces}
			</div>
		);
	}
}

Container.propTypes = {
	pieces: PropTypes.array.isRequired,
	isOpen: PropTypes.bool.isRequired,
	pieceClick: PropTypes.func.isRequired
};

export default Container;
