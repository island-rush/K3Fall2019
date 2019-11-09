import React from "react";
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

const ShopItem = ({ refund, shopItem }) => {
	const style = {
		...shopItemStyle,
		...TYPE_IMAGES[shopItem.shopItemTypeId]
	};

	const onClick = event => {
		event.preventDefault();
		refund(shopItem);
		event.stopPropagation();
	};

	return <div style={style} onClick={onClick} />;
};

ShopItem.propTypes = {
	refund: PropTypes.func.isRequired,
	shopItem: PropTypes.object.isRequired
};

export default ShopItem;
