/**
 * POMODORO TIMER WEB APP - JAVASCRIPT TUTORIAL
 * 
 * 🎓 COMPREHENSIVE JAVASCRIPT LEARNING GUIDE
 * 
 * This file is designed as a complete JavaScript tutorial for beginners.
 * Every single line is explained in detail to help you understand:
 * 
 * 📚 FUNDAMENTAL CONCEPTS:
 * - Variables: const, let, var (and when to use each)
 * - Data Types: strings, numbers, booleans, objects, arrays
 * - Functions: regular functions, arrow functions, parameters, return values
 * - Objects: creating, accessing properties, methods
 * - Arrays: creating, accessing elements, iteration methods
 * 
 * 🌐 WEB DEVELOPMENT CONCEPTS:
 * - DOM (Document Object Model): finding and modifying HTML elements
 * - Event Handling: responding to user interactions (clicks, keyboard)
 * - State Management: keeping track of app data
 * - Browser APIs: Notifications, Audio, Timers
 * 
 * ⚡ ADVANCED CONCEPTS:
 * - Asynchronous JavaScript: async/await, Promises
 * - Timers: setInterval, setTimeout, clearInterval
 * - Error Handling: try/catch blocks
 * - Scope: global vs local variables
 * - Closures: functions that remember their environment
 * 
 * 🔗 HOW THIS CONNECTS TO OTHER FILES:
 * - index.html: Provides the HTML structure and element IDs we reference
 * - styles.css: Provides CSS classes we add/remove for visual effects
 * - This file: Controls all the behavior and logic
 * 
 * 💡 LEARNING TIP: Read this file from top to bottom, and don't worry if
 * some concepts seem complex at first. JavaScript builds on itself!
 */

// ============================================================================
// 📊 STATE MANAGEMENT - The "Memory" of Our Application
// ============================================================================
// 
// WHAT IS STATE MANAGEMENT?
// State management is like the "memory" of your application. It's where we store
// all the data that changes as the user interacts with the app. Think of it like
// a notebook that keeps track of everything happening in your app.
//
// WHY DO WE NEED IT?
// Without state management, our app would "forget" things like:
// - Which timer mode is currently active
// - How much time is left
// - Whether the timer is running or paused
// - How many sessions have been completed
//
// HOW IT WORKS:
// We create a single object called 'state' that holds all this information.
// When something changes (like the timer starts), we update the state.
// When we need to display something (like the current time), we read from the state.

/**
 * 🗃️ MAIN STATE OBJECT - The Central Data Store
 * 
 * This is the heart of our application's data management.
 * Everything that can change in our app is stored here.
 * 
 * SYNTAX EXPLANATION:
 * const state = { ... }  - Creates a constant (unchangeable) variable
 * The curly braces { } create an OBJECT
 * Objects store data as key-value pairs: key: value
 * 
 * EXAMPLE: If we had a simple object:
 * const person = { name: "Alice", age: 25 }
 * We access it like: person.name (gets "Alice")
 */
const state = {
    // ⏱️ TIMER CONFIGURATION - How long each mode lasts
    // This is an object within our main state object (nested object)
    durations: {
        work: 25 * 60,        // 25 minutes × 60 seconds = 1500 seconds
        'short-break': 5 * 60, // 5 minutes × 60 seconds = 300 seconds  
        'long-break': 15 * 60  // 15 minutes × 60 seconds = 900 seconds
    },
    
    // 📍 CURRENT STATE VARIABLES - What's happening right now
    currentMode: 'work',      // String: Which timer mode is active
    timeRemaining: 25 * 60,   // Number: Seconds left in current timer
    isRunning: false,         // Boolean: Is timer counting down? (true/false)
    sessionCount: 0,          // Number: How many work sessions completed
    
    // 🔄 TIMER INTERVAL REFERENCE - Needed to stop the timer
    // This will store the ID returned by setInterval() so we can stop it later
    timerInterval: null        // null means "nothing stored yet"
};

