const { Game, Piece, Plan } = require("../../classes");
const sendUserFeedback = require("../sendUserFeedback");
import { PLAN_WAS_CONFIRMED } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../client/src/gameData/otherConstants";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { CONTAINER_TYPES, COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_TERRAIN, TYPE_OWNERS } from "../../../client/src/gameData/gameConstants";
import { distanceMatrix } from "../../../client/src/gameData/distanceMatrix";
import { initialGameboardEmpty } from "../../../client/src/redux/reducers/initialGameboardEmpty";

const confirmPlan = async (socket, payload) => {
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;
    const { pieceId, plan } = payload;
    const thisGame = await new Game({ gameId }).init();

    const { gameActive, gamePhase, gameSlice } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //Must be in combat phase (2), slice 0 to make plans
    if (gamePhase != COMBAT_PHASE_ID && gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right phase/slice...looking for phase 2 slice 0");
        return;
    }

    //Does the piece exist?
    const thisPiece = await new Piece(pieceId).init();
    if (!thisPiece) {
        sendUserFeedback(socket, "Piece did not exists...refresh page?");
        return;
    }

    const { piecePositionId, pieceTypeId, pieceGameId, pieceTeamId, pieceMoves } = thisPiece;

    //Is this piece ours? (TODO: could also check pieceType with gameControllers)
    if (pieceGameId != gameId || pieceTeamId != gameTeam) {
        sendUserFeedback(socket, "Piece did not belong to your team...(or this game)");
        return;
    }

    //Could be multiple controller
    let atLeast1Owner = false;
    for (let gameController of gameControllers) {
        if (TYPE_OWNERS[gameController].includes(pieceTypeId)) {
            atLeast1Owner = true;
            break;
        }
    }

    if (!atLeast1Owner) {
        sendUserFeedback(socket, "Piece doesn't fall under your control");
        return;
    }

    const isContainer = CONTAINER_TYPES.includes(pieceTypeId);

    //Check adjacency and other parts of the plan to make sure the whole thing makes sense
    //TODO: could clean up this code a lot (once planning and containers fully done...)
    let previousPosition = piecePositionId;
    var trueMoveCount = 0;
    for (let x = 0; x < plan.length; x++) {
        //make sure adjacency between positions in the plan...
        //other checks...piece type and number of moves?

        const { type, positionId } = plan[x];

        let positionTerrain = initialGameboardEmpty[positionId].type;
        if (!TYPE_TERRAIN[pieceTypeId].includes(positionTerrain)) {
            sendUserFeedback(socket, "can't go on that terrain with this piece type");
            return;
        }

        //make sure positions are equal for container type
        //TODO: constants for this, if done this way
        if (type == "container") {
            if (!isContainer) {
                sendUserFeedback(socket, "sent a bad plan, container move for non-container piece...");
                return;
            }

            if (previousPosition != positionId) {
                sendUserFeedback(socket, "sent a bad plan, container move was not in previous position...");
                return;
            }
        } else if (type == "move") {
            trueMoveCount++;
        }

        //This condition may have to change in the future if parts of the plan
        //don't actually move the piece
        if (distanceMatrix[previousPosition][positionId] !== 1) {
            if (type !== "container") {
                sendUserFeedback(socket, "sent a bad plan, positions were not adjacent...");
                return;
            }
        }

        previousPosition = positionId;
    }

    //Is the plan length less than or equal to the max moves of the piece?
    //TODO: should use the moves from the database for the piece instead of the type_moves, because could be getting a boost
    if (trueMoveCount > pieceMoves) {
        sendUserFeedback(socket, "sent a bad plan, piece was moved more than its range...");
        return;
    }

    //prepare the bulk insert
    let plansToInsert = [];
    for (let movementOrder = 0; movementOrder < plan.length; movementOrder++) {
        let { positionId, type } = plan[movementOrder];
        let specialFlag = type == "move" ? 0 : 1; // 1 = container, use other numbers for future special flags...
        plansToInsert.push([pieceGameId, pieceTeamId, pieceId, movementOrder, positionId, specialFlag]);
    }

    //bulk insert (always insert bulk, don't really ever insert single stuff, since a 'plan' is a collection of moves, but the table is 'Plans')
    //TODO: could change the phrasing on Plan vs Moves (as far as inserting..function names...database entries??)
    await Plan.insert(plansToInsert);

    const serverAction = {
        type: PLAN_WAS_CONFIRMED,
        payload: {
            pieceId,
            plan
        }
    };
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

module.exports = confirmPlan;
