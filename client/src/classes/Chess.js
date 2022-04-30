import Bishop from "./pieces/bishop"
import King from "./pieces/king"
import Knight from "./pieces/knight"
import Pawn from "./pieces/pawn"
import Queen from "./pieces/queen"
import Rook from "./pieces/rook"


const width = 8;
const height = 8;

const players = ["White", "Black"]
export default class Chess {
    constructor(data) {
        if (data) {
            const { board, turn, taken, kingPosition, check, won, gameStart, stalemate } = data
            this.board = [...board]
            this.turn = turn;
            this.taken = taken
            this.kingPosition = kingPosition
            this.check = check
            this.won = won
            this.gameStart = gameStart
            this.stalemate = stalemate
            this.recreateBoard()
            return
        }
        this.board = [[]]

        this.initGame()
    }

    initGame() {
        for (let i = 0; i < width; i++) {
            this.board[i] = []
            for (let j = 0; j < height; j++) {
                this.board[i][j] = null
            }
        }
        let player = 1;
        for (let i = 0; i < height; i += (height - 1)) {
            this.board[0][i] = new Rook(player);
            this.board[1][i] = new Knight(player);
            this.board[2][i] = new Bishop(player);
            this.board[3][i] = new Queen(player);
            this.board[4][i] = new King(player);
            this.board[5][i] = new Bishop(player);
            this.board[6][i] = new Knight(player);
            this.board[7][i] = new Rook(player);
            for (let j = 0; j < width; j++)this.board[j][i + (player === 0 ? -1 : 1)] = new Pawn(player);
            player -= 1;
        }

        this.turn = 0;
        this.taken = [[], []]
        this.kingPosition = [[4, 7], [4, 0]]
        this.check = [false, false]
        this.won = null
        this.gameStart = false
        this.stalemate = false

    }

    recreateBoard() {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                if (this.board[i][j]) {
                    if(this.board[i][j].piece==="rook")this.board[i][j] = new Rook(this.board[i][j].player);
                    else if(this.board[i][j].piece==="knight")this.board[i][j] = new Knight(this.board[i][j].player);
                    else if(this.board[i][j].piece==="bishop")this.board[i][j] = new Bishop(this.board[i][j].player);
                    else if(this.board[i][j].piece==="queen")this.board[i][j] = new Queen(this.board[i][j].player);
                    else if(this.board[i][j].piece==="king") this.board[i][j] = new King(this.board[i][j].player);
                    else this.board[i][j] = new Pawn(this.board[i][j].player,this.board[i][j].moved);
                }
            }
        }
    }
    getBoard() {
        return this.board;
    }

    getPos(x, y) {
        return this.board[x][y]
    }

    copyBoard() {
        return this.board.map(function (arr) {
            return arr.slice();
        });
    }
    getValidMoves(x, y) {
        let temp = {}
        let piece = this.getPos(x, y)

        if (piece && piece.getPlayer() === this.turn)
            piece.getValidMoves(x, y, this.board).forEach((item) => {
                let board = this.copyBoard()
                board[item.x][item.y] = piece
                board[x][y] = null
                let kingPos = [...this.kingPosition[this.turn]]
                if (piece.getPiece() === "king") kingPos = [item.x, item.y];
                let r = this.checkForCheck(this.turn, board, kingPos)
                console.log(r)
                if (!r) temp[`${item.x}_${item.y}`] = true
            })

        return temp
    }

    movePiece(x1, y1, x2, y2) {
        this.check[this.turn] = false

        let piece = this.getPos(x1, y1)
        let pieceTaken = this.getPos(x2, y2)

        if (pieceTaken) this.taken[this.turn].push(pieceTaken)
        if (!piece.moved) piece.moved = true
        if (piece.getPiece() === "king") this.kingPosition[this.turn] = [x2, y2]

        this.board[x2][y2] = piece
        this.board[x1][y1] = null

        if (piece.getPiece() === "pawn" && (y2 === 0 || y2 === height - 1)) { this.board[x2][y2] = new Queen(this.turn) }

        this.turn = this.turn === 1 ? 0 : 1;
        this.check[this.turn] = this.checkForCheck(this.turn)
        let possibleMove = this.checkForCheckmate()
        if (this.check[this.turn] && possibleMove) this.won = this.turn === 1 ? 0 : 1;
        else if (possibleMove) this.stalemate = true
    }


    checkForCheck(turn, board, kingPos) {
        let temp = board ? board : [...this.board];
        let possibleMoves = [[1, 1], [-1, -1], [1, -1], [-1, 1], [1, 0], [-1, 0], [0, 1], [0, -1]]
        let knightMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
        let [x, y] = kingPos ? kingPos : this.kingPosition[turn]
        for (let item of possibleMoves) {
            let xNew = x + item[0];
            let yNew = y + item[1];

            if ((xNew >= 0 && xNew < width && yNew >= 0 && yNew < height))
                if (temp[xNew][yNew])
                    if (temp[xNew][yNew].getPlayer() !== turn && temp[xNew][yNew].getPiece() === "king") return true

            while (true) {

                if (!(xNew >= 0 && xNew < width && yNew >= 0 && yNew < height)) break;
                let current = temp[xNew][yNew]
                if (current) {
                    if (current.getPlayer() === turn) break
                    else {
                        if (Math.abs(x - xNew) === Math.abs(y - yNew)) {
                            if (["queen", "bishop"].includes(current.getPiece())) return true;
                            else break;
                        }
                        if (xNew === x || yNew === y) {
                            if (["queen", "rook"].includes(current.getPiece())) return true;
                            else break;
                        }
                    }
                }
                xNew += item[0]
                yNew += item[1]
            }
        }

        for (let item of knightMoves) {
            let xNew = x + item[0];
            let yNew = y + item[1];
            if (!(xNew >= 0 && xNew < width && yNew >= 0 && yNew < height)) continue;

            if (!temp[xNew][yNew]) continue;
            if (temp[xNew][yNew].getPlayer() !== turn && temp[xNew][yNew].getPiece() === "knight") return true;
        }

        let movement = turn === 0 ? -1 : 1;
        if (x + 1 < width && temp[x + 1][y + movement]) if (temp[x + 1][y + movement].getPlayer() !== turn && temp[x + 1][y + movement].getPiece() === "pawn") return true;
        if (x - 1 >= 0 && temp[x - 1][y + movement]) if (temp[x - 1][y + movement].getPlayer() !== turn && temp[x - 1][y + movement].getPiece() === "pawn") return true;

        return false
    }


    checkForCheckmate() {
        let check = true
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (this.getPos(i, j) && this.getPos(i, j).getPlayer() === this.turn)
                    if (Object.keys(this.getValidMoves(i, j)).length !== 0) {
                        check = false;
                    }
            }
        }
        return check

    }
}