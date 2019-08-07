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
			<Piece key={index} piece={piece} />
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
	isOpen: PropTypes.bool.isRequired
};

export default Container;
