/**
 * POMODORO TIMER WEB APP - JAVASCRIPT
 * 
 * This file contains all the JavaScript logic for the Pomodoro timer.
 * Every function and variable is heavily commented to help you learn JavaScript!
 * 
 * Key JavaScript concepts covered:
 * - Variables and data types
 * - Functions and arrow functions
 * - Objects and arrays
 * - DOM manipulation
 * - Event handling
 * - setInterval and setTimeout
 * - Browser APIs (Notifications, Audio)
 * - State management
 */

// ============================================================================
// STATE MANAGEMENT - This is where we store all the app's data
// ============================================================================

/**
 * Main state object - contains all the data our app needs to function
 * This is like a "memory" for our application
 */
const state = {
    // Timer configuration - how long each mode lasts (in seconds)
    durations: {
        work: 25 * 60,        // 25 minutes = 1500 seconds
        'short-break': 5 * 60, // 5 minutes = 300 seconds  
        'long-break': 15 * 60  // 15 minutes = 900 seconds
    },
    
    // Current state variables
    currentMode: 'work',      // Which timer mode is currently active
    timeRemaining: 25 * 60,   // How much time is left (in seconds)
    isRunning: false,         // Whether the timer is currently counting down
    sessionCount: 0,          // How many work sessions have been completed
    
    // Timer interval reference - we need this to stop the timer later
    timerInterval: null
};

// ============================================================================
// DOM ELEMENT REFERENCES - Getting references to HTML elements
// ============================================================================

/**
 * We use document.getElementById() and document.querySelector() to get references
 * to HTML elements so we can modify them with JavaScript
 */
const elements = {
    // Timer display elements
    timeDisplay: document.getElementById('time-display'),
    modeLabel: document.getElementById('mode-label'),
    sessionCount: document.getElementById('session-count'),
    
    // Button elements
    startPauseBtn: document.getElementById('start-pause-btn'),
    resetBtn: document.getElementById('reset-btn'),
    modeButtons: document.querySelectorAll('.mode-btn')
};

// ============================================================================
// UTILITY FUNCTIONS - Helper functions that do specific tasks
// ============================================================================

/**
 * Converts seconds into MM:SS format for display
 * @param {number} seconds - The number of seconds to convert
 * @returns {string} - Formatted time string like "25:00"
 * 
 * Example: formatTime(1500) returns "25:00"
 * Example: formatTime(65) returns "01:05"
 */
