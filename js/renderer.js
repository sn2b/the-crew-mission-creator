/**
 * Escape a string for safe insertion into HTML.
 */
function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Render an error message with optional suggestion bullets.
 */
function renderError(title, suggestions) {
    var html = '<div class="error">' + escapeHTML(title);
    if (suggestions && suggestions.length > 0) {
        html += '<br><br>';
        for (var i = 0; i < suggestions.length; i++) {
            html += '<br>\u2022 ' + escapeHTML(suggestions[i]);
        }
    }
    html += '</div>';
    return html;
}

/**
 * Render the loading state with a CSS spinner.
 */
function renderLoading(methodName, missionSetName) {
    return '<div class="loading">' +
        '<span class="loading-spinner"></span> ' +
        'Generating missions using ' + escapeHTML(methodName) +
        ' from ' + escapeHTML(missionSetName) + '...' +
        '</div>';
}

/**
 * Render the default empty state.
 */
function renderNoResults() {
    return '<div class="no-results">' +
        '<span aria-hidden="true">\uD83C\uDFB2</span> Select your parameters and click "Generate Missions" to get started!' +
        '</div>';
}

/**
 * Render the full results view (stats, warnings, modifiers, missions, skipped).
 *
 * @param {Object} result   — algorithm result object
 * @param {Object} params   — { players, difficulty, method, missionSetName, methodName,
 *                              selectedModifiers, modifierDifficulty, missionTargetDifficulty,
 *                              playerKey }
 */
function renderResults(result, params) {
    var missionDifficulty = 0;
    for (var i = 0; i < result.selected.length; i++) {
        missionDifficulty += result.selected[i].difficulty;
    }
    var totalDifficulty = missionDifficulty + params.modifierDifficulty;
    var methodIcon = params.method === 'deck' ? '\uD83D\uDCDA' : '\uD83C\uDFB2';

    // --- Stats header ---
    var html = '<div class="stats">' +
        methodIcon + ' ' + escapeHTML(params.methodName) + ': Found ' +
        result.selected.length + ' mission' + (result.selected.length !== 1 ? 's' : '') +
        ' for ' + params.players + ' players using ' + escapeHTML(params.missionSetName) +
        '<br>(Mission Difficulty: ' + missionDifficulty;

    if (params.modifierDifficulty !== 0) {
        html += ' ' + (params.modifierDifficulty >= 0 ? '+' : '') +
            ' Modifier Difficulty: ' + params.modifierDifficulty +
            ' = Total: ' + totalDifficulty;
    }
    html += ')';

    if (params.method === 'deck' && result.skipped && result.skipped.length > 0) {
        html += '<br><span aria-hidden="true">\uD83D\uDCE4</span> Cards drawn from deck: ' +
            result.cardsDrawn + ' | Skipped: ' + result.skipped.length;
    }

    // Copy button
    html += '<br><button class="btn-copy" id="copyBtn" type="button" aria-label="Copy results to clipboard">' +
        '<span aria-hidden="true">\uD83D\uDCCB</span> Copy Results</button>';
    html += '</div>';

    // --- High difficulty warning ---
    var maxRounds = CONSTANTS.MAX_ROUNDS[params.players];
    if (totalDifficulty >= CONSTANTS.HIGH_DIFFICULTY_THRESHOLD) {
        html += '<div class="info-box">' +
            '<span aria-hidden="true">\uD83D\uDCA1</span> <strong>High Difficulty Challenge:</strong> With ' +
            params.players + ' players, you have only ' + maxRounds + ' rounds (' +
            CONSTANTS.TOTAL_CARDS + ' cards \u00F7 ' + params.players +
            ' players) to complete these missions. ' +
            'This is quite challenging \u2014 give it your best shot and remember that communication and teamwork are key!' +
            '</div>';
    }

    // --- Distance warning ---
    if (result.distance && result.distance > CONSTANTS.DISTANCE_WARNING_THRESHOLD) {
        html += '<div class="warning-box">' +
            '<span aria-hidden="true">\u26A0\uFE0F</span> <strong>Note:</strong> Could not reach target difficulty ' +
            params.difficulty + '. The best combination found was ' + result.distance + ' points lower.' +
            '<br><br><small>Try: lowering the target difficulty, using a different mission set, or adjusting modifiers.</small>' +
            '</div>';
    }

    // --- Modifier cards ---
    if (params.selectedModifiers && params.selectedModifiers.length > 0) {
        for (var m = 0; m < params.selectedModifiers.length; m++) {
            var modifier = params.selectedModifiers[m];
            var modDesc = modifier.description;
            var modRules = modifier.rules_text;

            if (modifier.id === 'real_time_missions') {
                var suggestedTime = Math.max(1, totalDifficulty);
                modDesc += ' Suggested timer: ' + suggestedTime + ' minute' + (suggestedTime !== 1 ? 's' : '') + '.';
                modRules = 'Set a ' + suggestedTime + '-minute timer after task allocation. ' + modRules;
            }

            html += '<div class="modifier-card">' +
                '<div class="modifier-header">' +
                '<div><span class="modifier-symbol">' + escapeHTML(modifier.symbol) + '</span> ' +
                '<span class="modifier-name">' + escapeHTML(modifier.name) + '</span></div>' +
                '<span class="modifier-difficulty">' +
                (modifier.difficulty_modifier[params.playerKey] >= 0 ? '+' : '') +
                modifier.difficulty_modifier[params.playerKey] + '</span>' +
                '</div>' +
                '<div class="modifier-description">' + escapeHTML(modDesc) + '</div>' +
                '<div class="modifier-rules">Rules: ' + escapeHTML(modRules) + '</div>' +
                '</div>';
        }
    }

    // --- Mission cards ---
    for (var j = 0; j < result.selected.length; j++) {
        var mission = result.selected[j];
        var isCustom = mission.id >= CONSTANTS.CUSTOM_MISSION_ID_START;
        var typeIcon = isCustom ? '\u2B50' : '\uD83C\uDFAF';
        var typeLabel = isCustom ? 'Custom' : 'Classic';

        html += '<div class="mission-card">' +
            '<div class="mission-header">' +
            '<span class="mission-id">' + typeIcon + ' Mission ' + mission.id +
            '<span class="sr-only"> (' + typeLabel + ')</span></span>' +
            '<span class="mission-difficulty">Difficulty: ' + mission.difficulty +
            '</span></div>' +
            '<div class="mission-description">' + escapeHTML(mission.description) + '</div>' +
            '</div>';
    }

    // --- Skipped cards (deck draw only) ---
    if (params.method === 'deck' && result.skipped && result.skipped.length > 0) {
        html += '<div class="skipped-section">' +
            '<h4><span aria-hidden="true">\uD83D\uDCE4</span> Skipped Cards (would exceed target):</h4>' +
            '<div class="skipped-list">';

        var shown = result.skipped.slice(0, CONSTANTS.MAX_SKIPPED_SHOWN);
        var parts = [];
        for (var k = 0; k < shown.length; k++) {
            var sk = shown[k];
            var skCustom = sk.id >= CONSTANTS.CUSTOM_MISSION_ID_START;
            var skIcon = skCustom ? '\u2B50' : '\uD83C\uDFAF';
            parts.push(skIcon + ' Mission ' + sk.id + ' (' + sk.difficulty + ')');
        }
        html += parts.join(', ');

        if (result.skipped.length > CONSTANTS.MAX_SKIPPED_SHOWN) {
            html += '... and ' + (result.skipped.length - CONSTANTS.MAX_SKIPPED_SHOWN) + ' more';
        }

        html += '</div></div>';
    }

    return html;
}

