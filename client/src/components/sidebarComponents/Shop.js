import React, { Component } from "react";

class Shop extends Component {
	shopStyle = {
		backgroundColor: "Yellow",
		height: "100%",
		width: "70%"
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
