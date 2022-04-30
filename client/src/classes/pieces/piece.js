
const width = 8;
const height = 8;
export default class Piece {
	constructor(player,piece){
        this.player = player
        this.piece = piece
	}


    getPlayer(){
        return this.player
    }


    getPiece(){
        return this.piece
    }

}