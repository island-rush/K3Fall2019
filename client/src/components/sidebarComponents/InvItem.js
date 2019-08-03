import React, { Component } from "react";
import PropTypes from "prop-types";

class InvItem extends Component {
	render() {
		return <div>InvItem:{this.props.invItem.invItemId}</div>;
	}
}

InvItem.propTypes = {
	invItem: PropTypes.object.isRequired
};

export default InvItem;