/**
 * Generate a plain-text summary of results for clipboard copy.
 */
function generatePlainTextSummary(result, params) {
    var missionDifficulty = 0;
    for (var i = 0; i < result.selected.length; i++) {
        missionDifficulty += result.selected[i].difficulty;
    }
    var totalDifficulty = missionDifficulty + params.modifierDifficulty;

    var lines = [
        'The Crew Mission Generator Results',
        '===================================',
        'Players: ' + params.players + ' | Target Difficulty: ' + params.difficulty + ' | Method: ' + params.methodName,
        'Mission Set: ' + params.missionSetName,
        ''
    ];

    if (params.selectedModifiers && params.selectedModifiers.length > 0) {
        lines.push('Modifiers:');
        for (var m = 0; m < params.selectedModifiers.length; m++) {
            var mod = params.selectedModifiers[m];
            var sign = mod.difficulty_modifier[params.playerKey] >= 0 ? '+' : '';
            lines.push('  ' + mod.symbol + ' ' + mod.name + ' (' + sign + mod.difficulty_modifier[params.playerKey] + ')');
        }
        lines.push('');
    }

    lines.push('Missions:');
    for (var j = 0; j < result.selected.length; j++) {
        var mission = result.selected[j];
        var isCustom = mission.id >= CONSTANTS.CUSTOM_MISSION_ID_START;
        var type = isCustom ? 'Custom' : 'Classic';
        lines.push('  ' + (j + 1) + '. [' + type + '] Mission #' + mission.id +
            ' (Difficulty: ' + mission.difficulty + ') - ' + mission.description);
    }

    lines.push('');
    var diffLine = 'Total Difficulty: ' + totalDifficulty;
    if (params.modifierDifficulty !== 0) {
        diffLine += ' (Missions: ' + missionDifficulty + ' + Modifiers: ' + params.modifierDifficulty + ')';
    }
    lines.push(diffLine);

    return lines.join('\n');
}
