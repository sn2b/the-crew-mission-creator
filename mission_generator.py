import json
import random
from typing import List, Tuple

def parse_modifiers(file_path: str):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modifiers = []
    for modifier in data['modifiers']:
        modifiers.append({
            'id': modifier['id'],
            'name': modifier['name'],
            'symbol': modifier['symbol'],
            'description': modifier['description'],
            'difficulty_modifier': [
                modifier['difficulty_modifier']['3_players'],
                modifier['difficulty_modifier']['4_players'],
                modifier['difficulty_modifier']['5_players']
            ],
            'rules_text': modifier['rules_text']
        })
    return modifiers

def select_random_modifiers(modifiers: List[dict], num_modifiers: int = 1):
    """Select random modifiers"""
    if not modifiers or num_modifiers <= 0:
        return []
    
    selected = random.sample(modifiers, min(num_modifiers, len(modifiers)))
    return selected

def parse_missions(file_paths: List[str]):
    all_missions = []
    for file_path in file_paths:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for mission in data['missions']:
            all_missions.append({
                'id': mission['id'],
                'difficulty': [
                    mission['difficulty']['3_players'],
                    mission['difficulty']['4_players'],
                    mission['difficulty']['5_players']
                ],
                'description': mission['description']
            })
    return all_missions

def select_missions_deck_draw(missions: List[dict], num_players: int, target_difficulty: int) -> List[Tuple[int, int, str]]:
    """
    Simulate drawing task cards from a shuffled deck according to official rules:
    Keep drawing cards until the sum matches the target difficulty exactly.
    Skip cards that would exceed the target.
    """
    idx = num_players - 3
    # Shuffle the deck of missions
    shuffled_missions = missions.copy()
    random.shuffle(shuffled_missions)
    
    selected = []
    total = 0
    cards_drawn = 0
    skipped_cards = []
    
    for mission in shuffled_missions:
        cards_drawn += 1
        diff = mission['difficulty'][idx]
        
        if total + diff <= target_difficulty:
            # We can take this card
            selected.append((mission['id'], diff, mission['description']))
            total += diff
            
            if total == target_difficulty:
                # We've reached the exact target
                break
        else:
            # Skip this card as it would exceed the target
            skipped_cards.append((mission['id'], diff, mission['description']))
    
    if total != target_difficulty:
        return []  # Couldn't reach exact target with available cards
    
    return selected

def select_missions(missions: List[dict], num_players: int, target_difficulty: int) -> List[Tuple[int, int, str]]:
    """
    Legacy greedy selection method (kept for compatibility)
    """
    idx = num_players - 3
    # Simple greedy random approach
    random.shuffle(missions)
    selected = []
    total = 0
    for mission in missions:
        diff = mission['difficulty'][idx]
        if total + diff <= target_difficulty:
            selected.append((mission['id'], diff, mission['description']))
            total += diff
        if total == target_difficulty:
            break
    if total != target_difficulty:
        return []  # No exact match found
    return selected

def main():
    import argparse
    parser = argparse.ArgumentParser(description='The Crew Mission Generator')
    parser.add_argument('--players', type=int, choices=[3,4,5], required=True, help='Number of players (3, 4, or 5)')
    parser.add_argument('--difficulty', type=int, required=True, help='Target total difficulty')
    parser.add_argument('--missions', type=str, choices=['classic', 'custom', 'mixed'], default='classic', 
                        help='Mission set to use: classic, custom, or mixed')
    parser.add_argument('--method', type=str, choices=['deck', 'greedy'], default='deck',
                        help='Selection method: deck (official rules) or greedy (legacy)')
    parser.add_argument('--modifiers', type=int, default=0, help='Number of random modifiers to add (0-3)')
    args = parser.parse_args()

    # Determine which files to load
    file_paths = []
    if args.missions in ['classic', 'mixed']:
        file_paths.append('missions/classic.json')
    if args.missions in ['custom', 'mixed']:
        file_paths.append('missions/custom.json')

    missions = parse_missions(file_paths)
    
    # Load and select modifiers
    selected_modifiers = []
    modifier_difficulty = 0
    if args.modifiers > 0:
        try:
            modifiers = parse_modifiers('missions/modifiers.json')
            selected_modifiers = select_random_modifiers(modifiers, args.modifiers)
            idx = args.players - 3
            modifier_difficulty = sum(mod['difficulty_modifier'][idx] for mod in selected_modifiers)
        except FileNotFoundError:
            print("Warning: modifiers.json not found. Continuing without modifiers.")
    
    # Adjust target difficulty for missions
    mission_target_difficulty = args.difficulty - modifier_difficulty
    
    if mission_target_difficulty <= 0:
        print(f'Error: Target difficulty too low for selected modifiers. Modifiers add {modifier_difficulty} difficulty.')
        return
    
    # Choose selection method
    if args.method == 'deck':
        result = select_missions_deck_draw(missions, args.players, mission_target_difficulty)
        method_name = "Official Deck Draw"
    else:
        result = select_missions(missions, args.players, mission_target_difficulty)
        method_name = "Greedy Selection"
    
    if not result:
        print(f'No combination found for the given difficulty using {args.missions} missions with {method_name.lower()}.')
    else:
        mission_type = args.missions.capitalize()
        mission_difficulty = sum(diff for _, diff, _ in result)
        total_difficulty = mission_difficulty + modifier_difficulty
        
        print(f'{method_name}: Selected {mission_type} missions for {args.players} players')
        print(f'(Mission Difficulty: {mission_difficulty}' + (f' + Modifier Difficulty: {modifier_difficulty} = Total: {total_difficulty})' if modifier_difficulty > 0 else ')'))
        print()
        
        # Show modifiers first
        if selected_modifiers:
            print("🌟 ACTIVE MODIFIERS:")
            for modifier in selected_modifiers:
                idx = args.players - 3
                modifier_description = modifier["description"]
                modifier_rules = modifier["rules_text"]
                
                # Add timer suggestion for Real-Time Missions
                if modifier["id"] == "real_time_missions":
                    suggested_time = max(1, total_difficulty)  # 1 minute per difficulty point, minimum 1 minute
                    modifier_description += f" Suggested timer: {suggested_time} minute{'s' if suggested_time != 1 else ''}."
                    modifier_rules = f"Set a {suggested_time}-minute timer after task allocation. {modifier_rules}"
                
                print(f'  {modifier["symbol"]} {modifier["name"]} (+{modifier["difficulty_modifier"][idx]})')
                print(f'    {modifier_description}')
                print(f'    Rules: {modifier_rules}')
                print()
        
        print("🎯 MISSIONS:")
        for mission_id, diff, desc in result:
            mission_icon = "⭐" if mission_id >= 101 else "🎯"
            print(f'  {mission_icon} Mission {mission_id}: ({diff}) {desc}')

if __name__ == '__main__':
    main()
