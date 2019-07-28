import React, { Component } from "react";
import { connect } from "react-redux";

class Gameboard extends Component {
	render() {
		return <div>Gameboard</div>;
	}
}

const mapStateToProps = ({ selectedPosition }) => ({
	selectedPosition: selectedPosition
});

export default connect(mapStateToProps)(Gameboard);