// ============================================================================
// 🎯 DOM ELEMENT REFERENCES - Connecting JavaScript to HTML
// ============================================================================
//
// WHAT IS THE DOM?
// DOM stands for "Document Object Model". It's how JavaScript talks to HTML.
// Think of HTML as the skeleton of your webpage, and the DOM as the way
// JavaScript can find and modify parts of that skeleton.
//
// WHY DO WE NEED REFERENCES?
// Before we can change anything on the webpage (like updating the timer display),
// we need to "find" the HTML elements first. It's like getting someone's phone
// number before you can call them.
//
// HOW IT WORKS:
// 1. We use document.getElementById() to find elements by their ID
// 2. We use document.querySelectorAll() to find multiple elements by class
// 3. We store these references in an object so we can use them later
//
// CONNECTION TO HTML:
// Look at index.html and you'll see elements like:
// <div id="time-display">25:00</div>
// <button id="start-pause-btn">Start</button>
// These IDs are what we use to find the elements!

/**
 * 🔗 ELEMENTS OBJECT - Our "Phone Book" of HTML Elements
 * 
 * This object stores references to all the HTML elements we need to modify.
 * Instead of searching for elements every time we need them, we find them once
 * and store the references here.
 * 
 * SYNTAX EXPLANATION:
 * const elements = { ... }  - Creates an object to store our element references
 * 
 * ELEMENT FINDING METHODS:
 * - document.getElementById('id') - Finds ONE element by its ID
 * - document.querySelectorAll('.class') - Finds ALL elements with a class
 * 
 * EXAMPLE:
 * If HTML has: <button id="my-button">Click me</button>
 * We can find it with: document.getElementById('my-button')
 */
const elements = {
    // ⏰ TIMER DISPLAY ELEMENTS - The visual timer components
    timeDisplay: document.getElementById('time-display'),    // The big "25:00" display
    modeLabel: document.getElementById('mode-label'),       // The "Work Time" label
    sessionCount: document.getElementById('session-count'), // The session counter
    
    // 🎮 BUTTON ELEMENTS - The interactive controls
    startPauseBtn: document.getElementById('start-pause-btn'), // Start/Pause button
    resetBtn: document.getElementById('reset-btn'),            // Reset button
    modeButtons: document.querySelectorAll('.mode-btn')       // All mode buttons (array)
};

// ============================================================================
// 🛠️ UTILITY FUNCTIONS - Helper Functions That Do Specific Tasks
// ============================================================================
//
// WHAT ARE UTILITY FUNCTIONS?
// Utility functions are small, reusable pieces of code that do one specific thing.
// Think of them like tools in a toolbox - each tool has one job, but you can use
// the same tool many times throughout your project.
//
// WHY DO WE USE THEM?
// 1. REUSABILITY: Write once, use many times
// 2. ORGANIZATION: Keeps code clean and easy to read
// 3. TESTING: Easy to test individual functions
// 4. DEBUGGING: If something breaks, you know exactly where to look
//
// FUNCTION SYNTAX EXPLANATION:
// function functionName(parameter) { ... }
// - function: Keyword that creates a function
// - functionName: What we call this function
// - parameter: Data we pass into the function
// - { ... }: The code that runs when function is called

