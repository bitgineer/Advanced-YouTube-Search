// Test snippet for Advanced YouTube Search Notification System
// Run this in the browser console after the script has loaded

// Test toast notifications
window.AdvancedYouTubeSearchNotifications.showToast('This is an info toast', 'info', 3000);
setTimeout(() => {
    window.AdvancedYouTubeSearchNotifications.showToast('This is a success toast', 'success', 4000);
}, 500);
setTimeout(() => {
    window.AdvancedYouTubeSearchNotifications.showToast('This is a warning toast', 'warning', 5000);
}, 1000);
setTimeout(() => {
    window.AdvancedYouTubeSearchNotifications.showToast('This is an error toast', 'error', 6000);
}, 1500);

// Test error banner
setTimeout(() => {
    const banner = window.AdvancedYouTubeSearchNotifications.showBanner(
        'Local Storage is full. Some settings may not be saved.',
        'error',
        {
            dismissable: true,
            actions: [
                {
                    id: 'clear-storage',
                    label: 'Clear Storage',
                    handler: (banner) => {
                        alert('Storage cleared!');
                        window.AdvancedYouTubeSearchNotifications.dismissBanner(banner);
                    }
                },
                {
                    id: 'learn-more',
                    label: 'Learn More',
                    handler: () => {
                        window.open('https://github.com/bitgineer/Advanced-YouTube-Search', '_blank');
                    }
                }
            ]
        }
    );
}, 3000);

// Test warning banner with actions
setTimeout(() => {
    const banner = window.AdvancedYouTubeSearchNotifications.showBanner(
        'Invalid date range: "After" date must be before "Before" date',
        'warning',
        {
            dismissable: true,
            actions: [
                {
                    id: 'fix-dates',
                    label: 'Fix Dates',
                    handler: (banner) => {
                        window.AdvancedYouTubeSearchNotifications.dismissBanner(banner);
                    }
                }
            ]
        }
    );
}, 5000);

// Test info banner
setTimeout(() => {
    const banner = window.AdvancedYouTubeSearchNotifications.showBanner(
        'Settings saved successfully',
        'success',
        { dismissable: true }
    );
}, 7000);

// Test clearing all notifications
setTimeout(() => {
    window.AdvancedYouTubeSearchNotifications.clearAll();
    console.log('All notifications cleared');
}, 12000);
