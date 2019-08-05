import React, { Component } from "react";
import { connect } from "react-redux";
import ShopMenu from "./ShopMenu";
import InvMenu from "./InvMenu";
import Gameinfo from "./Gameinfo";
import { menuSelect } from "../../redux/actions/userActions";
import PropTypes from "prop-types";

const sidebarStyle = {
	backgroundColor: "Red",
	position: "absolute",
	top: "0%",
	left: "0%",
	height: "30%",
	width: "5%"
};

const buttonStyle = {
	position: "absolute",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat",
	backgroundColor: "maroon",
	left: "15%",
	width: "70%",
	paddingTop: "70%"
};

const shopButtonStyle = {
	top: "5%"
};

const invButtonStyle = {
	top: "37.5%"
};

const infoButtonStyle = {
	backgroundImage: 'url("./images/graphics/infoIcon.png")',
	top: "70%"
};

const selectedButtonStyle = {
	backgroundColor: "white"
};

class Sidebar extends Component {
	render() {
		return (
			<div style={sidebarStyle}>
				<ShopMenu selected={this.props.selectedMenu === 1} />
				<InvMenu selected={this.props.selectedMenu === 2} />
				<Gameinfo
					gameInfo={this.props.gameInfo}
					selected={this.props.selectedMenu === 3}
				/>
				<div
					onClick={event => {
						event.preventDefault();
						this.props.menuSelect(1);
						event.stopPropagation();
					}}
					style={{
						...buttonStyle,
						...shopButtonStyle,
						...(this.props.selectedMenu === 1 ? selectedButtonStyle : "")
					}}
				/>
				<div
					onClick={event => {
						event.preventDefault();
						this.props.menuSelect(2);
						event.stopPropagation();
					}}
					style={{
						...buttonStyle,
						...invButtonStyle,
						...(this.props.selectedMenu === 2 ? selectedButtonStyle : "")
					}}
				/>
				<div
					onClick={event => {
						event.preventDefault();
						this.props.menuSelect(3);
						event.stopPropagation();
					}}
					style={{
						...buttonStyle,
						...infoButtonStyle,
						...(this.props.selectedMenu === 3 ? selectedButtonStyle : "")
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
