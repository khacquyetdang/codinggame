/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/



var inputs = readline().split(' ');
var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
var L = parseInt(inputs[1]); // the number of links
var E = parseInt(inputs[2]); // the number of exit gateways

var network = [];
var gateways = [];
for (let i = 0; i < N; i++)
{
    network.push([]);
}

for (var i = 0; i < L; i++) {
    var inputs = readline().split(' ');
    var N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    var N2 = parseInt(inputs[1]);
    let linksN1 = network[N1];
    let linksN2 = network[N2];
    if (linksN1.indexOf(N2) === -1)
    {
        linksN1.push(N2);
    }
    if (linksN2.indexOf(N1) === -1)
    {
        linksN2.push(N1);
    }
}
for (var i = 0; i < E; i++) {
    var EI = parseInt(readline()); // the index of a gateway node
    gateways.push(EI);
}
function debug()
{
    printErr.apply(null, arguments);
}

function dijkstra(src)
{
    var queue = [];
    var dist = new Array(N);
    dist[src] = 0;
    var prev = new Array(N);
    
    for (let v = 0; v < N; v++)
    {
        if (v != src)
        {
            //dist[v] = Number.MAX_VALUE;
            dist[v] = 100000;
            prev[v] = null;
        }
        queue.push(v);
    }
    
    function compareDist(index1, index2)
    {
        return dist[index1] - dist[index2];     
    }
    
    while (queue.length > 0)
    {
        queue.sort(compareDist);
        var u = queue.shift();
        let neighborsU = network[u];
        for (let indexNb = 0; indexNb < neighborsU.length; indexNb++)
        {
            let neighbor = neighborsU[indexNb]; 
            var alt = dist[u] + 1;
            if (alt < dist[neighbor])
            {
                dist[neighbor] = alt;
                prev[neighbor] = u;
            }
        }
    }
    
    var bestGateWay =  gateways[0];
    var gateWayPath = [];
    var gateIsolated = [];
    for (let indexG = 0; indexG < gateways.length; indexG++)
    {
        let currentG = gateways[indexG];
        if (network[currentG].length === 0) {
             gateIsolated.push(indexG);        
        }
    }
    gateIsolated.forEach(ele => {
        gateways.slice(ele, 1);
    });
    
    let minDistToGateWay = Number.MAX_VALUE;
    for (let indexG = 0; indexG < gateways.length; indexG++)
    {
        var currentG = gateways[indexG];
        
        if (dist[currentG] < minDistToGateWay)
        {
            minDistToGateWay = dist[currentG];
        }
        
        if (dist[bestGateWay] > dist[currentG])
        {
            bestGateWay = currentG;
        }
        
        debug("currentG", currentG);
        let currentPath = [];
        if (prev[currentG] !== null
        && prev[currentG] !== undefined)
        {
            gateWayPath.push({ prev: prev[currentG],
            current: currentG });
        }
    }
    debug("minDist", minDistToGateWay);
    debug("gateways", gateways);
    debug("gateWayPath", JSON.stringify(gateWayPath));
    gateWayPath = gateWayPath.filter(ele => dist[ele.current] === minDistToGateWay);
    debug("gateWayPath", JSON.stringify(gateWayPath));
    var mapPrev = new Map();
    gateWayPath.forEach(ele => {
        debug("element", JSON.stringify(ele));
        if (mapPrev.get(ele.prev))
        {
            mapPrev.get(ele.prev).push(ele);
        }
        else {
            mapPrev.set(ele.prev, [ele]);
        }
    });
    
    var maxCount = 0;
    var bestRes = null;
    var bestGateway = null;
    var neighBorsOfBestGateway = [];
    
    
    gateWayPath.forEach((ele) => {
        
        //if (bestRes === null || value.length > bestRes.length)
        if (bestRes === null || network[ele.current].length > network[bestGateway].length)
        {
            bestGateway = ele.current;
            bestRes = ele;
        }
        neighBorsOfBestGateway.push(network[ele.current]);
        debug("neighbors of gateway",       
        ele.current,
        "neighbors", network[ele.current]);
    });
    
    let gatewayNeighbors = new Map();
    
    gateways.forEach(gateway => {
        gatewayNeighbors.set(gateway, network[gateway]);
    });
    let nodeWithGateway = new Map();
    
    gatewayNeighbors.forEach((value, key) =>
    {
        value.forEach( node => {
            if (nodeWithGateway.get(node))
            {
                nodeWithGateway.get(node).push(key);
            } else {
                nodeWithGateway.set(node, [key]);
            }
        });
    });
    nodeLinkToManyGateWay = new Map();
    nodeWithGateway.forEach((value, key) => 
    {
        if (value.length >= 2)
        {
            nodeLinkToManyGateWay.set(key, value);
        }
    });
    
    let bestNodeToDelete = null;
    let minDist = Number.MAX_VALUE;
    nodeLinkToManyGateWay.forEach((value, key) =>
    {
        if (dist[key] < minDist)
        {
            minDist = dist[key];
            bestNodeToDelete = key;   
        }
        debug("nodeLinkToManyGateWay", key, JSON.stringify(value));
    });
    
    let maxNeighborConnectToGateWay = 0;
    var BreakException = {};
    /* neigh bors of node that link to many gateway
    * these neighbor must connect to a gateway 
    */
    bestNodeToDelete = null;
    let neighborNodeLinkToManyGateWay = new Map(); 
    try {
        nodeLinkToManyGateWay.forEach((value, key) => {
            let neighbors = network[key];
            let countNeigborConnectToGateway = 0;
            if (neighbors.indexOf(SI) !== -1)
            {
                bestNodeToDelete = key;
                throw BreakException;
            }
            neighbors.forEach(neighbor => {
                gateways.forEach(gateway => {
                    if (network[neighbor].indexOf(gateway) !== -1)
                    {
                        countNeigborConnectToGateway++;
                    }
                });
            });
            debug("node", key, "neighborsConnectDirectToGateway",  countNeigborConnectToGateway);
            neighborNodeLinkToManyGateWay.set(key, countNeigborConnectToGateway);
            
            if (countNeigborConnectToGateway > maxNeighborConnectToGateWay)
            {
                maxNeighborConnectToGateWay = countNeigborConnectToGateway;
                //bestNodeToDelete = key;
            }
        });
    } catch (e)
    {
        debug("the node is linked to Virus");
    }
    
    debug("neigbors", JSON.stringify(neighBorsOfBestGateway));
    debug("neighborNodeLinkToManyGateWay.size", neighborNodeLinkToManyGateWay.size);
    debug("bestNodeToDelete", JSON.stringify(bestNodeToDelete));
    if (bestNodeToDelete !== null)
    {
        return {
            prev: bestNodeToDelete,
            current: nodeLinkToManyGateWay.get(bestNodeToDelete)[0]
        }
    }
    else if (neighborNodeLinkToManyGateWay.size > 0)
    {
        let minDistanceToSi = Number.MAX_VALUE;
        let maxCountValue = 0;
        let bestNode = null;
        neighborNodeLinkToManyGateWay.forEach((value, key) =>
        {
            debug("neighborNodeLinkToManyGateWay neighbors", key, "count", value);
            if (maxCountValue < value)
            {
                maxCountValue = value;
                minDistanceToSi = dist[key];
                bestNode = key;
            } else if (maxCountValue === value)
            {
                if (minDistanceToSi > dist[key])
                {
                    minDistanceToSi = dist[key];
                    bestNode = key;    
                }
            }
        });
        debug("bestNode", bestNode);
         return {
            prev: bestNode,
            current: nodeLinkToManyGateWay.get(bestNode)[0]
        }
    }
    else if (neighBorsOfBestGateway.length > 1)
    {    
        var result = neighBorsOfBestGateway.shift().filter(function(v) {
        return neighBorsOfBestGateway.every(function(a) {
                return a.indexOf(v) !== -1;
            });
        });
        debug("commonNode of gateway", result);
        if (result.length >= 1)
        {
            let res = {
               prev: result[0],
                current: gateWayPath.pop().current
                //prev : 16,
                //current: 17
            };
            debug("res", JSON.stringify(res));
            return res;
        }
    }
    let res = bestRes;
    debug("res", JSON.stringify(res));
    return res;
    
}

