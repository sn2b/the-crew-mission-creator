/**
 * Select random modifiers based on the modifier setting.
 */
function selectModifiers(numPlayers, modifierSetting, modifiersData) {
    if (!modifiersData || modifierSetting === 'none') {
        return [];
    }

    var availableModifiers = modifiersData.modifiers;

    if (modifierSetting === 'random') {
        var randomIndex = Math.floor(Math.random() * availableModifiers.length);
        return [availableModifiers[randomIndex]];
    }

    if (modifierSetting === 'multiple') {
        var numModifiers = Math.floor(Math.random() * CONSTANTS.MAX_MODIFIERS_MULTIPLE) + 1;
        var shuffled = shuffleArray(availableModifiers);
        return shuffled.slice(0, numModifiers);
    }

    return [];
}

/**
 * Calculate the total difficulty contribution from modifiers for a player count.
 */
function calculateModifierDifficulty(modifiers, numPlayers) {
    if (!modifiers || modifiers.length === 0) return 0;
    var playerKey = numPlayers + '_players';
    var total = 0;
    for (var i = 0; i < modifiers.length; i++) {
        total += modifiers[i].difficulty_modifier[playerKey];
    }
    return total;
}
