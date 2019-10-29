import React, { Component } from "react";
import PropTypes from "prop-types";
import ShopItem from "./ShopItem";

const shopCartAreaStyle = {
	backgroundColor: "red",
	position: "absolute",
	width: "20%",
	height: "80%",
	right: "5%",
	top: "10%"
};

class ShopCartArea extends Component {
	render() {
		const { shopItems, refund } = this.props;

		const shopItemComponents = shopItems.map((shopItem, index) => <ShopItem key={index} shopItem={shopItem} refund={shopItemId => refund(shopItemId)} />);

		return (
			<div style={shopCartAreaStyle}>
				<div> &nbsp;</div>
				<div style ={{fontSize:"20px"}}>Cart</div>
				{shopItemComponents}
			</div>
		);
	}
}

ShopCartArea.propTypes = {
	shopItems: PropTypes.array.isRequired,
	refund: PropTypes.func.isRequired
};

export default ShopCartArea;