/**
 * ⏰ FORMAT TIME FUNCTION - Converts Seconds to MM:SS Format
 * 
 * WHAT IT DOES:
 * Takes a number of seconds (like 1500) and converts it to a readable time format (like "25:00")
 * 
 * WHY WE NEED IT:
 * JavaScript doesn't automatically format time for us. We need to do the math ourselves.
 * 
 * HOW IT WORKS:
 * 1. Divide total seconds by 60 to get minutes
 * 2. Use modulo (%) to get remaining seconds
 * 3. Add leading zeros if needed
 * 4. Combine into MM:SS format
 * 
 * PARAMETERS: note @param and @returns are only used for documentation purposes and not in code execution.
 * @param {number} seconds - The number of seconds to convert
 * 
 * RETURNS:
 * @returns {string} - Formatted time string like "25:00"
 * 
 * EXAMPLES:
 * formatTime(1500) returns "25:00"  (25 minutes, 0 seconds)
 * formatTime(65) returns "01:05"    (1 minute, 5 seconds)
 * formatTime(3661) returns "61:01"  (61 minutes, 1 second)
 * 
 * MATH CONCEPTS USED:
 * - Math.floor(): Rounds DOWN to nearest whole number
 * - Modulo (%): Returns the remainder after division
 * - padStart(): Adds characters to the beginning of a string
 */
