import React, { Component } from "react";

const leftcontrolsStyle = {
	background: "grey",
	height: "80%",
	width: "25%",
	position: "relative",
	float: "left",
	margin: ".5%"
};

const buttonStyle = {
	background: "white",
	height: "80%",
	width: "18%",
	float: "left",
	margin: "1%",
	marginTop: "2%",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

const buttonImages = {
	start: { backgroundImage: 'url("./images/buttonImages/iconPlanning.png")' },
	undo: { backgroundImage: 'url("./images/buttonImages/iconUndo.png")' },
	cancel: { backgroundImage: 'url("./images/buttonImages/iconCancel.png")' },
	confirm: { backgroundImage: 'url("./images/buttonImages/iconConfirm.png")' },
	container: {
		backgroundImage: 'url("./images/buttonImages/iconContainer.png")'
	}
};

const buttonTitles = {
	start: "Start Planning a Move for a Piece",
	undo: "Undo a Planned Move",
	cancel: "Cancel a Plan",
	confirm: "Confirm a Plan",
	container: "Open Container Controls Or Something Idk"
};

class Leftcontrols extends Component {
	render() {
		return (
			<div style={leftcontrolsStyle}>
				<div
					title={buttonTitles.start}
					style={{ ...buttonStyle, ...buttonImages.start }}
				/>
				<div
					title={buttonTitles.cancel}
					style={{ ...buttonStyle, ...buttonImages.cancel }}
				/>
				<div
					title={buttonTitles.undo}
					style={{ ...buttonStyle, ...buttonImages.undo }}
				/>
				<div
					title={buttonTitles.container}
					style={{ ...buttonStyle, ...buttonImages.container }}
				/>
				<div
					title={buttonTitles.confirm}
					style={{ ...buttonStyle, ...buttonImages.confirm }}
				/>
			</div>
		);
	}
}

export default Leftcontrols;
