import React, { Component } from "react";
import { connect } from "react-redux";
import ShopMenu from "./ShopMenu";
import InvMenu from "./InvMenu";
import Gameinfo from "./Gameinfo";
import { menuSelect } from "../../redux/actions/userActions";
import PropTypes from "prop-types";

class Sidebar extends Component {
	sidebarStyle = {
		backgroundColor: "Red",
		position: "absolute",
		top: "0%",
		left: "0%",
		height: "30%",
		width: "5%"
	};

	buttonStyle = {
		position: "absolute",
		backgroundSize: "100% 100%",
		backgroundRepeat: "no-repeat",
		backgroundColor: "maroon",
		left: "15%",
		width: "70%",
		paddingTop: "70%"
	};

	shopButtonStyle = {
		top: "5%"
	};

	invButtonStyle = {
		top: "37.5%"
	};

	infoButtonStyle = {
		backgroundImage: 'url("./infoIcon.png")',
		top: "70%"
	};

	selectedButtonStyle = {
		backgroundColor: "white"
	};

	render() {
		return (
			<div style={this.sidebarStyle}>
				<ShopMenu selected={this.props.selectedMenu === 1} />
				<InvMenu selected={this.props.selectedMenu === 2} />
				<Gameinfo
					gameInfo={this.props.gameInfo}
					selected={this.props.selectedMenu === 3}
				/>
				<div
					onClick={() => this.props.menuSelect(1)}
					style={{
						...this.buttonStyle,
						...this.shopButtonStyle,
						...(this.props.selectedMenu === 1 ? this.selectedButtonStyle : "")
					}}
				/>
				<div
					onClick={() => this.props.menuSelect(2)}
					style={{
						...this.buttonStyle,
						...this.invButtonStyle,
						...(this.props.selectedMenu === 2 ? this.selectedButtonStyle : "")
					}}
				/>
				<div
					onClick={() => this.props.menuSelect(3)}
					style={{
						...this.buttonStyle,
						...this.infoButtonStyle,
						...(this.props.selectedMenu === 3 ? this.selectedButtonStyle : "")
					}}
				/>
			</div>
		);
	}
}

Sidebar.propTypes = {
	gameInfo: PropTypes.object.isRequired,
	selectedMenu: PropTypes.number.isRequired,
	menuSelect: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameInfo, selectedMenu }) => ({
	gameInfo: gameInfo,
	selectedMenu: selectedMenu
});

const mapActionsToProps = {
	menuSelect: menuSelect
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Sidebar);
