# Pomodoro Timer Web App 🍅

A minimalist, zen-inspired Pomodoro timer built with vanilla HTML, CSS, and JavaScript. Perfect for productivity and learning web development fundamentals.

## Features

- **Three Timer Modes**: 25-minute work sessions, 5-minute short breaks, and 15-minute long breaks
- **Session Tracking**: Counts completed Pomodoro sessions
- **Dual Notifications**: Both browser notifications and sound alerts when timers complete
- **Manual Mode Switching**: Choose your next phase after completing a timer
- **Keyboard Shortcuts**: Spacebar to start/pause, R to reset, 1/2/3 for mode switching
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Zen Aesthetic**: Black background with purple and silver accents for a calming experience

## Design Philosophy

This app embraces a minimalist, zen-inspired design with:
- **Black background** (#0a0a0a) for reduced eye strain
- **Purple accents** (#9d4edd) for focus and creativity
- **Silver highlights** (#c0c0c0) for elegance
- **Clean typography** using system fonts
- **Smooth animations** and hover effects

## Technologies Used

- **HTML5**: Semantic markup with accessibility in mind
- **CSS3**: Custom properties, flexbox, responsive design, animations
- **Vanilla JavaScript**: No frameworks - pure JavaScript for learning
- **Browser APIs**: Notifications API, Web Audio API
- **GitHub Pages**: Simple deployment with no build process

## Getting Started

### Running Locally

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Start using** the Pomodoro timer immediately!

No build process, package managers, or complex setup required.

### File Structure

```
pomodoro/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Timer logic with extensive comments
└── README.md           # This documentation
```

## How to Use

1. **Select a Mode**: Choose Work, Short Break, or Long Break
2. **Start Timer**: Click Start or press Spacebar
3. **Pause/Resume**: Click Pause or press Spacebar again
4. **Reset**: Click Reset or press R to restart current timer
5. **Switch Modes**: Click mode buttons or use keyboard shortcuts (1/2/3)
6. **Track Progress**: Watch your session counter increase

### Keyboard Shortcuts

- **Spacebar**: Start/Pause timer
- **R**: Reset current timer
- **1**: Switch to Work mode
- **2**: Switch to Short Break mode
- **3**: Switch to Long Break mode

## Learning JavaScript

This project is designed as a learning resource with extensive comments explaining:

- **Variables and Data Types**: const, objects, numbers, strings, booleans
- **Functions**: Regular functions, arrow functions, parameters, return values
- **DOM Manipulation**: Finding elements, updating content, adding event listeners
- **Event Handling**: Click events, keyboard events, page load events
- **Timers**: setInterval, setTimeout, clearInterval
- **Browser APIs**: Notifications, Web Audio
- **State Management**: Keeping track of app data
- **Control Flow**: if/else, switch statements, loops

## Deployment to GitHub Pages

### Method 1: Automatic Deployment

1. **Fork** this repository to your GitHub account
2. **Go to** Settings → Pages in your forked repository
3. **Select** "Deploy from a branch" → "main" branch → "/ (root)"
4. **Click** Save
5. **Wait** a few minutes for deployment
6. **Visit** your site at `https://yourusername.github.io/pomodoro`

### Method 2: Manual Upload

1. **Create** a new repository on GitHub named `pomodoro`
2. **Upload** all files (index.html, styles.css, script.js, README.md)
3. **Enable** GitHub Pages in repository settings
4. **Deploy** from main branch root directory

## Browser Compatibility

- **Chrome/Edge**: Full support including notifications and audio
- **Firefox**: Full support including notifications and audio
- **Safari**: Full support (notifications may require user permission)
- **Mobile Browsers**: Responsive design works on all mobile devices

## Customization

### Changing Timer Durations

Edit the `durations` object in `script.js`:

```javascript
durations: {
    work: 25 * 60,        // Change 25 to your preferred work time
    'short-break': 5 * 60, // Change 5 to your preferred short break time
    'long-break': 15 * 60  // Change 15 to your preferred long break time
}
```

### Modifying Colors

Update the CSS custom properties in `styles.css`:

```css
:root {
    --bg-primary: #0a0a0a;        /* Main background */
    --accent-purple: #9d4edd;     /* Primary accent */
    --accent-silver: #c0c0c0;     /* Secondary accent */
    /* ... other colors */
}
```

## Contributing

This is a learning project! Feel free to:
- Fork and modify for your own learning
- Add new features (sound customization, themes, statistics)
- Improve accessibility
- Optimize performance
- Add more keyboard shortcuts

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by the Pomodoro Technique by Francesco Cirillo
- Built with educational purposes in mind
- Designed for simplicity and focus

---

**Happy Coding!** 🚀

If you found this project helpful for learning JavaScript, consider giving it a star on GitHub!
# pomodoro
