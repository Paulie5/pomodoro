// timer-worker.js
// Service Worker for accurate background timer

let timerInterval = null;
let startTime = null;
let duration = 0;

/**
 * Service Worker Message Handler
 * Receives commands from main thread and manages timer
 */
self.addEventListener('message', (event) => {
    const { action, data } = event.data;
    
    switch (action) {
        case 'start':
            // Start timer
            startTime = Date.now();
            duration = data.duration;
            
            timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const remaining = Math.max(0, duration - elapsed);
                
                // Send update to main thread
                self.postMessage({
                    type: 'tick',
                    remaining: remaining,
                    elapsed: elapsed
                });
                
                // Check if timer completed
                if (remaining <= 0) {
                    clearInterval(timerInterval);
                    self.postMessage({ type: 'complete' });
                }
            }, 1000);
            break;
            
        case 'pause':
            // Pause timer
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            break;
            
        case 'reset':
            // Reset timer
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            startTime = null;
            duration = 0;
            break;
    }
});