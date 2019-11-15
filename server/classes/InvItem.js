const pool = require("../database");
import { TYPE_MOVES, TYPE_FUEL } from "../../client/src/gamedata/gameConstants";
const Piece = require("./Piece");

class InvItem {
    constructor(invItemId) {
        this.invItemId = invItemId;
    }

    async init() {
        const queryString = "SELECT * FROM invItems WHERE invItemId = ?";
        const inserts = [this.invItemId];
        const [results] = await pool.query(queryString, inserts);

        if (results.length != 1) {
            return null;
        } else {
            Object.assign(this, results[0]);
            return this;
        }
    }

    async delete() {
        const queryString = "DELETE FROM invItems WHERE invItemId = ?";
        const inserts = [this.invItemId];
        await pool.query(queryString, inserts);
    }

    //TODO: this looks weird, could convert to object parameter to explicitly say what is what (similar to game add)
    async placeOnBoard(selectedPosition) {
        const newPiece = await Piece.insert(
            this.invItemGameId,
            this.invItemTeamId,
            this.invItemTypeId,
            selectedPosition,
            -1,
            0,
            TYPE_MOVES[this.invItemTypeId],
            TYPE_FUEL[this.invItemTypeId]
        );

        await this.delete();

        return newPiece;
    }

    static async insertFromShop(gameId, gameTeam) {
        const queryString = "INSERT INTO invItems (invItemId, invItemGameId, invItemTeamId, invItemTypeId) SELECT * FROM shopItems WHERE shopItemGameId = ? AND shopItemTeamId = ?";
        const inserts = [gameId, gameTeam];
        await pool.query(queryString, inserts);
    }

    static async all(gameId, gameTeam) {
        const queryString = "SELECT * FROM invItems WHERE invItemGameId = ? AND invItemTeamId = ?";
        const inserts = [gameId, gameTeam];
        const [invItems] = await pool.query(queryString, inserts);
        return invItems;
    }
}

module.exports = InvItem;