// game loop
while (true) {
    var SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
    debug("SI pos", SI);
    debug("networks" , JSON.stringify(network));

    
    
    // Write an action using print()
    // To debug: printErr('Debug messages...');
    
    let nodeGateway = isLinkedToGateWay(SI);
    if (nodeGateway !== -1)
    {
        debug("link direct to gateway");
        deleteLink(SI, nodeGateway);
        debug(SI + ' ' + nodeGateway);
        print(SI + ' ' + nodeGateway);
    }
    
    else {
        let linkToDelete = dijkstra(SI);
        debug(JSON.stringify(linkToDelete));
        print(linkToDelete.prev + " " + linkToDelete.current);
        deleteLink(linkToDelete.prev, linkToDelete.current);
        debug("prev", linkToDelete.prev, "val", JSON.stringify(network[linkToDelete.prev]));
        debug("current", linkToDelete.current, "val", JSON.stringify(network[linkToDelete.current]));
    }
    // Example: 0 1 are the indices of the nodes you wish to sever the link between
    
}

/**
 * return -1 if not linked or the gateway number
 */
function isLinkedToGateWay(node) {
    let go = true;
    let gatewayIndex = 0;
    let nodeIndex = 0;
    for (gatewayIndex = 0; gatewayIndex < gateways.length; gatewayIndex++) {
        var gatewayNumber = gateways[gatewayIndex];
        if (network[node].indexOf(gatewayNumber) !== -1)
        {
            return gatewayNumber;
        }
    }
    return -1;
}

