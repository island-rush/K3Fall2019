import React, { Component } from "react";
import PropTypes from "prop-types";

class InvItem extends Component {
	invItemStyle = {
		position: "relative",
		backgroundColor: "blue",
		width: "5%",
		paddingTop: "5%",
		margin: "1%",
		float: "left",
		backgroundSize: "100% 100%",
		backgroundRepeat: "no-repeat"
	};

	invItemTypeImages = [
		{ backgroundImage: 'url("./images/radar.png")' },
		{ backgroundImage: 'url("./images/stealthBomber.png")' },
		{ backgroundImage: 'url("./images/submarine.png")' },
		{ backgroundImage: 'url("./images/tank.png")' }
	];

	render() {
		return (
			<div
				style={{
					...this.invItemStyle,
					...this.invItemTypeImages[this.props.invItem.invItemTypeId]
				}}
			/>
		);
	}
}

InvItem.propTypes = {
	invItem: PropTypes.object.isRequired
};

export default InvItem;