function formatTime(seconds) {
    // Math.floor() rounds down to the nearest whole number
    const minutes = Math.floor(seconds / 60);  // Get minutes (1500 / 60 = 25)
    const remainingSeconds = seconds % 60;      // Get remaining seconds (1500 % 60 = 0)
    
    // padStart() adds leading zeros if needed
    // Example: "5" becomes "05" if we want 2 digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Updates the visual display of the timer
 * This function is called every second when the timer is running
 */
function updateDisplay() {
    // Update the time display
    elements.timeDisplay.textContent = formatTime(state.timeRemaining);
    
    // Update the mode label based on current mode
    const modeLabels = {
        work: 'Work Time',
        'short-break': 'Short Break',
        'long-break': 'Long Break'
    };
    elements.modeLabel.textContent = modeLabels[state.currentMode];
    
    // Update session count
    elements.sessionCount.textContent = state.sessionCount;
}

/**
 * Updates the visual state of mode buttons
 * Highlights the currently selected mode
 */
function updateModeButtons() {
    elements.modeButtons.forEach(button => {
        // Remove 'active' class from all buttons
        button.classList.remove('active');
        
        // Add 'active' class to the button that matches current mode
        if (button.dataset.mode === state.currentMode) {
            button.classList.add('active');
        }
    });
}

/**
 * Updates the start/pause button text and appearance
 */
function updateStartPauseButton() {
    if (state.isRunning) {
        elements.startPauseBtn.textContent = 'Pause';
        elements.startPauseBtn.classList.add('running');
    } else {
        elements.startPauseBtn.textContent = 'Start';
        elements.startPauseBtn.classList.remove('running');
    }
}

// ============================================================================
// TIMER LOGIC - The core countdown functionality
// ============================================================================

/**
 * Starts the timer countdown
 * Uses setInterval() to call a function every 1000ms (1 second)
 */
function startTimer() {
    // Don't start if already running
    if (state.isRunning) return;
    
    state.isRunning = true;
    updateStartPauseButton();
    
    // setInterval() calls a function repeatedly at specified intervals
    // It returns an ID that we can use to stop the timer later
    state.timerInterval = setInterval(() => {
        // Decrease time by 1 second
        state.timeRemaining--;
        
        // Update the display
        updateDisplay();
        
        // Check if timer has reached zero
        if (state.timeRemaining <= 0) {
            timerComplete();
        }
    }, 1000); // 1000 milliseconds = 1 second
}

/**
 * Pauses the timer countdown
 * Uses clearInterval() to stop the setInterval() we started
 */
function pauseTimer() {
    if (!state.isRunning) return;
    
    state.isRunning = false;
    updateStartPauseButton();
    
    // clearInterval() stops the timer by using the ID we got from setInterval()
    clearInterval(state.timerInterval);
    state.timerInterval = null;
}

/**
 * Resets the timer to the beginning of the current mode
 */
function resetTimer() {
    // Stop the timer if it's running
    pauseTimer();
    
    // Reset time to the duration of current mode
    state.timeRemaining = state.durations[state.currentMode];
    
    // Update display
    updateDisplay();
}

/**
 * Called when the timer reaches zero
 * Handles notifications and session counting
 */
function timerComplete() {
    // Stop the timer
    pauseTimer();
    
    // Add visual effect to indicate completion
    elements.timeDisplay.classList.add('timer-complete');
    
    // Remove the effect after 3 seconds
    setTimeout(() => {
        elements.timeDisplay.classList.remove('timer-complete');
    }, 3000);
    
    // Increment session count if we just finished a work session
    if (state.currentMode === 'work') {
        state.sessionCount++;
        updateDisplay();
    }
    
    // Show notifications
    showNotifications();
}

// ============================================================================
// MODE SWITCHING - Changing between work/break modes
// ============================================================================

/**
 * Changes the timer mode (work, short break, long break)
 * @param {string} mode - The mode to switch to
 */
function switchMode(mode) {
    // Don't switch if already in this mode
    if (mode === state.currentMode) return;
    
    // Stop current timer
    pauseTimer();
    
    // Update state
    state.currentMode = mode;
    state.timeRemaining = state.durations[mode];
    
    // Update display
    updateDisplay();
    updateModeButtons();
}

// ============================================================================
// NOTIFICATIONS - Browser and sound notifications
// ============================================================================

/**
 * Requests permission for browser notifications
 * This must be called in response to a user action (like clicking a button)
 */
async function requestNotificationPermission() {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }
    
    // Check current permission status
    if (Notification.permission === 'granted') {
        return true;
    }
    
    // Request permission from user
    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

/**
 * Shows browser notification when timer completes
 */
function showBrowserNotification() {
    // Check if we have permission
    if (Notification.permission !== 'granted') return;
    
    // Create notification content based on completed mode
    let title, body;
    if (state.currentMode === 'work') {
        title = 'Work Session Complete! 🎉';
        body = 'Time for a break. You\'ve completed ' + state.sessionCount + ' sessions.';
    } else {
        title = 'Break Time Over! ⏰';
        body = 'Ready to get back to work?';
    }
    
    // Create and show the notification
    const notification = new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
    });
    
    // Auto-close notification after 5 seconds
    setTimeout(() => {
        notification.close();
    }, 5000);
}

/**
 * Plays sound notification when timer completes
 */
function playSoundNotification() {
    // Create audio context for generating a simple beep sound
    // This works even without external sound files
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator (sound generator)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect oscillator to gain node, then to speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800 Hz frequency
    oscillator.type = 'sine'; // Smooth sine wave
    
    // Configure volume (gain)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Start at 30% volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5); // Fade out
    
    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5); // Stop after 0.5 seconds
}

/**
 * Shows both browser and sound notifications
 */
function showNotifications() {
    showBrowserNotification();
    playSoundNotification();
}

// ============================================================================
// EVENT LISTENERS - Responding to user interactions
// ============================================================================

/**
 * Handles start/pause button clicks
 */
