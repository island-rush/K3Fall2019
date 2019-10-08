import React, { Component } from "react";
import PropTypes from "prop-types";
import { TYPE_IMAGES } from "../styleConstants";

const shopItemStyle = {
	backgroundColor: "green",
	position: "relative",
	width: "23%",
	paddingTop: "23%",
	margin: "1%",
	float: "left",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

class ShopItem extends Component {
	render() {
		const { refund, shopItem } = this.props;

		return (
			<div
				style={{
					...shopItemStyle,
					...TYPE_IMAGES[shopItem.shopItemTypeId]
				}}
				onClick={event => {
					event.preventDefault();
					refund(shopItem);
					event.stopPropagation();
				}}
			/>
		);
	}
}

ShopItem.propTypes = {
	refund: PropTypes.func.isRequired,
	shopItem: PropTypes.object.isRequired
};

export default ShopItem;
