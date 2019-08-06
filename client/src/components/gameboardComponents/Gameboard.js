import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectPosition } from "../../redux/actions/userActions";
import { HexGrid, Layout, Hexagon } from "react-hexgrid";
import { typeHighLow } from "../constants";
import Patterns from "./Patterns";

const gameboardStyle = {
	backgroundColor: "blue",
	width: "94%",
	height: "88%",
	top: "0%",
	right: "0%",
	position: "absolute"
};

const qIndexSolver = index => {
	if (index < 81) {
		//above zoombox
		if (index % 27 < 14) {
			//even or odd column
			return Math.floor(index / 27) * 2;
		} else {
			return Math.floor(index / 27) * 2 + 1;
		}
	} else {
		//beyond zoombox
		if ((index - 81) % 34 < 17) {
			return (Math.floor((index - 81) / 34) + 3) * 2;
		} else {
			return (Math.floor((index - 81) / 34) + 3) * 2 + 1;
		}
	}
};

const rIndexSolver = index => {
	if (index < 81) {
		if (index % 27 < 14) {
			return (index % 27) - Math.floor(index / 27);
		} else {
			return (index % 27) - Math.floor(index / 27) - 14;
		}
	} else {
		if ((index - 81) % 34 < 17) {
			return ((index - 81) % 34) - (Math.floor((index - 81) / 34) + 3);
		} else {
			return ((index - 81) % 34) - (Math.floor((index - 81) / 34) + 3) - 17;
		}
	}
};

const patternSolver = position => {
	const { type, pieces } = position;
	const { highPieces, lowPieces } = typeHighLow;
	let redHigh = 0,
		redLow = 0,
		blueHigh = 0,
		blueLow = 0;
	if (pieces) {
		for (let x = 0; x < pieces.length; x++) {
			let thisPiece = pieces[x];
			if (
				thisPiece.pieceTeamId === 0 &&
				highPieces.includes(thisPiece.pieceTypeId)
			) {
				redHigh = 1;
			}
			if (
				thisPiece.pieceTeamId === 0 &&
				lowPieces.includes(thisPiece.pieceTypeId)
			) {
				redLow = 1;
			}
			if (
				thisPiece.pieceTeamId === 1 &&
				highPieces.includes(thisPiece.pieceTypeId)
			) {
				blueHigh = 1;
			}
			if (
				thisPiece.pieceTeamId === 1 &&
				lowPieces.includes(thisPiece.pieceTypeId)
			) {
				blueLow = 1;
			}
		}
	}
	return type + redHigh + redLow + blueHigh + blueLow;
};

class Gameboard extends Component {
	render() {
		const positions = Object.keys(this.props.gameboard).map(positionIndex => (
			<Hexagon
				key={positionIndex}
				posId={0}
				q={qIndexSolver(positionIndex)}
				r={rIndexSolver(positionIndex)}
				s={-999}
				fill={patternSolver(this.props.gameboard[positionIndex])}
				onClick={event => {
					event.preventDefault();
					if (
						parseInt(positionIndex) === parseInt(this.props.selectedPosition)
					) {
						this.props.selectPosition(-1);
					} else {
						this.props.selectPosition(positionIndex);
					}
					event.stopPropagation();
				}}
				className={
					this.props.selectedPosition === parseInt(positionIndex)
						? "selectedPos"
						: ""
				}
			/>
		));

		return (
			<div style={gameboardStyle}>
				<HexGrid width={"100%"} height={"100%"} viewBox="-50 -50 100 100">
					<Layout
						size={{ x: 3.15, y: 3.15 }}
						flat={true}
						spacing={1.03}
						origin={{ x: -98, y: -46 }}
					>
						{positions}
					</Layout>
					<Patterns />
				</HexGrid>
			</div>
		);
	}
}

Gameboard.propTypes = {
	gameboard: PropTypes.object.isRequired,
	selectedPosition: PropTypes.number.isRequired,
	selectPosition: PropTypes.func.isRequired
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
