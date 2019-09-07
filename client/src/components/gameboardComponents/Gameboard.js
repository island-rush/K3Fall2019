import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectPosition } from "../../redux/actions/userActions";
import { HexGrid, Layout, Hexagon } from "react-hexgrid";
import { typeHighLow } from "../constants";
import Patterns from "./Patterns";
import BattlePopup from "./BattlePopup";
import NewsPopup from "./NewsPopup";
import ContainerPopup from "./ContainerPopup";
import RefuelPopup from "./RefuelPopup";

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
			if (thisPiece.pieceTeamId === 1 && highPieces.includes(thisPiece.pieceTypeId)) {
				redHigh = 1;
			}
			if (thisPiece.pieceTeamId === 1 && lowPieces.includes(thisPiece.pieceTypeId)) {
				redLow = 1;
			}
			if (thisPiece.pieceTeamId === 0 && highPieces.includes(thisPiece.pieceTypeId)) {
				blueHigh = 1;
			}
			if (thisPiece.pieceTeamId === 0 && lowPieces.includes(thisPiece.pieceTypeId)) {
				blueLow = 1;
			}
		}
	}
	return type + redHigh + redLow + blueHigh + blueLow;
};

class Gameboard extends Component {
	render() {
		let planningPositions = []; //all of the positions part of a plan
		let containerPositions = []; //specific positions part of a plan of type container

		for (let x = 0; x < this.props.planning.moves.length; x++) {
			const { type, positionId } = this.props.planning.moves[x];

			if (!planningPositions.includes(parseInt(positionId))) {
				planningPositions.push(parseInt(positionId));
			}

			if (type === "container" && !containerPositions.includes(parseInt(positionId))) {
				containerPositions.push(parseInt(positionId));
			}
		}

		if (this.props.selectedPiece !== -1) {
			if (this.props.selectedPiece in this.props.confirmedPlans) {
				for (let z = 0; z < this.props.confirmedPlans[this.props.selectedPiece].length; z++) {
					const { type, positionId } = this.props.confirmedPlans[this.props.selectedPiece][z];
					if (type === "move") {
						planningPositions.push(parseInt(positionId));
					}
					if (type === "container") {
						containerPositions.push(parseInt(positionId));
					}
				}
			}
		}

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
					if (parseInt(positionIndex) === parseInt(this.props.selectedPosition)) {
						this.props.selectPosition(-1);
					} else {
						this.props.selectPosition(positionIndex);
					}
					event.stopPropagation();
				}}
				className={
					parseInt(this.props.selectedPosition) === parseInt(positionIndex)
						? "selectedPos"
						: containerPositions.includes(parseInt(positionIndex))
						? "containerPos"
						: planningPositions.includes(parseInt(positionIndex))
						? "plannedPos"
						: ""
				}
			/>
		));

		return (
			<div style={gameboardStyle}>
				<HexGrid width={"100%"} height={"100%"} viewBox="-50 -50 100 100">
					<Layout size={{ x: 3.15, y: 3.15 }} flat={true} spacing={1.03} origin={{ x: -98, y: -46 }}>
						{positions}
					</Layout>
					<Patterns />
				</HexGrid>
				<NewsPopup news={this.props.news} />
				<BattlePopup battle={this.props.battle} />
				<RefuelPopup refuel={this.props.refuel} />
				<ContainerPopup container={this.props.container} />
			</div>
		);
	}
}

Gameboard.propTypes = {
	gameboard: PropTypes.array.isRequired,
	selectedPosition: PropTypes.number.isRequired,
	selectPosition: PropTypes.func.isRequired,
	news: PropTypes.object.isRequired,
	battle: PropTypes.object.isRequired,
	container: PropTypes.object.isRequired,
	refuel: PropTypes.object.isRequired,
	planning: PropTypes.object.isRequired,
	selectedPiece: PropTypes.number.isRequired,
	confirmedPlans: PropTypes.object.isRequired
};

const mapStateToProps = ({ gameboard, gameboardMeta }) => ({
	gameboard,
	selectedPosition: gameboardMeta.selectedPosition,
	news: gameboardMeta.news,
	battle: gameboardMeta.battle,
	refuel: gameboardMeta.refuel,
	container: gameboardMeta.container,
	planning: gameboardMeta.planning,
	selectedPiece: gameboardMeta.selectedPiece,
	confirmedPlans: gameboardMeta.confirmedPlans
});

const mapActionsToProps = {
	selectPosition: selectPosition
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Gameboard);
