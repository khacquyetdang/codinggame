/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
function print() {
    console.log.apply(console, arguments);
}

function printErr() {
    console.log.apply(console, arguments);
}

function logErr() {
    //printErr.apply(null, arguments);
    console.log.apply(console, arguments);
}

function logWarErr() {
    //printErr.apply(null, arguments);
    console.log.apply(console, arguments);

}
var cardsPower = new Map();
for (let cardIndex = 2; cardIndex <= 10; cardIndex++) {
    cardsPower.set('' + cardIndex, cardIndex);
}
cardsPower.set('J', 11);
cardsPower.set('Q', 12);
cardsPower.set('K', 13);
cardsPower.set('A', 14);
logErr(JSON.stringify([...cardsPower]));
let cardp1Arr = [];
let cardp2Arr = [];
let test = false;

cardp1Arr = "AH 4H 5D 6D QC JS 8S 2D 7D JD JC 6C KS QS 9D 2C 5S 9S 6S 8H AD 4D 2H 2S 7S 8C".split(" ");
cardp2Arr = "10H 4C 6H 3C KC JH 10C AS 5H KH 10S 9H 9C 8D 5C AC 3H 4S KD 7C 3S QH 10D 3D 7H QD".split(" ");

logErr("cardp1Arr: ", cardp1Arr.join(" "));
logErr("cardp2Arr: ", cardp2Arr.join(" "));
let winner;
let gameRounds = 0;
let gameEnd = false;
var pat = false;
let warCount = 0;

while (!gameEnd) {
    logErr("round : ", gameRounds);
    logErr("P1:", cardp1Arr.join(" "));
    logErr("P2:", cardp2Arr.join(" "));
    if (cardp1Arr.length === 0 ||
        cardp2Arr.length === 0) {
        break;
    }
    let cardFightP1 = cardp1Arr.shift();
    let cardFightP2 = cardp2Arr.shift();

    let cardFightP1S = cardFightP1.substring(0, cardFightP1.length - 1);
    let cardFightP2S = cardFightP2.substring(0, cardFightP2.length - 1);

    //logErr("cardFightP1S: ", cardFightP1S, "power", cardsPower.get(cardFightP1S));
    //logErr("cardFightP2S: ", cardFightP2S, "power", cardsPower.get(cardFightP2S));
    if (cardsPower.get(cardFightP1S) > cardsPower.get(cardFightP2S)) {
        cardp1Arr.push(cardFightP1, cardFightP2);
    } else if (cardsPower.get(cardFightP1S) < cardsPower.get(cardFightP2S)) {
        // always add the card of player 1 first then player 2
        cardp2Arr.push(cardFightP1, cardFightP2);
    } else {
        // draw so we need to begin the battle
        // retrieve 3 cards    
        let war = true;
        let cardsWarP1 = [cardFightP1];
        let cardsWarP2 = [cardFightP2];
        let warTurn = 0;
        while (war) {
            logWarErr("war", warTurn);
            logWarErr("gameRounds", gameRounds);
            logWarErr("card p1", cardFightP1);
            logWarErr("card p2", cardFightP2);

            logWarErr("p1", cardp1Arr.join(" "));
            logWarErr("p2", cardp2Arr.join(" "));
            warTurn++;
            if (cardp1Arr.length >= 3 &&
                cardp2Arr.length >= 3) {
                cardsWarP1 = cardsWarP1.concat(cardp1Arr.slice(0, 3));
                cardsWarP2 = cardsWarP2.concat(cardp2Arr.slice(0, 3));
                cardp1Arr.splice(0, 3);
                cardp2Arr.splice(0, 3);
            } else {
                war = false;
                pat = true;
                gameEnd = true;
                break;
            }
            if (cardp1Arr.length > 0 && cardp2Arr.length > 0) {

                let cardFightP1 = cardp1Arr.shift();
                let cardFightP2 = cardp2Arr.shift();

                let cardFightP1S = cardFightP1.substring(0, cardFightP1.length - 1);
                let cardFightP2S = cardFightP2.substring(0, cardFightP2.length - 1);

                //logErr("cardFightP1S: ", cardFightP1S, "power", cardsPower.get(cardFightP1S));
                //logErr("cardFightP2S: ", cardFightP2S, "power", cardsPower.get(cardFightP2S));
                cardsWarP1.push(cardFightP1);
                cardsWarP2.push(cardFightP2);

                // if not draw, we distribute the card to the queue of player 1
                // or player tow and we end the battle                
                if (cardsPower.get(cardFightP1S) > cardsPower.get(cardFightP2S)) {
                    war = false;
                    cardp1Arr = cardp1Arr.concat(cardsWarP1).concat(cardsWarP2);
                } else if (cardsPower.get(cardFightP1S) < cardsPower.get(cardFightP2S)) {
                    war = false;
                    // always add the card of player 1 first then player 2
                    //cardp2Arr = cardp2Arr.concat(cardsWar);
                    cardp2Arr = cardp2Arr.concat(cardsWarP1).concat(cardsWarP2);
                }
            }
        }

        logWarErr("War end, warTurn", warTurn);
        logWarErr("p1", cardp1Arr.join(" "));
        logWarErr("p2", cardp2Arr.join(" "));
    }

    gameRounds++;
}


if (pat) {
    print('PAT');
} else if (cardp1Arr.length > 0) {
    print('1', gameRounds);
} else if (cardp2Arr.length > 0) {
    print('2', gameRounds);
}