function formatTime(seconds) {
    // STEP 1: Convert total seconds to minutes and remaining seconds
    // Math.floor() rounds DOWN to the nearest whole number
    // Example: Math.floor(1500 / 60) = Math.floor(25) = 25
    const minutes = Math.floor(seconds / 60);
    
    // Modulo (%) gives us the remainder after division
    // Example: 1500 % 60 = 0 (because 1500 ÷ 60 = 25 with remainder 0)
    const remainingSeconds = seconds % 60;
    
    // STEP 2: Format numbers with leading zeros
    // toString() converts number to string
    // padStart(2, '0') ensures we always have 2 digits, adding '0' if needed
    // Example: "5" becomes "05", "25" stays "25"
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    // STEP 3: Combine into final format
    // Template literals use backticks (`) and ${} to insert variables
    // This is cleaner than: formattedMinutes + ":" + formattedSeconds
    return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * 🖥️ UPDATE DISPLAY FUNCTION - Refreshes What the User Sees
 * 
 * WHAT IT DOES:
 * Updates all the visual elements on the webpage to match our current state.
 * This is like refreshing a picture to show the latest information.
 * 
 * WHEN IT'S CALLED:
 * - Every second when the timer is running (to show countdown)
 * - When the user switches modes
 * - When the user resets the timer
 * - When the app first loads
 * 
 * HOW IT WORKS:
 * 1. Updates the big timer display (25:00)
 * 2. Updates the mode label (Work Time, Short Break, etc.)
 * 3. Updates the session counter
 * 
 * CONNECTION TO HTML:
 * This function modifies the HTML elements we found earlier in the 'elements' object.
 * It changes what the user sees without changing the HTML structure.
 */
function updateDisplay() {
    // STEP 1: Update the main timer display
    // elements.timeDisplay refers to the <div id="time-display"> element
    // textContent changes the text inside that element
    // formatTime() converts our seconds to "MM:SS" format
    elements.timeDisplay.textContent = formatTime(state.timeRemaining);
    
    // STEP 2: Update the mode label (Work Time, Short Break, etc.)
    // We create an object that maps mode names to display text
    // This is cleaner than using if/else statements
    const modeLabels = {
        work: 'Work Time',           // When currentMode is 'work'
        'short-break': 'Short Break', // When currentMode is 'short-break'
        'long-break': 'Long Break'    // When currentMode is 'long-break'
    };
    
    // Set the mode label text based on current mode
    // state.currentMode is the key, modeLabels[state.currentMode] is the value
    // Example: if state.currentMode = 'work', then modeLabels['work'] = 'Work Time'
    elements.modeLabel.textContent = modeLabels[state.currentMode];
    
    // STEP 3: Update the session counter
    // Convert the number to a string and display it
    // state.sessionCount is a number, but textContent needs a string
    elements.sessionCount.textContent = state.sessionCount;
}

/**
 * 🎨 UPDATE MODE BUTTONS FUNCTION - Visual Button State Management
 * 
 * WHAT IT DOES:
 * Updates the visual appearance of the mode buttons (Work, Short Break, Long Break)
 * to show which mode is currently selected.
 * 
 * HOW IT WORKS:
 * 1. Removes the 'active' CSS class from ALL buttons
 * 2. Adds the 'active' CSS class to the button that matches the current mode
 * 
 * CONNECTION TO CSS:
 * The 'active' class is defined in styles.css and makes buttons look different
 * (purple background, different border, etc.)
 * 
 * ARRAY ITERATION CONCEPT:
 * forEach() is a method that runs a function once for each item in an array.
 * It's like saying "for each button in the list of buttons, do something"
 */
function updateModeButtons() {
    // elements.modeButtons is an array of all buttons with class 'mode-btn'
    // forEach() runs the function once for each button
    elements.modeButtons.forEach(button => {
        // Remove 'active' class from all buttons
        // classList.remove() removes a CSS class from an element
        button.classList.remove('active');
        
        // Add 'active' class to the button that matches current mode
        // button.dataset.mode gets the value of the data-mode attribute
        // Example: <button data-mode="work">Work</button> has dataset.mode = "work"
        if (button.dataset.mode === state.currentMode) {
            // classList.add() adds a CSS class to an element
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
// ⏱️ TIMER LOGIC - The Heart of Our Countdown System
// ============================================================================
//
// WHAT IS TIMER LOGIC?
// Timer logic is the code that makes our countdown actually work. It's like
// the engine of a car - without it, nothing moves!
//
// KEY CONCEPTS:
// 1. setInterval() - Runs code repeatedly at set intervals
// 2. clearInterval() - Stops the repeated code
// 3. State updates - Changing our data over time
// 4. Conditional logic - Making decisions based on conditions
//
// HOW TIMERS WORK IN JAVASCRIPT:
// - setInterval(function, milliseconds) - Runs function every X milliseconds
// - Returns an ID number that we can use to stop it later
// - clearInterval(ID) - Stops the timer using the ID
//
// EXAMPLE:
// const timer = setInterval(() => console.log("Hello"), 1000);
// // This prints "Hello" every 1000ms (1 second)
// clearInterval(timer); // Stops the timer

/**
 * ▶️ START TIMER FUNCTION - Begins the Countdown
 * 
 * WHAT IT DOES:
 * Starts the timer countdown by running code every second.
 * 
 * HOW IT WORKS:
 * 1. Checks if timer is already running (prevents multiple timers)
 * 2. Updates the state to show timer is running
 * 3. Updates the button appearance
 * 4. Starts setInterval() to count down every second
 * 5. Stores the timer ID so we can stop it later
 * 
 * IMPORTANT CONCEPTS:
 * - Guard clauses: Early returns to prevent unwanted behavior
 * - State management: Updating our app's data
 * - setInterval(): JavaScript's built-in timer function
 * - Arrow functions: Shorter way to write functions
 */
function startTimer() {
    // GUARD CLAUSE: Don't start if already running
    // This prevents multiple timers from running at the same time
    if (state.isRunning) return; // 'return' exits the function immediately
    
    // UPDATE STATE: Mark timer as running
    state.isRunning = true;
    
    // UPDATE UI: Change button appearance
    updateStartPauseButton();
    
    // START THE COUNTDOWN: Run code every 1000 milliseconds (1 second)
    // setInterval() returns a unique ID that we need to stop the timer later
    state.timerInterval = setInterval(() => {
        // This arrow function runs every second:
        
        // DECREASE TIME: Subtract 1 second from remaining time
        state.timeRemaining--;
        
        // UPDATE DISPLAY: Show the new time to the user
        updateDisplay();
        
        // CHECK COMPLETION: Stop if timer reaches zero
        if (state.timeRemaining <= 0) {
            timerComplete(); // Call our completion function
        }
    }, 1000); // 1000 milliseconds = 1 second
}

/**
 * ⏸️ PAUSE TIMER FUNCTION - Stops the Countdown
 * 
 * WHAT IT DOES:
 * Stops the timer countdown without resetting the time.
 * 
 * HOW IT WORKS:
 * 1. Checks if timer is actually running (prevents errors)
 * 2. Updates state to show timer is stopped
 * 3. Updates button appearance
 * 4. Stops the setInterval() using clearInterval()
 * 5. Clears the timer ID from our state
 * 
 * IMPORTANT CONCEPTS:
 * - clearInterval(): Stops a running timer
 * - null: Represents "nothing" or "empty"
 * - State cleanup: Removing references to prevent memory leaks
 */
function pauseTimer() {
    // GUARD CLAUSE: Don't pause if not running
    // This prevents errors if someone tries to pause a stopped timer
    if (!state.isRunning) return;
    
    // UPDATE STATE: Mark timer as stopped
    state.isRunning = false;
    
    // UPDATE UI: Change button back to "Start"
    updateStartPauseButton();
    
    // STOP THE TIMER: Use clearInterval() with the stored ID
    // clearInterval() stops the timer by using the ID we got from setInterval()
    clearInterval(state.timerInterval);
    
    // CLEANUP: Set timer ID back to null (empty)
    // This prevents memory leaks and makes our state clean
    state.timerInterval = null;
}

/**
 * 🔄 RESET TIMER FUNCTION - Restarts the Current Timer
 * 
 * WHAT IT DOES:
 * Stops the current timer and resets the time to the beginning of the current mode.
 * 
 * HOW IT WORKS:
 * 1. Stops any running timer
 * 2. Resets time to the duration of the current mode
 * 3. Updates the display to show the reset time
 * 
 * IMPORTANT CONCEPTS:
 * - Object property access: state.durations[state.currentMode]
 * - Function composition: Calling other functions from within a function
 * - State reset: Going back to initial values
 */
function resetTimer() {
    // STOP CURRENT TIMER: If timer is running, stop it first
    pauseTimer();
    
    // RESET TIME: Set time back to the duration of current mode
    // state.durations[state.currentMode] gets the duration for the current mode
    // Example: if currentMode is 'work', this gets state.durations.work (1500 seconds)
    state.timeRemaining = state.durations[state.currentMode];
    
    // UPDATE DISPLAY: Show the reset time to the user
    updateDisplay();
}

/**
 * 🎉 TIMER COMPLETE FUNCTION - Handles When Timer Reaches Zero
 * 
 * WHAT IT DOES:
 * Runs when a timer finishes counting down. Handles notifications, session counting,
 * and visual effects.
 * 
 * HOW IT WORKS:
 * 1. Stops the timer
 * 2. Adds visual effect (pulsing animation)
 * 3. Increments session count if it was a work session
 * 4. Shows notifications to the user
 * 5. Removes visual effect after 3 seconds
 * 
 * IMPORTANT CONCEPTS:
 * - setTimeout(): Runs code after a delay
 * - CSS class manipulation: Adding/removing classes for effects
 * - Conditional logic: Different behavior based on timer type
 * - Function calls: Calling multiple functions in sequence
 */
function timerComplete() {
    // STOP THE TIMER: Make sure it's completely stopped
    pauseTimer();
    
    // VISUAL EFFECT: Add pulsing animation to indicate completion
    // This adds the 'timer-complete' CSS class which triggers an animation
    elements.timeDisplay.classList.add('timer-complete');
    
    // REMOVE EFFECT: Stop the animation after 3 seconds
    // setTimeout() runs code once after a specified delay
    setTimeout(() => {
        elements.timeDisplay.classList.remove('timer-complete');
    }, 3000); // 3000 milliseconds = 3 seconds
    
    // SESSION COUNTING: Increment if we just finished a work session
    // This only counts work sessions, not breaks
    if (state.currentMode === 'work') {
        state.sessionCount++; // Add 1 to the session count
        updateDisplay(); // Update the display to show new count
    }
    
    // NOTIFICATIONS: Alert the user that timer is complete
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
