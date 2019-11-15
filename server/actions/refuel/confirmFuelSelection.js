const { Game, Event } = require("../../classes");
import { REFUEL_RESULTS } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../client/src/constants/otherConstants";
import { GAME_INACTIVE_TAG } from "../../pages/errorTypes";
import { TYPE_FUEL } from "../../../client/src/constants/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");
const giveNextEvent = require("../giveNextEvent");

const confirmFuelSelection = async (socket, payload) => {
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;

    const thisGame = await new Game({ gameId }).init();
    const { gameActive, gamePhase, game0Status, game1Status } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    const thisRefuelEvent = await Event.getNext(gameId, gameTeam); //TODO: this could be an unecessary call (if we move the refuel functionality out of the event class)

    //handle the payload and stuff, send the response (with next event?) (or 2 responses...)
    const { aircraft, tankers } = payload;

    //TODO: go through fuelSelections and make sure it makes sense from backend (security)
    //ex: these pieces exist, these fuel amounts aren't beyond tanker fuel (can't drain tanker, or add fuel from nothing)
    //basically make sure no cheating...
    //but right now we'll assume its all good (to get it working...)
    //need to check each of the pieces? (we own them...they have the fuel we think they are giving...stuff like that)

    //fuelSelection (predicted)
    // let fuelSelections = [
    //     {
    //         pieceId: 1,
    //		   piecePositionId: 10, //need this to help with frontend update, should always know this...
    //         newFuel: 10
    //     },
    //     {
    //         pieceId: 2,
    //		   piecePositionId: 10,
    //         newFuel: 5
    //     }
    // ];

    //TODO: ideally would re-grab all the values from the database (like to check types and things...and pieceFuel)

    let fuelSelections = [];
    for (let x = 0; x < aircraft.length; x++) {
        //add a thing to fuelSelections (pieceInfo, as well as newFuel?)
        let thisAircraft = aircraft[x];
        let { pieceId, piecePositionId, pieceTypeId, tankerPieceId } = thisAircraft;
        if (tankerPieceId != null) {
            let newFuel = TYPE_FUEL[pieceTypeId];
            fuelSelections.push({
                pieceId,
                piecePositionId,
                newFuel
            });
        }
    }
    for (let y = 0; y < tankers.length; y++) {
        let thisTanker = tankers[y];
        let { pieceId, piecePositionId, pieceFuel, removedFuel } = thisTanker;
        if (removedFuel != null && removedFuel != 0) {
            let newFuel = pieceFuel - removedFuel;
            fuelSelections.push({
                pieceId,
                piecePositionId,
                newFuel
            });
        }
    }

    if (fuelSelections.length != 0) {
        await thisRefuelEvent.bulkUpdatePieceFuels(fuelSelections, gameTeam);

        //now give those fuel updates to the client side (nothing too visible, pieces just update)
        //don't let client assume things went well, must get things back from server to confirm

        //TODO: better payloads?
        if (fuelSelections.length > 0) {
            const serverAction = {
                type: REFUEL_RESULTS,
                payload: {
                    fuelUpdates: fuelSelections //TODO: this should be the server's own record, not just sending back to client
                }
            };

            //sending results and no matter what, going to next event (refuel isn't multiple things, its 1 and done)
            socket.to("game" + gameId + "team" + gameTeam).emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
            socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
        }
    }

    //TODO: would be more efficient to put the REFUEL_RESULTS into the next event action, 1 request instead of 2 (make sure to remember to include new piece positions if do things here)

    await thisRefuelEvent.delete();
    await giveNextEvent(socket, { thisGame, gameTeam }); //not putting executingStep in options to let it know not to send pieceMove
};

module.exports = confirmFuelSelection;
