/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
var R = parseInt(inputs[0]); // number of rows.
var C = parseInt(inputs[1]); // number of columns.
var A = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

const debug = true;

function logErr() {
    if (debug) {
        //printErr.apply(null, arguments);
        //console.error.apply(console, arguments); printErr(arguments);
    }
}
// game loop
var matrix = new Array(R);
for (let i = 0; i < R; i++) {
    matrix[i] = new Array(C);
    for (let j = 0; j < C; j++) {
        matrix[i][j] = {
            visited: false,
            visited_back: false,
            gScore: Number.MAX_VALUE, // use to find the shortest way to reach
            // initial position when command room is found
            cameFrom: null,
            value: null
        };
    }
}

var graphe = null;
var queue = [];
var startGames = false;
var commandFound = false;
var KInitCoord = null;
var KToHomeCoord = null;
var coordC = null;
var arrayNeighBorsIndex = [
    {
        row: 0,
        col: 1
    }, {
        row: 0,
        col: -1
    }, {
        row: 1,
        col: 0
    }, {
        row: -1,
        col: 0
    }
];
var isReachStartPos = false;

function compareScore(A, B) {
    //logErr('compareScore');

    let Avalue = matrix[A.row][A.col];
    let Bvalue = matrix[B.row][B.col];
    /*logErr('A', JSON.stringify(A),
    'val', JSON.stringify(Avalue), 'B', JSON.stringify(B), 'val', JSON.stringify(Bvalue));
    */
    return Avalue.gScore - Bvalue.gScore;
}

/**
 * Look for the shortest way beetween A and B, return false if there is no way to connect
 * A and B
 */
function shortestPath(src, target) {
    if (!src || !target)
    {
        return null;
    }
    let matrixC = [];
    for (let row = 0; row < matrix.length; row++) {
        let cols = [];
        for (let col = 0; col < matrix[row].length; col++) {
            let value = matrix[row][col].value;
            cols.push({value: value, gScore: Number.MAX_VALUE, visited: false});
        }
        matrixC.push(cols);
    }

    let srcVal = matrixC[src.row][src.col];
    srcVal.gScore = 0;
    let openSet = [src];
    let pathToTargetFound = false;
    while (openSet.length > 0) {
        openSet.sort(compareScore);
        let current = openSet.shift();

        if (current.row === target.row && current.col === target.col) {
            logErr("Reach target point");
            pathToTargetFound = true;
            break;
        }
        matrixC[current.row][current.col].visited = true;

        for (let indexNeighBours = 0; indexNeighBours < arrayNeighBorsIndex.length; indexNeighBours++) {
            var neighBoursCoord = arrayNeighBorsIndex[indexNeighBours];
            var neighBoursCoord_row = neighBoursCoord.row + current.row;
            var neighBoursCoord_col = neighBoursCoord.col + current.col;

            if (neighBoursCoord_row >= 0 && neighBoursCoord_row < R && neighBoursCoord_col >= 0 && neighBoursCoord_col < C) {
                if (matrixC[neighBoursCoord_row][neighBoursCoord_col].visited || matrixC[neighBoursCoord_row][neighBoursCoord_col].value === '#' || matrixC[neighBoursCoord_row][neighBoursCoord_col].value === '?' || matrixC[neighBoursCoord_row][neighBoursCoord_col].value === null) {
                    continue;
                }
                var isInOpenSet = false;
                for (let index = 0; index < openSet.length && isInOpenSet === false; index++) {
                    if (openSet[index].col === neighBoursCoord_col && openSet[index].row === neighBoursCoord_row) {
                        isInOpenSet = true;
                    }
                }
                if (isInOpenSet === false) {
                    openSet.push({row: neighBoursCoord_row, col: neighBoursCoord_col});
                }
                var tentative_gScore = matrixC[current.row][current.col].gScore + 1;
                if (tentative_gScore < matrixC[neighBoursCoord_row][neighBoursCoord_col].gScore) {
                    matrixC[neighBoursCoord_row][neighBoursCoord_col].gScore = tentative_gScore;
                    matrixC[neighBoursCoord_row][neighBoursCoord_col].cameFrom = current;
                }
            }
        }
    }
    logErr("target", JSON.stringify(target), "value", JSON.stringify(matrixC[target.row][target.col]));
    var backToInitPath = [target];
    let cameFrom = matrixC[target.row][target.col].cameFrom;

    while (cameFrom) {
        logErr("cameFrom", JSON.stringify(cameFrom));
        backToInitPath.unshift(cameFrom);
        cameFrom = matrixC[cameFrom.row][cameFrom.col].cameFrom;
    }
    return pathToTargetFound
        ? backToInitPath
        : null;
}

/**
 * go from A to B
 */
function move(coordA, coordB) {
    //logErr("coordA", JSON.stringify(coordA), "coordB", JSON.stringify(coordB));
    if (coordB.row === 3 && coordB.col === 5) {
        // print("row", coordB.row, "col", coordB.col, "val",
        // JSON.stringify(matrix[coordB.row][coordB.col]));
    }
    if (coordB.row === coordA.row) {
        if (coordB.col < coordA.col) {
            print("LEFT");
        } else if (coordB.col > coordA.col) {
            print("RIGHT");
        }
    } else if (coordB.col === coordA.col) {
        if (coordB.row < coordA.row) {
            print("UP");
        } else if (coordB.row > coordA.row) {
            print("DOWN");
        }
    }
}

