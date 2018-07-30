var speedInterval = require("./vitessesInterval.json");

var speedMS = 25;

function getIntersection(interval1, interval2) {

  interval1.vMax = parseFloat(interval1.vMax);
  interval1.vMin = parseFloat(interval1.vMin);
  interval2.vMin = parseFloat(interval2.vMin);
  interval2.vMax = parseFloat(interval2.vMax);

  if (interval1.vMax < interval2.vMin || interval2.vMax < interval1.vMin) {
    return null;
  } else {
    var vMin = Math.max(interval1.vMin, interval2.vMin);
    var vMax = Math.min(interval1.vMax, interval2.vMax);
    if (vMax === vMin) {
      return null;
    }
    var result = {
      vMin: vMin,
      vMax: vMax
    };

    return result;
  }
}

function getIntersectionTime(interval1, interval2) {

  if (interval1.end < interval2.start || interval2.end < interval1.start) {
    return null;
  } else {
    var start = Math.max(interval1.start, interval2.start);
    var end = Math.min(interval1.end, interval2.end);
    if (start === end) {
      return null;
    }
    var result = {
      start: start,
      end: end
    };

    return result;
  }
}

function getIntersectionArray(arrayInterval, istime = false) {
  if (arrayInterval.length < 2) {
    return null;
  }
  if (arrayInterval.length === 2) {
    var result = [];
    for (var index1 = 0; index1 < arrayInterval[0].length; index1++) {
      for (var index2 = 0; index2 < arrayInterval[1].length; index2++) {
        var intersection;

        if (istime) {
          intersection = getIntersectionTime(arrayInterval[0][index1], arrayInterval[1][index2]);
        } else {
          intersection = getIntersection(arrayInterval[0][index1], arrayInterval[1][index2]);

        }
        if (intersection !== null) {
          result.push(intersection);
        }
      }
    }
    return result;
  } else {
    var arrayVitesseFirst = getIntersectionArray(arrayInterval.slice(0, 2), istime);
    var arrayVitesseEnd = null;
    if (true) {
      console.log(arrayVitesseFirst);
      var vMin = arrayVitesseFirst[arrayVitesseFirst.length - 1].vMin;
      var vMax = arrayVitesseFirst[0].vMax;
      arrayVitesseEnd = arrayInterval.slice(2).map(elements => {
        elements = elements.filter(element => {
          return element.vMin >= vMin && element.vMax <= vMax;
        });
        return elements;
      });
    } else {
      arrayVitesseEnd = arrayInterval.slice(2);
    }
    arrayVitesseEnd.push(arrayVitesseFirst);
    return getIntersectionArray(arrayVitesseEnd, istime);
  }
}

function getBestSpeed(goodSpeedIntervalArr) {
  var bestSpeed = 0;
  goodSpeedIntervalArr.forEach(function (speedInterval) {
    if (bestSpeed < speedInterval.vMax) {
      bestSpeed = speedInterval.vMax;
    }
  });
  return bestSpeed;
}

function speedIntervalLightIsGreen(distances, durations, vMaxAllowed = 200) {
  var results = [];
  for (var i = 0; i < distances.length; i++) {
    var duration = durations[i];
    var distance = distances[i];
    results.push([]);
    for (var index = 0; index * duration < maxDuration; index = index + 2) {
      var start = Math.max(index * duration, 1);

      var end = start + duration;
      if (index === 0) {
        start = 1;
        end = duration;
      }
      var vitesseMin = distance / end;
      var vitesseMax = Math.min(distance / start, speedMS);
      //var vitesseMax = Number.parseFloat(distance / start).toFixed(2);

      if (vitesseMin < speedMS && vitesseMin >= 1 && vitesseMin < vitesseMax &&
        vitesseMax <= speedMS) {
        var interval = {
          vMin: vitesseMin,
          vMax: vitesseMax
        };
        results[i].push(interval);
      }
    }
  }
  var minOfVMax = 200 * 10 / 36;
  var maxOfVMin = 1;
  for (var i = 0; i < results.length; i++) {
    var current = results[i];
    if (current[0].vMax < minOfVMax) {
      minOfVMax = current[0].vMax;
    }

    if (current[current.length - 1].vMin <= maxOfVMin) {
      maxOfVMin = results[i][0].vMin;
    }

  }
  console.log("count before filtre", results.reduce(function (count, elements) {
    return count + elements.length;
  }, 0));
  for (var i = 0; i < results.length; i++) {
    results[i] = results[i].filter(function (aspeedInterval) {
      return aspeedInterval.vMin < minOfVMax;
    });
    results[i] = results[i].filter(function (aspeedInterval) {
      return aspeedInterval.vMax > maxOfVMin;
    });
  }

  console.log("count after filtre", results.reduce(function (count, elements) {
    return count + elements.length;
  }, 0));
  return results;

}

function timeIntervalLightIsGreen(distances, durations, speedMS) {
  var results = [];
  for (var i = 0; i < distances.length; i++) {
    var duration = durations[i];
    var distance = distances[i];
    results.push([]);
    for (var index = 0; index * duration < 200; index = index + 2) {
      var start = index * duration;

      var end = start + duration;
      var interval = {
        start: start,
        end: end
      };
      results[i].push(interval);
    }
  }
  return results;
}

// function to convert speed
// in m/sec to km/hr
function mps_to_kmph(mps) {
  return (3.6 * mps);
}


speedMS = 36.111111111111114;
var speedKmh = 200;
var speedResKmh = 60;
var speedResMs = 16.667;



distances = [1100, 1150, 1200, 1250, 1300, 2100, 2150, 2200, 2250, 2300, 3100, 3150, 3200, 3250, 3300, 4100, 4150, 4200, 4250, 4300, 5100, 5150, 5200, 5250, 5300, 6100, 6150, 6200, 6250, 6300, 7100, 7150, 7200, 7250, 7300, 8100, 8150, 8200, 8250, 8300, 9100, 9150, 9200, 9250, 9300, 10100, 10150, 10200, 10250, 10300, 11100, 11150, 11200, 11250, 11300, 12100, 12150, 12200, 12250, 12300, 13100, 13150, 13200, 13250, 13300, 14100, 14150, 14200, 14250, 14300, 15100, 15150, 15200, 15250, 15300, 16100, 16150, 16200, 16250, 16300, 17100, 17150, 17200, 17250, 17300, 18100, 18150, 18200, 18250, 18300, 19100, 19150, 19200, 19250, 19300, 20100, 20150, 20200, 20250, 20300];
durations = [10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30, 10, 15, 20, 25, 30];

var maxDuration = 9999 * 2;
speedMS = 25;

var t0 = new Date().getTime();
var bestSpeed = getBestSpeed(getIntersectionArray(speedIntervalLightIsGreen(distances, durations)));
var t1 = new Date().getTime();
console.log("Call to compute took " + (t1 - t0) + " milliseconds.");
console.log("bestSpeed", bestSpeed);

// algorithme
// d'abord calculer les bons intervals de temps et de vitesse pour passer le premier feu rouge
// Ensuite calculer en fonction des intervals du premier feu rouge, calculer les bons intervals pour passer
// le deuxieme feu rouge
// on arrête l'algorithme quand on a trouver le bon moment pour passer jusqu'au dernier feu