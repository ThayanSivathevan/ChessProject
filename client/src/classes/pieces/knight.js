import Piece from "./piece"
const width = 8;
const height = 8;
export default class Knight extends Piece{
	constructor(player){
        super(player,"knight")
        this.possibleMoves = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
	}

    getValidMoves(x,y,board){
        return this.possibleMoves.filter((item,index)=>{
            let xNew = item[0]+x
            let yNew = item[1]+y
            if(!(xNew >=0 && xNew < width && yNew>=0 && yNew<height))return false
            if(!board[xNew][yNew])return true
            if(board[xNew][yNew].getPlayer()!==this.getPlayer())return true
            return false
        }).map((item) => {
            return {"x": item[0]+x,"y":item[1]+y}
        })
    }
}