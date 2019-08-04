import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectPosition } from "../../redux/actions/userActions";
import { HexGrid, Layout, Hexagon, Pattern } from "react-hexgrid";

const gameboardStyle = {
	backgroundColor: "blue",
	width: "86%",
	height: "88%",
	top: "0%",
	right: "0%",
	position: "absolute"
};

const imageSize = { x: 3.4, y: 2.75 };
const hexagonSize = { x: 3.15, y: 3.15 };

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
	const highPieces = [0, 1, 2, 3, 4, 5, 10, 17, 18, 22];
	const lowPieces = [6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 19, 20, 21];
	let redHigh = 0;
	let redLow = 0;
	let blueHigh = 0;
	let blueLow = 0;
	if (pieces) {
		for (let x = 0; x < pieces.length; x++) {
			let thisPiece = pieces[x];
			if (
				thisPiece.pieceTeamId === 0 &&
				highPieces.includes(thisPiece.pieceUnitId)
			) {
				redHigh = 1;
			}
			if (
				thisPiece.pieceTeamId === 0 &&
				lowPieces.includes(thisPiece.pieceUnitId)
			) {
				redLow = 1;
			}
			if (
				thisPiece.pieceTeamId === 1 &&
				highPieces.includes(thisPiece.pieceUnitId)
			) {
				blueHigh = 1;
			}
			if (
				thisPiece.pieceTeamId === 1 &&
				lowPieces.includes(thisPiece.pieceUnitId)
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
					this.props.selectPosition(positionIndex);
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
						size={hexagonSize}
						flat={true}
						spacing={1.02}
						origin={{ x: -103, y: -46 }}
					>
						{positions}
					</Layout>
					<Pattern
						id="land0000"
						link="./images/positionImages/land0000.png"
						size={imageSize}
					/>
					<Pattern
						id="land0001"
						link="./images/positionImages/land0001.png"
						size={imageSize}
					/>
					<Pattern
						id="land0010"
						link="./images/positionImages/land0010.png"
						size={imageSize}
					/>
					<Pattern
						id="land0011"
						link="./images/positionImages/land0011.png"
						size={imageSize}
					/>
					<Pattern
						id="land0100"
						link="./images/positionImages/land0100.png"
						size={imageSize}
					/>
					<Pattern
						id="land0101"
						link="./images/positionImages/land0101.png"
						size={imageSize}
					/>
					<Pattern
						id="land0110"
						link="./images/positionImages/land0110.png"
						size={imageSize}
					/>
					<Pattern
						id="land0111"
						link="./images/positionImages/land0111.png"
						size={imageSize}
					/>
					<Pattern
						id="land1000"
						link="./images/positionImages/land1000.png"
						size={imageSize}
					/>
					<Pattern
						id="land1001"
						link="./images/positionImages/land1001.png"
						size={imageSize}
					/>
					<Pattern
						id="land1010"
						link="./images/positionImages/land1010.png"
						size={imageSize}
					/>
					<Pattern
						id="land1011"
						link="./images/positionImages/land1011.png"
						size={imageSize}
					/>
					<Pattern
						id="land1100"
						link="./images/positionImages/land1100.png"
						size={imageSize}
					/>
					<Pattern
						id="land1101"
						link="./images/positionImages/land1101.png"
						size={imageSize}
					/>
					<Pattern
						id="land1110"
						link="./images/positionImages/land1110.png"
						size={imageSize}
					/>
					<Pattern
						id="land1111"
						link="./images/positionImages/land1111.png"
						size={imageSize}
					/>
					<Pattern
						id="water0000"
						link="./images/positionImages/water0000.png"
						size={imageSize}
					/>
					<Pattern
						id="water0001"
						link="./images/positionImages/water0001.png"
						size={imageSize}
					/>
					<Pattern
						id="water0010"
						link="./images/positionImages/water0010.png"
						size={imageSize}
					/>
					<Pattern
						id="water0011"
						link="./images/positionImages/water0011.png"
						size={imageSize}
					/>
					<Pattern
						id="water0100"
						link="./images/positionImages/water0100.png"
						size={imageSize}
					/>
					<Pattern
						id="water0101"
						link="./images/positionImages/water0101.png"
						size={imageSize}
					/>
					<Pattern
						id="water0110"
						link="./images/positionImages/water0110.png"
						size={imageSize}
					/>
					<Pattern
						id="water0111"
						link="./images/positionImages/water0111.png"
						size={imageSize}
					/>
					<Pattern
						id="water1000"
						link="./images/positionImages/water1000.png"
						size={imageSize}
					/>
					<Pattern
						id="water1001"
						link="./images/positionImages/water1001.png"
						size={imageSize}
					/>
					<Pattern
						id="water1010"
						link="./images/positionImages/water1010.png"
						size={imageSize}
					/>
					<Pattern
						id="water1011"
						link="./images/positionImages/water1011.png"
						size={imageSize}
					/>
					<Pattern
						id="water1100"
						link="./images/positionImages/water1100.png"
						size={imageSize}
					/>
					<Pattern
						id="water1101"
						link="./images/positionImages/water1101.png"
						size={imageSize}
					/>
					<Pattern
						id="water1110"
						link="./images/positionImages/water1110.png"
						size={imageSize}
					/>
					<Pattern
						id="water1111"
						link="./images/positionImages/water1111.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0000"
						link="./images/positionImages/flag0000.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0001"
						link="./images/positionImages/flag0001.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0010"
						link="./images/positionImages/flag0010.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0011"
						link="./images/positionImages/flag0011.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0100"
						link="./images/positionImages/flag0100.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0101"
						link="./images/positionImages/flag0101.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0110"
						link="./images/positionImages/flag0110.png"
						size={imageSize}
					/>
					<Pattern
						id="flag0111"
						link="./images/positionImages/flag0111.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1000"
						link="./images/positionImages/flag1000.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1001"
						link="./images/positionImages/flag1001.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1010"
						link="./images/positionImages/flag1010.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1011"
						link="./images/positionImages/flag1011.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1100"
						link="./images/positionImages/flag1100.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1101"
						link="./images/positionImages/flag1101.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1110"
						link="./images/positionImages/flag1110.png"
						size={imageSize}
					/>
					<Pattern
						id="flag1111"
						link="./images/positionImages/flag1111.png"
						size={imageSize}
					/>
					<Pattern
						id="red0000"
						link="./images/positionImages/red0000.png"
						size={imageSize}
					/>
					<Pattern
						id="red0001"
						link="./images/positionImages/red0001.png"
						size={imageSize}
					/>
					<Pattern
						id="red0010"
						link="./images/positionImages/red0010.png"
						size={imageSize}
					/>
					<Pattern
						id="red0011"
						link="./images/positionImages/red0011.png"
						size={imageSize}
					/>
					<Pattern
						id="red0100"
						link="./images/positionImages/red0100.png"
						size={imageSize}
					/>
					<Pattern
						id="red0101"
						link="./images/positionImages/red0101.png"
						size={imageSize}
					/>
					<Pattern
						id="red0110"
						link="./images/positionImages/red0110.png"
						size={imageSize}
					/>
					<Pattern
						id="red0111"
						link="./images/positionImages/red0111.png"
						size={imageSize}
					/>
					<Pattern
						id="red1000"
						link="./images/positionImages/red1000.png"
						size={imageSize}
					/>
					<Pattern
						id="red1001"
						link="./images/positionImages/red1001.png"
						size={imageSize}
					/>
					<Pattern
						id="red1010"
						link="./images/positionImages/red1010.png"
						size={imageSize}
					/>
					<Pattern
						id="red1011"
						link="./images/positionImages/red1011.png"
						size={imageSize}
					/>
					<Pattern
						id="red1100"
						link="./images/positionImages/red1100.png"
						size={imageSize}
					/>
					<Pattern
						id="red1101"
						link="./images/positionImages/red1101.png"
						size={imageSize}
					/>
					<Pattern
						id="red1110"
						link="./images/positionImages/red1110.png"
						size={imageSize}
					/>
					<Pattern
						id="red1111"
						link="./images/positionImages/red1111.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0000"
						link="./images/positionImages/blue0000.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0001"
						link="./images/positionImages/blue0001.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0010"
						link="./images/positionImages/blue0010.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0011"
						link="./images/positionImages/blue0011.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0100"
						link="./images/positionImages/blue0100.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0101"
						link="./images/positionImages/blue0101.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0110"
						link="./images/positionImages/blue0110.png"
						size={imageSize}
					/>
					<Pattern
						id="blue0111"
						link="./images/positionImages/blue0111.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1000"
						link="./images/positionImages/blue1000.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1001"
						link="./images/positionImages/blue1001.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1010"
						link="./images/positionImages/blue1010.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1011"
						link="./images/positionImages/blue1011.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1100"
						link="./images/positionImages/blue1100.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1101"
						link="./images/positionImages/blue1101.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1110"
						link="./images/positionImages/blue1110.png"
						size={imageSize}
					/>
					<Pattern
						id="blue1111"
						link="./images/positionImages/blue1111.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0000"
						link="./images/positionImages/airfield0000.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0001"
						link="./images/positionImages/airfield0001.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0010"
						link="./images/positionImages/airfield0010.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0011"
						link="./images/positionImages/airfield0011.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0100"
						link="./images/positionImages/airfield0100.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0101"
						link="./images/positionImages/airfield0101.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0110"
						link="./images/positionImages/airfield0110.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield0111"
						link="./images/positionImages/airfield0111.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1000"
						link="./images/positionImages/airfield1000.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1001"
						link="./images/positionImages/airfield1001.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1010"
						link="./images/positionImages/airfield1010.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1011"
						link="./images/positionImages/airfield1011.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1100"
						link="./images/positionImages/airfield1100.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1101"
						link="./images/positionImages/airfield1101.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1110"
						link="./images/positionImages/airfield1110.png"
						size={imageSize}
					/>
					<Pattern
						id="airfield1111"
						link="./images/positionImages/airfield1111.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0000"
						link="./images/positionImages/missile0000.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0001"
						link="./images/positionImages/missile0001.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0010"
						link="./images/positionImages/missile0010.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0011"
						link="./images/positionImages/missile0011.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0100"
						link="./images/positionImages/missile0100.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0101"
						link="./images/positionImages/missile0101.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0110"
						link="./images/positionImages/missile0110.png"
						size={imageSize}
					/>
					<Pattern
						id="missile0111"
						link="./images/positionImages/missile0111.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1000"
						link="./images/positionImages/missile1000.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1001"
						link="./images/positionImages/missile1001.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1010"
						link="./images/positionImages/missile1010.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1011"
						link="./images/positionImages/missile1011.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1100"
						link="./images/positionImages/missile1100.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1101"
						link="./images/positionImages/missile1101.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1110"
						link="./images/positionImages/missile1110.png"
						size={imageSize}
					/>
					<Pattern
						id="missile1111"
						link="./images/positionImages/missile1111.png"
						size={imageSize}
					/>
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
