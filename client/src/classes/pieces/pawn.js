import Piece from "./piece"
const width = 8;
const height = 8;
const players =[-1,1]
export default class Pawn extends Piece{
	constructor(player,moved=false){
        super(player,"pawn")
        this.moved =moved
	}

    getValidMoves(x,y,board){
        let validMoves = []
        let movement = this.getPlayer()==0?-1:1;
        if(!board[x][y+movement])validMoves.push({"x": x,"y":y+movement})
        if(x+1<width && board[x+1][y+movement])if(board[x+1][y+movement].getPlayer()!==this.getPlayer())validMoves.push({"x": x+1,"y":y+movement})
        if(x-1>=0 && board[x-1][y+movement] )if(board[x-1][y+movement].getPlayer()!==this.getPlayer())validMoves.push({"x": x-1,"y":y+movement})
        if(!this.moved && !board[x][y+2*movement] && !board[x][y+movement]) validMoves.push({"x": x,"y":y+2*movement})
        return validMoves
    }
}