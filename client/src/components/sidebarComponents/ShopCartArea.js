import React, { Component } from "react";
import PropTypes from "prop-types";
import ShopItem from "./ShopItem";

class ShopCartArea extends Component {
	shopCartAreaStyle = {
		backgroundColor: "red",
		position: "absolute",
		width: "20%",
		height: "80%",
		right: "1%",
		top: "1%"
	};

	render() {
		const shopItemComponents = this.props.shopItems.map((shopItem, index) => (
			<ShopItem
				key={index}
				shopItem={shopItem}
				refund={shopItemId => this.props.refund(shopItemId)}
			/>
		));

		return <div style={this.shopCartAreaStyle}>{shopItemComponents}</div>;
	}
}

ShopCartArea.propTypes = {
	shopItems: PropTypes.array.isRequired,
	refund: PropTypes.func.isRequired
};

export default ShopCartArea;
