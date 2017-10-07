// Initialize Firebase
var config = {
    apiKey: "YOUR-INFO-HERE",
    authDomain: "YOUR-INFO-HERE",
    databaseURL: "YOUR-INFO-HERE",
    projectId: "YOUR-INFO-HERE",
    storageBucket: "YOUR-INFO-HERE",
    messagingSenderId: "YOUR-INFO-HERE"
};

firebase.initializeApp(config);
var database = firebase.database();

function returnPlayerObject(playerName) {

    var player = {
        name: playerName,
        wins: 0,
        losses: 0,
        choice: null,
    }

    return player
}

$("#start").on("click", function(event) {
    console.log("Start clicked");
    event.preventDefault();
    var playerName = $("#nameInput").val().trim();
    var playerId = null;
    $("#nameInput").val("");

    var refData = database.ref("players");

    refData.transaction(
        function(currentData) {
            console.log("Transaction called...");
            //add a player because database is empty
            if (currentData === null) {
                var player = {
                    "1": returnPlayerObject(playerName)
                }

                console.log(player);
                playerId = 1;
                return player
            }

            // figure out if we can add a player or not
            else {

                // booleans indicating whether a particular player exists in the db
                var playerOneExists = currentData.hasOwnProperty(1);
                var playerTwoExists = currentData.hasOwnProperty(2);

                if (playerOneExists && playerTwoExists) {
                    // if we return null instead of undefined, 
                    // it will delete the reference object entirely
                    return undefined
                } else if (!playerOneExists) {

                    currentData[1] = returnPlayerObject(playerName);

                    playerId = 1;
                    return currentData
                } else {
                    currentData[2] = returnPlayerObject(playerName);

                    playerId = 2
                    return currentData
                }

            }
        },
        function(error, success, snapshot) {
            if (success)
                setupDissconectForPlayer(playerId);
        },
        false)
})

database.ref("players/1/name").on("value", function(dataSnapshot) {

    var playersName = dataSnapshot.val()
    console.log(playersName)
    $("#WaitingPlayer1").html("<h5>" + playersName + "</h5>");
    $("#WaitingPlayer1").css("display", "initial")
    $("#waitingForPlayerOne").css("display", "none")
    if (dataSnapshot.val() === null) {
        $("#WaitingPlayer1").css("display", "none")
        $("#waitingForPlayerOne").css("display", "initial")
    }
})

database.ref("players/2/name").on("value", function(dataSnapshot) {

    var playersName = dataSnapshot.val()
    console.log(playersName)

    $("#WaitingPlayer2").html("<h5>" + playersName + "</h5>");
    $("#WaitingPlayer2").css("display", "initial");
    $("#waitingForPlayerTwo").css("display", "none");

    if (dataSnapshot.val() === null) {

        $("#WaitingPlayer2").css("display", "none")
        $("#waitingForPlayerTwo").css("display", "initial");


    }

})

database.ref("players/1/wins").on("value", function(snap) {

    var playerOneWins = snap.val()
    console.log(playerOneWins)
    $("#wins-player1").text(playerOneWins);
});

database.ref("players/1/losses").on("value", function(snap) {
    var playerOneLosses = snap.val()
    console.log(playerOneLosses)
    $("#losses-playerOne").text(playerOneLosses)
});

database.ref("players/2/wins").on("value", function(snap) {
    var playerTwoWins = snap.val()
    console.log(playerTwoWins)
    $("#wins-player2").text(playerTwoWins)
});

database.ref("players/2/losses").on("value", function(snap) {
    var playerTwoLosses = snap.val()
    console.log(playerTwoLosses)
    $("#losses-playerTwo").text(playerTwoLosses)
});
database.ref("players/1/choice").on("value", function(snap){
        var playerOneChoice = snap.val();
        console.log(playerOneChoice)
        database.ref("players/2/choice").once("value", function(snap2){
            var playerTwoChoice = snap2.val();
            console.log(playerTwoChoice);

            if ( playerOneChoice ===null && playerTwoChoice ===null){

            }

            else if( playerOneChoice === playerTwoChoice){
                $("#displayTie").text("It's a Tie")
            }
            else if( playerOneChoice === "rock" && playerTwoChoice === "paper"){
                $("#displayWinningChoice").text("Player Two Wins!")
            }
            else if (playerOneChoice === "rock" && playerTwoChoice === "scissors" ){
                 $("#displayWinningChoice").text("Player One Wins!")
            }
            else if(playerOneChoice === "paper" && playerTwoChoice === "rock"){
                 $("#displayWinningChoice").text("Player One Wins!")
            }
            else if(playerOneChoice === "paper" && playerTwoChoice === "scissors"){
                 $("#displayWinningChoice").text("Player Two Wins!")
            }
            else if (playerOneChoice === "scissors" && playerTwoChoice === "paper"){
                  $("#displayWinningChoice").text("Player One Wins!")

            }
            else if(playerOneChoice === "scissors" && playerTwoChoice === "rock"){
                $("#displayWinningChoice").text("Player Two Wins!")
            }
            else{

            }
        })


})
database.ref("players/2/choice").on("value", function(snap){
        var playerTwoChoice = snap.val();
        console.log(playerTwoChoice)
            
        database.ref("players/1/choice").once("value", function(snap2){
            var playerOneChoice = snap2.val();
            console.log(playerOneChoice);
            
            if ( playerOneChoice ===null && playerTwoChoice ===null){

            }

            else if( playerOneChoice === playerTwoChoice){
                $("#displayTie").text("It's a Tie")
            }
            else if( playerOneChoice === "rock" && playerTwoChoice === "paper"){
                $("#displayWinningChoice").text("Player Two Wins!")
            }
            else if (playerOneChoice === "rock" && playerTwoChoice === "scissors" ){
                 $("#displayWinningChoice").text("Player One Wins!")
            }
            else if(playerOneChoice === "paper" && playerTwoChoice === "rock"){
                 $("#displayWinningChoice").text("Player One Wins!")
            }
            else if(playerOneChoice === "paper" && playerTwoChoice === "scissors"){
                 $("#displayWinningChoice").text("Player Two Wins!")
            }
            else if (playerOneChoice === "scissors" && playerTwoChoice === "paper"){
                  $("#displayWinningChoice").text("Player One Wins!")

            }
            else if(playerOneChoice === "scissors" && playerTwoChoice === "rock"){
                $("#displayWinningChoice").text("Player Two Wins!")
            }
            else{

            }
        })


})

function buttonSelect(buttonPress, player) {
    console.log(buttonPress, player)
    database.ref("players/" + player).update({ choice: buttonPress });
}


function setupDissconectForPlayer(playerId) {
    var playerPath = "players/" + playerId;
    var playerRef = database.ref(playerPath);
    console.log("Setup disconnect for: " + playerPath);
    playerRef.onDisconnect().remove();
}

function checkIfPathExists(path) {
    database.ref(path).once('value',
        function successCallback(dataSnapshot) {
            if (dataSnapshot.val() !== null) {
                var key = dataSnapshot.key
                var val = dataSnapshot.val()
                console.log(true)
                console.log(`key: ${key} --> ${JSON.stringify(val)}`)
            } else {
                console.log(false)
            }
        },
        function errorCallback(error) {

        })
}