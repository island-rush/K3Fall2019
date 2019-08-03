import React, { Component } from "react";
import PropTypes from "prop-types";

class ShopItem extends Component {
	render() {
		return (
			<div onClick={() => this.props.refund(this.props.shopItem)}>
				ShopItem{this.props.shopItem.shopItemId}
			</div>
		);
	}
}

ShopItem.propTypes = {
	key: PropTypes.number,
	refund: PropTypes.func.isRequired,
	shopItem: PropTypes.object.isRequired
};

export default ShopItem;
