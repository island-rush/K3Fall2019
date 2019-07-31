import React, { Component } from "react";

class Shop extends Component {
	shopStyle = {
		backgroundColor: "Yellow",
		position: "absolute",
		height: "120%",
		width: "1800%",
		marginLeft: "150%",
		marginTop: "20%"
	};

	invisibleStyle = {
		display: "none"
	};

	render() {
		return (
			<div style={this.props.selected ? this.shopStyle : this.invisibleStyle}>
				Shop
			</div>
		);
	}
}

export default Shop;
