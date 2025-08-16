import json
import random
from typing import List, Tuple

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

def select_missions(missions: List[dict], num_players: int, target_difficulty: int) -> List[Tuple[int, int, str]]:
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
    args = parser.parse_args()

    # Determine which files to load
    file_paths = []
    if args.missions in ['classic', 'mixed']:
        file_paths.append('missions/classic.json')
    if args.missions in ['custom', 'mixed']:
        file_paths.append('missions/custom.json')

    missions = parse_missions(file_paths)
    result = select_missions(missions, args.players, args.difficulty)
    if not result:
        print(f'No combination found for the given difficulty using {args.missions} missions.')
    else:
        mission_type = args.missions.capitalize()
        print(f'Selected {mission_type} missions for {args.players} players (total difficulty {args.difficulty}):')
        for mission_id, diff, desc in result:
            mission_icon = "⭐" if mission_id >= 101 else "🎯"
            print(f'  {mission_icon} Mission {mission_id}: ({diff}) {desc}')

if __name__ == '__main__':
    main()
