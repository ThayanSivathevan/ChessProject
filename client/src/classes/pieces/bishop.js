import Piece from "./piece"
const width = 8;
const height = 8;
export default class Rook extends Piece{
	constructor(player){
        super(player,"bishop")
        this.possibleMoves = [[1,1],[-1,-1],[1,-1],[-1,1]]
	}

    getValidMoves(x,y,board){
        let validMoves = []
        this.possibleMoves.forEach((item)=>{
            let xNew = x+item[0];
            let yNew = y+item[1];
            while(true){
                if(!(xNew >=0 && xNew < width && yNew>=0 && yNew<height))break;
                let cond = this.checkValidMove(board[xNew][yNew])
                if(cond===0)break
                validMoves.push({"x": xNew,"y":yNew})
                if(cond===2)break
                xNew+=item[0]
                yNew+=item[1]
            }
        })
        return validMoves
    }


    checkValidMove(piece){
        if(!piece)return 1
        else if(piece.getPlayer()!==this.getPlayer()){
            return 2
        }
        return 0
    }
}