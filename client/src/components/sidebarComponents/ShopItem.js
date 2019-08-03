import React, { Component } from "react";
import PropTypes from "prop-types";

class ShopItem extends Component {
	shopItemStyle = {
		backgroundColor: "green",
		position: "relative",
		width: "23%",
		paddingTop: "23%",
		margin: "1%",
		float: "left",
		backgroundSize: "100% 100%",
		backgroundRepeat: "no-repeat"
	};

	shopItemTypeImages = [
		{ backgroundImage: 'url("./images/radar.png")' },
		{ backgroundImage: 'url("./images/stealthBomber.png")' },
		{ backgroundImage: 'url("./images/submarine.png")' },
		{ backgroundImage: 'url("./images/tank.png")' }
	];

	render() {
		return (
			<div
				style={{
					...this.shopItemStyle,
					...this.shopItemTypeImages[this.props.shopItem.shopItemTypeId]
				}}
				onClick={() => this.props.refund(this.props.shopItem)}
			/>
		);
	}
}

ShopItem.propTypes = {
	refund: PropTypes.func.isRequired,
	shopItem: PropTypes.object.isRequired
};

export default ShopItem;
