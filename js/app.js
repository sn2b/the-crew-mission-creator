// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------
var classicMissions = null;
var customMissions = null;
var modifiersData = null;
var lastResult = null;
var lastParams = null;

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

/**
 * Load all mission and modifier JSON files.
 */
async function loadMissions() {
    try {
        var responses = await Promise.all([
            fetch('missions/classic.json'),
            fetch('missions/custom.json'),
            fetch('missions/modifiers.json')
        ]);

        if (!responses[0].ok) throw new Error('Failed to load classic missions data');
        if (!responses[1].ok) throw new Error('Failed to load custom missions data');
        if (!responses[2].ok) throw new Error('Failed to load modifiers data');

        classicMissions = await responses[0].json();
        customMissions  = await responses[1].json();
        modifiersData   = await responses[2].json();

        console.log('Data loaded:',
            classicMissions.missions.length, 'classic missions,',
            customMissions.missions.length, 'custom missions,',
            modifiersData.modifiers.length, 'modifiers');

        updateMissionCount();
        updateDifficultyRange();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('results').innerHTML =
            renderError('\u274C Error loading game data. Please make sure all files are available.');
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the missions array for the given mission set key.
 */
function getSelectedMissions(missionSet) {
    switch (missionSet) {
        case 'classic':
            return classicMissions ? classicMissions.missions : [];
        case 'custom':
            return customMissions ? customMissions.missions : [];
        case 'mixed':
            if (!classicMissions || !customMissions) return [];
            return classicMissions.missions.concat(customMissions.missions);
        default:
            return [];
    }
}

/**
 * Update the mission-count indicator below the Mission Set dropdown.
 */
function updateMissionCount() {
    var missionSet = document.getElementById('missionSet').value;
    var missions = getSelectedMissions(missionSet);
    var el = document.getElementById('missionCount');
    if (el) {
        el.textContent = missions.length + ' missions available';
    }
}

/**
 * Update the difficulty-range hint below the difficulty input.
 */
function updateDifficultyRange() {
    var missionSet = document.getElementById('missionSet').value;
    var players = parseInt(document.getElementById('players').value);
    var missions = getSelectedMissions(missionSet);
    var el = document.getElementById('difficultyRange');
    var input = document.getElementById('difficulty');

    if (!missions.length || !el) return;

    var playerKey = players + '_players';
    var min = Infinity;
    var maxTotal = 0;
    for (var i = 0; i < missions.length; i++) {
        var d = missions[i].difficulty[playerKey];
        if (d < min) min = d;
        maxTotal += d;
    }

    el.textContent = 'Range for ' + players + ' players: ' + min + ' \u2013 ' + maxTotal;
    if (input) {
        input.max = maxTotal;
    }
}

// ---------------------------------------------------------------------------
// Main generation
// ---------------------------------------------------------------------------

/**
 * Generate missions based on the current form parameters.
 */
function generateMissions() {
    var missionSet = document.getElementById('missionSet').value;
    var selectedMissions = getSelectedMissions(missionSet);
    var resultsEl = document.getElementById('results');

    if (!selectedMissions || selectedMissions.length === 0) {
        resultsEl.innerHTML = renderError('\u274C Missions data not loaded yet. Please wait and try again.');
        return;
    }

    var players          = parseInt(document.getElementById('players').value);
    var difficulty        = parseInt(document.getElementById('difficulty').value);
    var method            = document.getElementById('method').value;
    var modifierSetting   = document.getElementById('useModifiers').value;
    var missionSetSelect  = document.getElementById('missionSet');
    var methodSelect      = document.getElementById('method');
    var missionSetName    = missionSetSelect.options[missionSetSelect.selectedIndex].text;
    var methodName        = methodSelect.options[methodSelect.selectedIndex].text;

    if (!difficulty || difficulty < CONSTANTS.MIN_DIFFICULTY) {
        resultsEl.innerHTML = renderError('\u274C Please enter a valid target difficulty (minimum ' + CONSTANTS.MIN_DIFFICULTY + ').');
        return;
    }

    // Persist settings
    saveSettings({
        players: players,
        difficulty: difficulty,
        method: method,
        missionSet: missionSet,
        modifierSetting: modifierSetting
    });

    // Modifiers
    var selectedModifiers = selectModifiers(players, modifierSetting, modifiersData);
    var modifierDifficulty = calculateModifierDifficulty(selectedModifiers, players);
    var playerKey = players + '_players';
    var missionTargetDifficulty = difficulty - modifierDifficulty;

    if (missionTargetDifficulty <= 0) {
        resultsEl.innerHTML = renderError(
            '\u274C Target difficulty too low for selected modifiers. Modifiers add ' + modifierDifficulty + ' difficulty.'
        );
        return;
    }

    // Show loading state
    resultsEl.innerHTML = renderLoading(methodName, missionSetName);

    var startTime = Date.now();

    // Small delay so the loading state renders before the CPU-bound algorithm runs
    setTimeout(function () {
        var timeoutId;
        var hasTimedOut = false;

        timeoutId = setTimeout(function () {
            hasTimedOut = true;
            resultsEl.innerHTML = renderError(
                '\u23F0 Mission generation timed out after ' + (CONSTANTS.TIMEOUT_MS / 1000) + ' seconds.',
                [
                    'Using a different target difficulty',
                    'Switching between Deck Draw and Greedy Selection',
                    'Using a different mission set (Classic/Custom/Mixed)'
                ]
            );
        }, CONSTANTS.TIMEOUT_MS);

        var result;
        try {
            if (method === 'deck') {
                result = selectMissionsDeckDraw(selectedMissions, players, missionTargetDifficulty);
            } else {
                result = selectMissionsGreedy(selectedMissions, players, missionTargetDifficulty);
            }

            clearTimeout(timeoutId);
            if (hasTimedOut) return;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Mission generation error:', error);
            resultsEl.innerHTML = renderError(
                '\u274C An error occurred during mission generation: ' + error.message,
                ['Please try again or adjust your parameters.']
            );
            return;
        }

        var params = {
            players: players,
            difficulty: difficulty,
            method: method,
            missionSetName: missionSetName,
            methodName: methodName,
            selectedModifiers: selectedModifiers,
            modifierDifficulty: modifierDifficulty,
            missionTargetDifficulty: missionTargetDifficulty,
            playerKey: playerKey,
            startTime: startTime
        };

        if (!result || result.selected.length === 0) {
            var elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
            resultsEl.innerHTML = renderError(
                '\uD83D\uDE14 Unable to generate missions for ' + players + ' players with difficulty ' +
                difficulty + ' using ' + methodName + ' and ' + missionSetName + '. (Searched for ' + elapsedTime + 's)',
                [
                    'Target difficulty is too low (try increasing it)',
                    "Mission set doesn't have suitable combinations",
                    'Modifiers make the target impossible to reach'
                ]
            );
            return;
        }

        // Store for clipboard copy
        lastResult = result;
        lastParams = params;

        resultsEl.innerHTML = renderResults(result, params);

        // Attach copy handler (button is created by renderResults)
        var copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', copyResultsToClipboard);
        }
    }, CONSTANTS.LOADING_DELAY_MS);
}

// ---------------------------------------------------------------------------
// Clipboard
// ---------------------------------------------------------------------------

/**
 * Copy the last generated results to the clipboard as plain text.
 */
function copyResultsToClipboard() {
    if (!lastResult || !lastParams) return;

    var text = generatePlainTextSummary(lastResult, lastParams);
    var btn = document.getElementById('copyBtn');

    function showCopied() {
        if (!btn) return;
        btn.classList.add('copied');
        btn.innerHTML = '<span aria-hidden="true">\u2705</span> Copied!';
        setTimeout(function () {
            btn.classList.remove('copied');
            btn.innerHTML = '<span aria-hidden="true">\uD83D\uDCCB</span> Copy Results';
        }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(function () {
            fallbackCopy(text, showCopied);
        });
    } else {
        fallbackCopy(text, showCopied);
    }
}

function fallbackCopy(text, onSuccess) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        onSuccess();
    } catch (e) {
        // copy failed — ignore
    }
    document.body.removeChild(textarea);
}

