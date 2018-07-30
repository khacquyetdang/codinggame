// function to convert speed
// in m/sec to km/hr
function mps_to_kmph(mps) {
  return (3.6 * mps);
}




var distances = [1100, 1150, 1200, 1250, 1300, 2100, 2150, 2200, 2250, 2300, 3100, 3150, 3200, 3250, 3300, 4100, 4150, 4200, 4250, 4300, 5100, 5150, 5200, 5250, 5300, 6100, 6150, 6200, 6250, 6300, 7100, 7150, 7200, 7250, 7300, 8100, 8150, 8200, 8250, 8300, 9100, 9150, 9200, 9250, 9300, 10100, 10150, 10200, 10250, 10300, 11100, 11150, 11200, 11250, 11300, 12100, 12150, 12200, 12250, 12300, 13100, 13150, 13200, 13250, 13300, 14100, 14150, 14200, 14250, 14300, 15100, 15150, 15200, 15250, 15300, 16100, 16150, 16200, 16250, 16300, 17100, 17150, 17200, 17250, 17300, 18100, 18150, 18200, 18250, 18300, 19100, 19150, 19200, 19250, 19300, 20100, 20150, 20200, 20250, 20300];
var durations = [10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30];


durations = [25, 15, 10, 28];
distances = [700, 2200, 3000, 4000];
var lightCount = durations.length;
var maxDuration = 9999 * 2;
var speedMS = 25;


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
  // 70 - 160 => [70 -> 90], [120 -> 150]
  // 60 - 150 => [60 -> 90], [120 -> 150]
  // 50 - 100 => [60 -> 90]
  // 50 - 80  => [60 -> 80]
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
    nextIntervalLightGreen.push({
      start,
      end,
      speedMin,
      speedMax
    });
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
// algorithme
// d'abord calculer les bons intervals de temps et de vitesse pour passer le premier feu rouge
// Ensuite calculer en fonction des intervals du premier feu rouge, calculer les bons intervals pour passer
// le deuxieme feu rouge
// on arrête l'algorithme quand on a trouver le bon moment pour passer jusqu'au dernier feu
function computeSpeed() {
  var intervalFirstLight = durations[0];
  var distanceFirstLight = distances[0];
  for (var index = 0; index * durations[0] < maxDuration; index = index + 2) {
    var startInterval = Math.max(index * intervalFirstLight, 1);
    var currentSpeedMax = distanceFirstLight / startInterval;
    var endInterval = (index + 1) * intervalFirstLight;
    var currentSpeedMin = distanceFirstLight / endInterval;
    if (currentSpeedMin > speedMS) {
      continue;
    } else {
      var bestSpeed = computeNextSpeed(0, currentSpeedMin, currentSpeedMax);
      if (bestSpeed !== null) {
        return bestSpeed;
      }
    }
  }
}

var t0 = new Date().getTime();
var bestSpeed = computeSpeed();
var t1 = new Date().getTime();
console.log("Call to compute took " + (t1 - t0) + " milliseconds.");
console.log("bestSpeed", bestSpeed);