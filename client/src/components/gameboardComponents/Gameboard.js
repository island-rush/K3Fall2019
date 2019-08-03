import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectPosition } from "../../redux/actions/userActions";

class Gameboard extends Component {
	render() {
		return <div>Gameboard</div>;
	}
}

Gameboard.propTypes = {
	gameboard: PropTypes.array.isRequired,
	selectedPosition: PropTypes.number.isRequired
};

const mapStateToProps = ({ gameboard, gameboardMeta }) => ({
	gameboard: gameboard,
	selectedPosition: gameboardMeta.selectedPosition
});

const mapActionsToProps = {
	selectPosition: selectPosition
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Gameboard);
