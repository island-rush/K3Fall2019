import React, { Component } from "react";
import { connect } from "react-redux";

class Userfeedback extends Component {
	userfeedbackStyle = {
		background: "grey",
		height: "80%",
		width: "40%",
		position: "relative",
		float: "left",
		margin: ".5%"
	};

	render() {
		return <div style={this.userfeedbackStyle}>{this.props.userFeedback}</div>;
	}
}

const mapStateToProps = ({ userFeedback }) => ({
	userFeedback: userFeedback
});

export default connect(mapStateToProps)(Userfeedback);