let shortestPathToC = null;
while (!commandFound) {
    logErr("Start tour");
    if (!commandFound) {
        var inputs = readline().split(' ');
    }
    //printErr("inputs", inputs);
    var KR = parseInt(inputs[0]); // row where Kirk is located.
    var KC = parseInt(inputs[1]); // column where Kirk is located.
    if (!KInitCoord) 
    {
        KInitCoord = {
            row: KR,
            col: KC
        };
    }
    if (KR && KC) {
        matrix[KR][KC].visited = true;
    }


    //matrix[KR][KC].value =  '.'; matrix[KR][KC].visited =  true;
    if (coordC && coordC.row === KR && coordC.col === KC) {
        logErr("Command found", " need to go back to start position");
        ///printErr("maxtrix", matrix);
        commandFound = true;
        break;
        //like here just foreach move print(reversed(move)) ok i will try, got the idea
    }

    for (var i = 0; i < R; i++) {
        var ROW = readline(); // C of the characters in '#.TC?' (i.e. one line of the ASCII maze).

        var jStart = Math.max(0, KC - 2);
        var jEnd = Math.min(KC + 2, C);

        for (let j = jStart; j < jEnd; j++) {
            if (ROW[j] !== '?' && ROW[j] !== null) {
                matrix[i][j].value = ROW[j];
                if (ROW[j] === 'C') {
                    logErr('Command coord discover', JSON.stringify(ROW[j]));
                    coordC = {
                        row: i,
                        col: j
                    };
                }
            }
        }
    }
    logErr("KInitCoord", JSON.stringify(KInitCoord), "coordC", JSON.stringify(coordC));
    let pathCommandRoomInitialPos = shortestPath(KInitCoord, coordC);
    let distanceCommandRoomToInitialPos = pathCommandRoomInitialPos === null ? Number.MAX_VALUE : pathCommandRoomInitialPos.length - 1;
    logErr("distanceCommandRoomToInitialPos", distanceCommandRoomToInitialPos,
    "A", A);
    if (distanceCommandRoomToInitialPos <= A) {
        // TODO go straight to the control room instead of discover the rest of map ?
        // may be it is better to discover the most possible of map before go straight
        // to control room
        var currentCoord = { row: KR, col : KC }
        var pathToCoord = shortestPath(currentCoord, coordC);
        
        logErr("Path to commandRoom", JSON.stringify(pathToCoord));
        
        var currentCoord = pathToCoord.shift();
        while (pathToCoord.length > 0) {
            nextCoord = pathToCoord.shift();
            move(currentCoord, nextCoord);
            currentCoord = nextCoord;
        }
        break;
    }
    let hasNeighBoursUnVisited = false;
    let neighBoursUnVisitedCoord = null;
    for (let indexNeighBours = 0; indexNeighBours < arrayNeighBorsIndex.length; indexNeighBours++) {
        var neighBoursCoord = arrayNeighBorsIndex[indexNeighBours];
        var neighBoursCoord_row = neighBoursCoord.row + KR;
        var neighBoursCoord_col = neighBoursCoord.col + KC;

        if (neighBoursCoord_row >= 0 && neighBoursCoord_row < R && neighBoursCoord_col >= 0 && neighBoursCoord_col < C) {
            if (matrix[neighBoursCoord_row][neighBoursCoord_col].visited === false 
                && (matrix[neighBoursCoord_row][neighBoursCoord_col].value === '.'
                || matrix[neighBoursCoord_row][neighBoursCoord_col].value === 'C')) {
                if (matrix[neighBoursCoord_row][neighBoursCoord_col].value === 'C')
                {
                    if (distanceCommandRoomToInitialPos <= A)
                    {
                        hasNeighBoursUnVisited = true;
                        neighBoursUnVisitedCoord = {
                            row: neighBoursCoord_row,
                            col: neighBoursCoord_col
                        };
                        break;                        
                    }
                }
                else
                {
                    hasNeighBoursUnVisited = true;
                    neighBoursUnVisitedCoord = {
                        row: neighBoursCoord_row,
                        col: neighBoursCoord_col
                    };
                    break;
                }
            }
        }
    }

    if (neighBoursUnVisitedCoord) {
        // printErr("KR ", KR, " KC ", KC); printErr('NeighBoard row',
        // neighBoursUnVisitedCoord.row, " col " , neighBoursUnVisitedCoord.col);
        logErr('neighBoursUnVisitedCoord', JSON.stringify(neighBoursUnVisitedCoord));
        neighBoursUnVisitedCoord.parent = {
            row: KR,
            col: KC
        };
        matrix[KR][KC].child = neighBoursUnVisitedCoord;
        matrix[neighBoursUnVisitedCoord.row][neighBoursUnVisitedCoord.col].parent = {
            row: KR,
            col: KC
        };
        move({
            row: KR,
            col: KC
        }, neighBoursUnVisitedCoord);
    } else {
        move({
            row: KR,
            col: KC
        }, matrix[KR][KC].parent);
        // go back to parent and let try to go to another neighbours
    }
    // Write an action using print() To debug: printErr('Debug messages...');
    // print('RIGHT'); // Kirk's next move (UP DOWN LEFT or RIGHT).

    logErr("End tour");
}

var backToInitPath = shortestPath(coordC, KInitCoord);

logErr("Path to init", JSON.stringify(backToInitPath));
//print(JSON.stringify(backToInitPath));
logErr("End search");

let cameFrom = matrix[KInitCoord.row][KInitCoord.col].cameFrom;
var currentCoord = backToInitPath.shift();
while (backToInitPath.length > 0) {
    nextCoord = backToInitPath.shift();
    move(currentCoord, nextCoord);
    currentCoord = nextCoord;
}