// ---------------------------------------------------------------------------
// Clear
// ---------------------------------------------------------------------------

function clearResults() {
    lastResult = null;
    lastParams = null;
    document.getElementById('results').innerHTML = renderNoResults();
}

// ---------------------------------------------------------------------------
// Settings restore
// ---------------------------------------------------------------------------

function applySavedSettings() {
    var settings = loadSavedSettings();
    if (!settings) return;

    var mapping = {
        players: settings.players,
        difficulty: settings.difficulty,
        method: settings.method,
        missionSet: settings.missionSet,
        useModifiers: settings.modifierSetting
    };

    var ids = Object.keys(mapping);
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var el = document.getElementById(id);
        if (el && mapping[id] != null) {
            el.value = mapping[id];
        }
    }
}

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    // Restore saved settings before data load so counts/ranges reflect them
    applySavedSettings();

    // Keyboard shortcut: Enter in difficulty field triggers generation
    document.getElementById('difficulty').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            generateMissions();
        }
    });

    // Button listeners
    document.getElementById('generateBtn').addEventListener('click', generateMissions);
    document.getElementById('clearBtn').addEventListener('click', clearResults);

    // Update info displays when selections change
    document.getElementById('missionSet').addEventListener('change', function () {
        updateMissionCount();
        updateDifficultyRange();
    });
    document.getElementById('players').addEventListener('change', updateDifficultyRange);

    // Load mission data (async — updates counts when done)
    loadMissions();
});