function handleStartPauseClick() {
    if (state.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

/**
 * Handles reset button clicks
 */
function handleResetClick() {
    resetTimer();
}

/**
 * Handles mode button clicks
 * @param {Event} event - The click event
 */
function handleModeClick(event) {
    const mode = event.target.dataset.mode;
    switchMode(mode);
}

// ============================================================================
// INITIALIZATION - Setting up the app when it loads
// ============================================================================

/**
 * Initializes the app when the page loads
 * This function runs once when the HTML page is fully loaded
 */
function initializeApp() {
    console.log('🍅 Pomodoro Timer initialized!');
    
    // Set up event listeners for all interactive elements
    elements.startPauseBtn.addEventListener('click', handleStartPauseClick);
    elements.resetBtn.addEventListener('click', handleResetClick);
    
    // Add event listeners to all mode buttons
    elements.modeButtons.forEach(button => {
        button.addEventListener('click', handleModeClick);
    });
    
    // Request notification permission when user first interacts
    // We do this on first button click rather than immediately
    let permissionRequested = false;
    const requestPermissionOnFirstClick = () => {
        if (!permissionRequested) {
            requestNotificationPermission();
            permissionRequested = true;
        }
    };
    
    elements.startPauseBtn.addEventListener('click', requestPermissionOnFirstClick);
    elements.resetBtn.addEventListener('click', requestPermissionOnFirstClick);
    elements.modeButtons.forEach(button => {
        button.addEventListener('click', requestPermissionOnFirstClick);
    });
    
    // Set initial display state
    updateDisplay();
    updateModeButtons();
    updateStartPauseButton();
    
    console.log('✅ App ready! Current mode:', state.currentMode);
    console.log('⏰ Time remaining:', formatTime(state.timeRemaining));
}

// ============================================================================
// KEYBOARD SHORTCUTS - Additional user experience features
// ============================================================================

/**
 * Handles keyboard shortcuts for better user experience
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboard(event) {
    // Prevent shortcuts from interfering with typing in other elements
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.code) {
        case 'Space':
            // Spacebar to start/pause
            event.preventDefault();
            handleStartPauseClick();
            break;
        case 'KeyR':
            // R key to reset
            event.preventDefault();
            handleResetClick();
            break;
        case 'Digit1':
            // 1 key for work mode
            event.preventDefault();
            switchMode('work');
            break;
        case 'Digit2':
            // 2 key for short break
            event.preventDefault();
            switchMode('short-break');
            break;
        case 'Digit3':
            // 3 key for long break
            event.preventDefault();
            switchMode('long-break');
            break;
    }
}

// Add keyboard event listener
document.addEventListener('keydown', handleKeyboard);

// ============================================================================
// START THE APP - This runs when the page loads
// ============================================================================

/**
 * Wait for the HTML page to fully load before initializing
 * This ensures all our DOM elements exist before we try to use them
 */
document.addEventListener('DOMContentLoaded', initializeApp);

// ============================================================================
// LEARNING NOTES - Key JavaScript concepts explained
// ============================================================================

/*
KEY JAVASCRIPT CONCEPTS USED IN THIS APP:

1. VARIABLES AND DATA TYPES:
   - const: For values that never change (like our state object)
   - let: For values that might change (we don't use this much here)
   - Objects: state = { key: value } - like a container for related data
   - Numbers: 25 * 60 (mathematical operations)
   - Strings: 'work', "Start" (text data)
   - Booleans: true, false (yes/no values)

2. FUNCTIONS:
   - Regular functions: function name() { }
   - Arrow functions: () => { } (shorter syntax)
   - Parameters: function formatTime(seconds) - 'seconds' is a parameter
   - Return values: return `${minutes}:${seconds}` - gives back a value

3. DOM MANIPULATION:
   - document.getElementById() - finds HTML elements by ID
   - document.querySelectorAll() - finds multiple HTML elements
   - element.textContent - changes the text inside an element
   - element.classList.add() - adds CSS classes to elements
   - element.addEventListener() - makes elements respond to clicks/key presses

4. TIMERS:
   - setInterval() - runs code repeatedly (every 1000ms = 1 second)
   - setTimeout() - runs code once after a delay
   - clearInterval() - stops a setInterval

5. EVENT HANDLING:
   - Events: clicks, key presses, page loads
   - Event listeners: code that runs when events happen
   - Event objects: contain information about what happened

6. BROWSER APIs:
   - Notification API: shows browser notifications
   - Audio API: plays sounds
   - DOM API: manipulates HTML elements

7. CONTROL FLOW:
   - if/else: makes decisions based on conditions
   - switch: chooses between multiple options
   - forEach: does something for each item in a list

8. STRING TEMPLATES:
   - Template literals: `Hello ${name}` - puts variables into strings
   - padStart(): adds leading zeros to numbers

This app demonstrates many fundamental JavaScript concepts in a practical way!
*/
