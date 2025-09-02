# The Crew Mission Generator 🚀

A powerful web-based mission generator for "The Crew: Mission Deep Sea" that creates custom mission combinations summing to any target difficulty level across different player counts.

## 🌟 Features

- **Web Interface**: Beautiful, responsive web UI hosted on GitHub Pages
- **Multiple Mission Sets**: Choose from Classic, Custom, or Mixed missions
- **Flexible Difficulty**: Generate missions that sum to any target difficulty
- **Player Support**: Optimized for 3, 4, or 5 players
- **Extensive Mission Database**: 96+ classic missions + 25 innovative custom missions
- **Official Rules Support**: Deck draw method following official game rules
- **Modifiers Support**: Add challenge modifiers to increase difficulty and variety

## 🎮 Web Interface

Visit the live web interface at: **[https://sn2b.github.io/the-crew-mission-creator/](https://sn2b.github.io/the-crew-mission-creator/)**

### Features:
- 🎯 Interactive mission generation for "The Crew: Mission Deep Sea"
- 📱 Mobile-friendly responsive design
- 🎲 Two selection methods: Official Deck Draw and Greedy Selection
- 🔄 Easy parameter adjustment
- 📊 Mission difficulty breakdown
- ⭐ Multiple mission sets (Classic, Custom, Mixed)
- 🎨 Visual mission type indicators
- 🌟 Challenge modifiers for added variety

## 📁 Project Structure

```
├── index.html              # Mission Generator Web interface
├── missions/
│   ├── classic.json        # Classic missions (JSON format)
│   ├── custom.json         # Custom missions (JSON format)
│   └── modifiers.json      # Challenge modifiers (JSON format)
├── .github/workflows/
│   └── pages.yml          # GitHub Pages deployment
└── README.md              # This file
```

## � Quick Start

Simply visit **[https://sn2b.github.io/the-crew-mission-creator/](https://sn2b.github.io/the-crew-mission-creator/)** and start generating missions!

1. Select your player count (3, 4, or 5)
2. Choose target difficulty
3. Pick mission set (Classic, Custom, or Mixed)
4. Optionally add challenge modifiers
5. Click "Generate Missions" and start playing!

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
- Original missions from "The Crew: Mission Deep Sea" game
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

"The Crew: Mission Deep Sea" is the standalone successor to "The Quest for Planet Nine", featuring a more complex task card system with 96 diverse mission objectives. This generator helps create varied and balanced mission combinations for enhanced gameplay experience.

The game features an advanced communication system using sonar tokens and challenging cooperative gameplay that requires teamwork and strategy to succeed.

---

*Made with ❤️ for The Crew enthusiasts*
