// function to convert speed in m/sec to km/hr
function mps_to_kmph(mps) {
  return (3.6 * mps);
}

durations = [
  15,
  10,
  30,
  30,
  5,
  10
];
distances = [
  1000,
  3000,
  4000,
  5000,
  6000,
  7000
];

var lightCount = durations.length;
var maxDuration = 9999 * 2;
var speedMS = 55.55555555555556;

var maxDuration = 9999 * 2;

function isOdd(num) {
  return num % 2;
}

function computeNextSpeed(currentIndex, currentSpeedMin, currentSpeedMax) {
  if (currentSpeedMin >= currentSpeedMax) {
    return null;
  }
  let nextDistanceLight = distances[currentIndex + 1];
  let nextIntervalLight = durations[currentIndex + 1];
  var startInterval = nextDistanceLight / currentSpeedMax; // 1500 / 25 = 70
  var endInterval = nextDistanceLight / currentSpeedMin; //1500 / 10 = 160
  // 70 - 160 => [70 -> 90], [120 -> 150] 60 - 150 => [60 -> 90], [120 -> 150] 50
  // - 100 => [60 -> 90] 50 - 80  => [60 -> 80]
  var indexStart = Math.floor(startInterval / nextIntervalLight);
  if (isOdd(indexStart)) {
    indexStart = indexStart + 1;
  }
  var nextIntervalLightGreen = [];
  for (var index = indexStart; index * nextIntervalLight < endInterval; index = index + 2) {
    var start = index * nextIntervalLight;
    var end = (index + 1) * nextIntervalLight;
    var speedMin = nextDistanceLight / end;
    var speedMax = nextDistanceLight / start;
    nextIntervalLightGreen.push({start, end, speedMin, speedMax});
  }
  if (nextIntervalLightGreen.length === 0) {
    return null;
  }
  if (nextIntervalLightGreen[0].start < startInterval) {
    nextIntervalLightGreen[0].start = startInterval;
    nextIntervalLightGreen[0].speedMax = nextDistanceLight / startInterval;
  }
  let indexLast = nextIntervalLightGreen.length - 1;
  if (nextIntervalLightGreen[indexLast].end > endInterval) {
    nextIntervalLightGreen[indexLast].end = endInterval;
    nextIntervalLightGreen[indexLast].speedMin = nextDistanceLight / endInterval;
  }
  if (currentIndex + 1 === lightCount - 1) {
    return nextIntervalLightGreen[0].speedMax;
  } else {
    for (let index = 0; index < nextIntervalLightGreen.length; index++) {
      let currentSpeedMin = nextIntervalLightGreen[index].speedMin;
      let currentSpeedMax = nextIntervalLightGreen[index].speedMax;
      let bestSpeed = computeNextSpeed(currentIndex + 1, currentSpeedMin, currentSpeedMax);
      if (bestSpeed !== null) {
        return bestSpeed;
      }
    }
    return null;
  }
  return null;
}
// algorithme d'abord calculer les bons intervals de temps et de vitesse pour
// passer le premier feu rouge Ensuite calculer en fonction des intervals du
// premier feu rouge, calculer les bons intervals pour passer le deuxieme feu
// rouge on arrête l'algorithme quand on a trouver le bon moment pour passer
// jusqu'au dernier feu une fois trouver la vitesse MS, on le convert en km/h en
// enlevent la partie décimale. On reconvert cette vitesse en ms et on rechecke
// si cette vitesse passe tous les feux. On mettre à jour la vitesse maximum
function computeSpeed() {
  var intervalFirstLight = durations[0];
  var distanceFirstLight = distances[0];
  for (var index = 0; index * durations[0] < maxDuration; index = index + 2) {
    var startInterval = Math.max(index * intervalFirstLight, 1);
    var currentSpeedMax = Math.min(distanceFirstLight / startInterval, speedMS);
    var endInterval = (index + 1) * intervalFirstLight;
    var currentSpeedMin = distanceFirstLight / endInterval;
    if (currentSpeedMin > speedMS) {
      continue;
    } else {
      if (lightCount === 1) {
        return currentSpeedMax;
      }
      var bestSpeed = computeNextSpeed(0, currentSpeedMin, currentSpeedMax);
      if (bestSpeed !== null) {
        return bestSpeed;
      }
    }
  }
}
function checkSpeed(bestSpeedMS) {
  for (var index = 0; index < lightCount; index++) {
    var currentIntervalAtLight = durations[index];
    var currentDistance = distances[index];
    var timeToCurrentLight = currentDistance / bestSpeedMS;
    var indexInterval = Math.floor(timeToCurrentLight / currentIntervalAtLight);
    if (isOdd(indexInterval)) {
      //timeToCurrentLight = 1234 / (88 * 10 / 36) = 50.4818 5
      return false;
    }
  }
  return true;
}

var t0 = new Date().getTime();
var bestSpeed = computeSpeed();
var bestSpeedKmh = Math.floor(mps_to_kmph(bestSpeed));
var bestSpeedMS = bestSpeedKmh * 10 / 36;
if (bestSpeedMS !== bestSpeed) {
  while (!checkSpeed(bestSpeedMS)) {
    speedMS = (bestSpeedKmh - 1) * 10 / 36;
    bestSpeed = computeSpeed();
    bestSpeedKmh = Math.floor(mps_to_kmph(bestSpeed));
    bestSpeedMS = bestSpeedKmh * 10 / 36;
  }
}
var t1 = new Date().getTime();
console.log("Call to compute took " + (t1 - t0) + " milliseconds.");
console.log("bestSpeed", bestSpeed, "bestSpeedKmh", bestSpeedKmh);