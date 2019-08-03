import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Gameboard extends Component {
	render() {
		return <div>Gameboard</div>;
	}
}

Gameboard.propTypes = {
	selectedPosition: PropTypes.number.isRequired
};

const mapStateToProps = ({ selectedPosition }) => ({
	selectedPosition: selectedPosition
});

export default connect(mapStateToProps)(Gameboard);