//Retrun the link to destroy near the first gateway in the list if there is a Gateway or Emptystring
function isolateGateWay(node)
{
    for (let gatewayIndex = 0; gatewayIndex < gateways.length; gatewayIndex++) {
        var gatewayNumber = gateways[gatewayIndex];
        for (let gatewayLinkIndex = 0; gatewayLinkIndex < network[gatewayNumber].length; gatewayLinkIndex++)
        {
            if (hasPathToNode(network[gatewayNumber][gatewayLinkIndex], node, []))
            {
                return gatewayNumber + " " + network[gatewayNumber][gatewayLinkIndex];
            }
        }
    }
    return "";
}

function hasPathToNode(startNode, targetNode, excludeNodes) {
    //debug("hasPathToNode startNode", startNode, "targetNode", targetNode);
    let linksStartNode = network[startNode];
    //debug("linksStartNode", JSON.stringify(linksStartNode));
    if (linksStartNode.indexOf(targetNode) !== -1)
    {
        return true;
    } else if (excludeNodes.indexOf(startNode) !== -1)
    {
        return false;
    }    
    else {
        let excludeNodesClone = excludeNodes.slice();
        excludeNodesClone.push(startNode);
        for (let childIndex = 0; childIndex < linksStartNode.length; childIndex++)
        {
            let childNode = linksStartNode[childIndex];
            if (hasPathToNode(childNode, targetNode, excludeNodesClone))
            {
                return true;
            }
        }
    }
    // @TODO
    //Need to resolve the cas if there are several level
    return false;
}


function deleteLink(N1, N2) {
    let linksN1 = network[N1];
    let linksN2 = network[N2];
    
    let indexN2 = linksN1.indexOf(N2);
    let indexN1 = linksN2.indexOf(N1);

    if (indexN2 !== -1)
    {
        linksN1.splice(indexN2, 1);
    }
    if (indexN1 !== -1)
    {
        linksN2.splice(indexN1, 1);
    }
}