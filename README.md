# The Crew Mission Generator 🚀

A mission generator for the cooperative card game "The Crew: The Quest for Planet Nine" that creates custom mission combinations summing up to a target difficulty for different player counts.

## 🌟 Features

- **Web Interface**: Beautiful, responsive web UI hosted on GitHub Pages
- **Python CLI**: Command-line interface for programmatic use
- **Multiple Mission Sets**: Choose from Classic, Custom, or Mixed missions
- **Flexible Difficulty**: Generate missions that sum to any target difficulty
- **Player Support**: Optimized for 3, 4, or 5 players
- **Extensive Mission Database**: 96+ classic missions + 25 innovative custom missions

## 🎮 Web Interface

Visit the live web interface at: **[https://sn2b.github.io/the-crew-mission-creator/](https://sn2b.github.io/the-crew-mission-creator/)**

### Features:
- 🎯 Interactive mission generation
- 📱 Mobile-friendly responsive design
- 🎲 Randomized mission selection
- 🔄 Easy parameter adjustment
- 📊 Mission difficulty breakdown
- ⭐ Multiple mission sets (Classic, Custom, Mixed)
- 🎨 Visual mission type indicators

## 🖥️ Command Line Usage

### Requirements
- Python 3.6+

### Usage
```bash
# Generate classic missions (default)
python3 mission_generator.py --players 4 --difficulty 10

# Use custom missions
python3 mission_generator.py --players 4 --difficulty 10 --missions custom

# Use mixed missions (classic + custom)
python3 mission_generator.py --players 4 --difficulty 10 --missions mixed
```

### Parameters
- `--players`: Number of players (3, 4, or 5)
- `--difficulty`: Target total difficulty (integer)
- `--missions`: Mission set to use: `classic`, `custom`, or `mixed` (optional, defaults to `classic`)

### Example Output
```
Selected Classic missions for 4 players (total difficulty 10):
  🎯 Mission 16: (1) Win the pink 3
  🎯 Mission 67: (1) Don't win any 9s
  🎯 Mission 79: (1) Win the first trick
  🎯 Mission 23: (2) Win at least two 7s.
  🎯 Mission 76: (3) Win the last trick
  🎯 Mission 9: (2) Win a trick with a 6.
```

```
Selected Custom missions for 4 players (total difficulty 12):
  ⭐ Mission 101: (4) Win tricks in ascending order of card values (lowest to highest)
  ⭐ Mission 106: (2) Win the highest and lowest valued cards in the game
  ⭐ Mission 112: (1) Win more red cards (pink) than any other single color
  ⭐ Mission 116: (2) Win cards whose values create a Fibonacci sequence (1,1,2,3,5,8...)
  ⭐ Mission 120: (3) Win a trick where the total value equals the trick number
```

## 📁 Project Structure

```
├── index.html              # Web interface
├── missions/
│   ├── classic.txt         # Original mission data (text format)
│   ├── classic.json        # Classic missions (JSON format)
│   └── custom.json         # Custom missions (JSON format)
├── mission_generator.py    # Python CLI tool
├── .github/workflows/
│   └── pages.yml          # GitHub Pages deployment
└── README.md              # This file
```

## 🗃️ Mission Data Format

The missions are stored in JSON format with the following structure:

```json
{
  "missions": [
    {
      "id": 1,
      "difficulty": {
        "3_players": 2,
        "4_players": 3,
        "5_players": 3
      },
      "description": "Win more tricks than everyone else"
    }
  ]
}
```

## 🎨 Mission Types

### **Classic Missions (ID 1-96)** 🎯
- Original missions from "The Crew" game
- Balanced difficulty progression
- Time-tested gameplay mechanics
- Examples: "Win more tricks than everyone else", "Win the pink 3", "Don't win any 9s"

### **Custom Missions (ID 101-125)** ⭐
- 25 innovative new missions
- Advanced strategic challenges
- Mathematical and pattern-based objectives
- Examples:
  - **Pattern Missions**: Win tricks in ascending order, create arithmetic sequences
  - **Strategic Challenges**: Win exactly one trick of each color, never repeat card values
  - **Mathematical Missions**: Fibonacci sequences, prime vs composite numbers
  - **Advanced Constraints**: Alphabetical color order, bookend patterns

## 🚀 Deployment

The web interface is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

To deploy your own version:

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. Select "GitHub Actions" as the source
4. Push changes to trigger automatic deployment

## 🎲 How It Works

1. **Mission Selection**: The generator randomly shuffles available missions from your chosen set
2. **Greedy Algorithm**: Selects missions that fit within the target difficulty
3. **Exact Matching**: Only returns combinations that exactly match the target
4. **Player Optimization**: Uses difficulty values specific to the player count
5. **Mission Set Support**: Choose from Classic (traditional), Custom (innovative), or Mixed (both)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 About The Crew

"The Crew: The Quest for Planet Nine" is a cooperative trick-taking card game where players work together to complete missions. This generator helps create varied and balanced mission combinations for enhanced gameplay experience.

---

*Made with ❤️ for The Crew enthusiasts*
