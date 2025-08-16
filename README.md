# The Crew Mission Generator 🚀

A mission generator for the cooperative card game "The Crew: The Quest for Planet Nine" that creates custom mission combinations summing up to a target difficulty for different player counts.

## 🌟 Features

- **Web Interface**: Beautiful, responsive web UI hosted on GitHub Pages
- **Python CLI**: Command-line interface for programmatic use
- **Flexible Difficulty**: Generate missions that sum to any target difficulty
- **Player Support**: Optimized for 3, 4, or 5 players
- **Mission Database**: Complete set of classic missions with structured data

## 🎮 Web Interface

Visit the live web interface at: **[https://sn2b.github.io/the-crew-mission-creator/](https://sn2b.github.io/the-crew-mission-creator/)**

### Features:
- 🎯 Interactive mission generation
- 📱 Mobile-friendly responsive design
- 🎲 Randomized mission selection
- 🔄 Easy parameter adjustment
- 📊 Mission difficulty breakdown

## 🖥️ Command Line Usage

### Requirements
- Python 3.6+

### Usage
```bash
python3 mission_generator.py --players 4 --difficulty 10
```

### Parameters
- `--players`: Number of players (3, 4, or 5)
- `--difficulty`: Target total difficulty (integer)
- `--file`: Path to missions file (optional, defaults to `missions/classic.json`)

### Example Output
```
Selected missions for 4 players (total difficulty 10):
  Mission 16: (1) Win the pink 3
  Mission 67: (1) Don't win any 9s
  Mission 79: (1) Win the first trick
  Mission 23: (2) Win at least two 7s.
  Mission 76: (3) Win the last trick
  Mission 9: (3) Win a trick with a 6.
```

## 📁 Project Structure

```
├── index.html              # Web interface
├── missions/
│   ├── classic.txt         # Original mission data (text format)
│   └── classic.json        # Structured mission data (JSON format)
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

## 🚀 Deployment

The web interface is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

To deploy your own version:

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. Select "GitHub Actions" as the source
4. Push changes to trigger automatic deployment

## 🎲 How It Works

1. **Mission Selection**: The generator randomly shuffles available missions
2. **Greedy Algorithm**: Selects missions that fit within the target difficulty
3. **Exact Matching**: Only returns combinations that exactly match the target
4. **Player Optimization**: Uses difficulty values specific to the player count

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
