/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
function shuffleArray(array) {
    var shuffled = array.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = tmp;
    }
    return shuffled;
}

/**
 * Select missions using the deck draw method (official rules).
 * Simulates drawing from a shuffled deck and choosing whether to keep each card.
 */
function selectMissionsDeckDraw(missions, numPlayers, targetDifficulty, maxAttempts) {
    maxAttempts = maxAttempts || CONSTANTS.DECK_DRAW_MAX_ATTEMPTS;
    var playerKey = numPlayers + '_players';
    var bestResult = null;
    var bestDistance = Infinity;

    for (var attempt = 0; attempt < maxAttempts; attempt++) {
        var shuffledMissions = shuffleArray(missions);
        var selected = [];
        var skipped = [];
        var total = 0;
        var cardsDrawn = 0;

        for (var i = 0; i < shuffledMissions.length; i++) {
            var mission = shuffledMissions[i];
            cardsDrawn++;
            var difficulty = mission.difficulty[playerKey];

            if (total + difficulty <= targetDifficulty) {
                selected.push({
                    id: mission.id,
                    difficulty: difficulty,
                    description: mission.description
                });
                total += difficulty;

                if (total === targetDifficulty) {
                    return { selected: selected, skipped: skipped, cardsDrawn: cardsDrawn, attempts: attempt + 1, exactMatch: true };
                }
            } else {
                skipped.push({
                    id: mission.id,
                    difficulty: difficulty,
                    description: mission.description
                });
            }
        }

        var distance = targetDifficulty - total;
        if (total > 0 && distance >= 0 && distance < bestDistance) {
            bestDistance = distance;
            bestResult = {
                selected: selected.slice(),
                skipped: skipped.slice(),
                cardsDrawn: cardsDrawn,
                attempts: attempt + 1,
                closeMatch: distance > 0,
                distance: distance
            };
        }

        if (total >= targetDifficulty - CONSTANTS.CLOSE_MATCH_THRESHOLD && total <= targetDifficulty) {
            return { selected: selected, skipped: skipped, cardsDrawn: cardsDrawn, attempts: attempt + 1, closeMatch: distance > 0, distance: distance };
        }
    }

    return bestResult;
}

/**
 * Select missions using the greedy method (legacy).
 * Iterates through shuffled missions and greedily picks those that fit.
 */
function selectMissionsGreedy(missions, numPlayers, targetDifficulty, maxAttempts) {
    maxAttempts = maxAttempts || CONSTANTS.GREEDY_MAX_ATTEMPTS;
    var playerKey = numPlayers + '_players';
    var bestResult = null;
    var bestDistance = Infinity;

    for (var attempt = 0; attempt < maxAttempts; attempt++) {
        var shuffledMissions = shuffleArray(missions);
        var selected = [];
        var total = 0;

        for (var i = 0; i < shuffledMissions.length; i++) {
            var mission = shuffledMissions[i];
            var difficulty = mission.difficulty[playerKey];
            if (total + difficulty <= targetDifficulty) {
                selected.push({
                    id: mission.id,
                    difficulty: difficulty,
                    description: mission.description
                });
                total += difficulty;

                if (total === targetDifficulty) {
                    return { selected: selected, skipped: [], cardsDrawn: selected.length, attempts: attempt + 1, exactMatch: true };
                }
            }
        }

        var distance = targetDifficulty - total;
        if (total > 0 && distance >= 0 && distance < bestDistance) {
            bestDistance = distance;
            bestResult = {
                selected: selected.slice(),
                skipped: [],
                cardsDrawn: selected.length,
                attempts: attempt + 1,
                closeMatch: distance > 0,
                distance: distance
            };
        }

        if (total >= targetDifficulty - CONSTANTS.CLOSE_MATCH_THRESHOLD && total <= targetDifficulty) {
            return { selected: selected, skipped: [], cardsDrawn: selected.length, attempts: attempt + 1, closeMatch: distance > 0, distance: distance };
        }
    }

    return bestResult;
}
