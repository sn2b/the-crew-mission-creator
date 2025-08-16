import json
import random
from typing import List, Tuple

def parse_missions(file_path: str):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    missions = []
    for mission in data['missions']:
        missions.append({
            'id': mission['id'],
            'difficulty': [
                mission['difficulty']['3_players'],
                mission['difficulty']['4_players'],
                mission['difficulty']['5_players']
            ],
            'description': mission['description']
        })
    return missions

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
    parser.add_argument('--file', type=str, default='missions/classic.json', help='Path to missions file')
    args = parser.parse_args()

    missions = parse_missions(args.file)
    result = select_missions(missions, args.players, args.difficulty)
    if not result:
        print('No combination found for the given difficulty.')
    else:
        print(f'Selected missions for {args.players} players (total difficulty {args.difficulty}):')
        for mission_id, diff, desc in result:
            print(f'  Mission {mission_id}: ({diff}) {desc}')

if __name__ == '__main__':
    main()
