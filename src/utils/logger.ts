// Utility function to log messages to the server terminal
export const logToServer = async (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    try {
        await fetch('/api/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, level }),
        });
    } catch (error) {
        // Fallback to console if API call fails
        console.log(`[FALLBACK] ${message}`);
    }
};
