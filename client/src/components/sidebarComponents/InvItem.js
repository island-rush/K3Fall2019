import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages } from "../constants";

const invItemStyle = {
	position: "relative",
	backgroundColor: "blue",
	width: "20%",
	paddingTop: "20%",
	margin: "1%",
	float: "left",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

class InvItem extends Component {
	render() {
		return (
			<div
				style={{
					...invItemStyle,
					...typeImages[this.props.invItem.invItemTypeId]
				}}
			/>
		);
	}
}

InvItem.propTypes = {
	invItem: PropTypes.object.isRequired
};

export default InvItem;
