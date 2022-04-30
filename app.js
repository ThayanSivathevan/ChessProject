// Dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var port = process.env.PORT || 5000;
var app = express();
var server = http.Server(app);
var io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
var cors = require('cors');


app.set("port", port);

var playerNum = 0;
var players = {}
var games = {};
var gameNum = 0

app.use(cors());
app.get("/connectToGame/:name/:timestamp", function (request, response) {
    const { name, timestamp } = request.params
    let game = findGame(name)
    if (!game) {
        game = createGame(name, timestamp)
    }
    response.json({ game: game.game.id, player: game.player })
});



io.on("connection", function (socket) {
    socket.on("connectToGame", (gameId, playerNum, gameData,history) => {
        if(games[gameId]){
            games[gameId].players.forEach((element, index) => {
                if (element.playerID == playerNum) {
                    players[socket.id] = gameId;
                    games[gameId].connected[index] = true;
                    games[gameId].history.push(`${element.name} has connected`)
                }
            });
            let game, { connected, game: g } = games[gameId];
            if (!g) games[gameId].game = gameData;
            if (connected[0] && connected[1]) games[gameId].gameStart = true
            updateGame(games[gameId]);
        }
    })
    socket.on("updateGame", (gameId, playerNum, game,history) => {
        if(games[gameId]){
            games[gameId].game=game
            console.log(history,games[gameId].history)
            games[gameId].history=history
            updateGame(games[gameId]);
        }
    })
    socket.on("disconnect", () => {

    });
});



server.listen(port, function () {
    console.log("Starting server on port 5000");
});



function updateGame(game,history) {
    io.sockets.emit("updateGame", game,history);
}





function findGame(name) {
    for (let i of Object.keys(games)) {
        let game = games[i]
        if (game.players.length === 1) {
            game.players.push({ name, "playerID": playerNum})
            game.turns[playerNum]=1
            playerNum++;
            game.history.push(`${name} found match`)
            games[i] = game
            return { game, player: playerNum - 1 }
        }
    }

}


function createGame(name, timestamp) {
    let id = `${name}_${timestamp}_${gameNum}`
    games[id] = {
        id,
        players: [{ name, "playerID": playerNum}],
        color: [0, 1],
        messages: [],
        history: [],
        gameStopped: false,
        gameStart: false,
        connected: [false, false],
        turns:{},
        history:[`${name} created match`]
    }
    games[id].turns[playerNum]=0
    playerNum++;
    return { game: games[id], player: playerNum - 1 }
}

