// ==UserScript==
// @name         Advanced YouTube Search
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enhance YouTube search with both regular and advanced parameters like exact terms, exclusions, title includes, video length, and date range. Includes saved searches functionality with comprehensive error handling and polished UI.
// @author       bitgineer https://github.com/bitgineer
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ==================================================================
    // CSS DESIGN SYSTEM
    // ==================================================================
    
    // Inject CSS design system with custom properties
    const style = document.createElement('style');
    style.textContent = `
        :root {
            /* Color Palette */
            --ays-color-primary: #FF0000;
            --ays-color-primary-dark: #CC0000;
            --ays-color-primary-light: #ff3333;
            
            --ays-color-secondary: #0066cc;
            --ays-color-secondary-dark: #0052a3;
            --ays-color-secondary-light: #3385d6;
            
            --ays-color-success: #4CAF50;
            --ays-color-success-dark: #45a049;
            --ays-color-success-light: #66bb6a;
            
            --ays-color-danger: #dc3545;
            --ays-color-danger-dark: #c82333;
            --ays-color-danger-light: #e74c3c;
            
            --ays-color-warning: #FFA500;
            --ays-color-warning-dark: #e69500;
            --ays-color-warning-light: #ffb84d;
            
            --ays-color-gray-50: #f9f9f9;
            --ays-color-gray-100: #f0f0f0;
            --ays-color-gray-200: #e0e0e0;
            --ays-color-gray-300: #cccccc;
            --ays-color-gray-400: #999999;
            --ays-color-gray-500: #666666;
            --ays-color-gray-600: #555555;
            --ays-color-gray-700: #444444;
            --ays-color-gray-800: #333333;
            --ays-color-gray-900: #222222;
            
            --ays-color-white: #ffffff;
            --ays-color-black: #000000;
            
            /* Spacing Scale (based on 4px base) */
            --ays-spacing-xs: 4px;
            --ays-spacing-sm: 8px;
            --ays-spacing-md: 12px;
            --ays-spacing-lg: 16px;
            --ays-spacing-xl: 20px;
            --ays-spacing-2xl: 24px;
            --ays-spacing-3xl: 32px;
            --ays-spacing-4xl: 40px;
            
            /* Typography */
            --ays-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
            --ays-font-size-xs: 12px;
            --ays-font-size-sm: 14px;
            --ays-font-size-base: 16px;
            --ays-font-size-lg: 18px;
            --ays-font-size-xl: 20px;
            --ays-font-size-2xl: 24px;
            --ays-font-weight-normal: 400;
            --ays-font-weight-medium: 500;
            --ays-font-weight-bold: 700;
            
            /* Border Radius */
            --ays-radius-sm: 4px;
            --ays-radius-md: 6px;
            --ays-radius-lg: 8px;
            
            /* Shadows */
            --ays-shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.12);
            --ays-shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.15);
            --ays-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
            --ays-shadow-lg: 0 6px 16px rgba(0, 0, 0, 0.2);
            --ays-shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.25);
            --ays-shadow-focus: 0 0 0 3px rgba(255, 0, 0, 0.1);
            
            /* Transitions */
            --ays-transition-fast: 0.15s ease;
            --ays-transition-base: 0.2s ease;
            --ays-transition-slow: 0.3s ease;
            
            /* Z-Index Scale */
            --ays-z-dropdown: 1000;
            --ays-z-popup: 1001;
            --ays-z-modal: 2000;
            --ays-z-toast: 2001;
        }
        
        /* Utility Classes */
        
        /* Flexbox Utilities */
        .ays-flex { display: flex; }
        .ays-flex-row { flex-direction: row; }
        .ays-flex-col { flex-direction: column; }
        .ays-items-center { align-items: center; }
        .ays-items-start { align-items: flex-start; }
        .ays-items-end { align-items: flex-end; }
        .ays-justify-center { justify-content: center; }
        .ays-justify-between { justify-content: space-between; }
        .ays-justify-end { justify-content: flex-end; }
        .ays-gap-sm { gap: var(--ays-spacing-sm); }
        .ays-gap-md { gap: var(--ays-spacing-md); }
        .ays-gap-lg { gap: var(--ays-spacing-lg); }
        .ays-gap-xl { gap: var(--ays-spacing-xl); }
        
        /* Spacing Utilities */
        .ays-m-0 { margin: 0; }
        .ays-mt-0 { margin-top: 0; }
        .ays-mt-sm { margin-top: var(--ays-spacing-sm); }
        .ays-mt-md { margin-top: var(--ays-spacing-md); }
        .ays-mt-lg { margin-top: var(--ays-spacing-lg); }
        .ays-mt-xl { margin-top: var(--ays-spacing-xl); }
        .ays-mb-0 { margin-bottom: 0; }
        .ays-mb-sm { margin-bottom: var(--ays-spacing-sm); }
        .ays-mb-md { margin-bottom: var(--ays-spacing-md); }
        .ays-mb-lg { margin-bottom: var(--ays-spacing-lg); }
        .ays-mb-xl { margin-bottom: var(--ays-spacing-xl); }
        .ays-p-0 { padding: 0; }
        .ays-p-sm { padding: var(--ays-spacing-sm); }
        .ays-p-md { padding: var(--ays-spacing-md); }
        .ays-p-lg { padding: var(--ays-spacing-lg); }
        .ays-p-xl { padding: var(--ays-spacing-xl); }
        .ays-px-md { padding-left: var(--ays-spacing-md); padding-right: var(--ays-spacing-md); }
        .ays-py-md { padding-top: var(--ays-spacing-md); padding-bottom: var(--ays-spacing-md); }
        
        /* Text Utilities */
        .ays-text-center { text-align: center; }
        .ays-text-left { text-align: left; }
        .ays-text-right { text-align: right; }
        .ays-text-xs { font-size: var(--ays-font-size-xs); }
        .ays-text-sm { font-size: var(--ays-font-size-sm); }
        .ays-text-base { font-size: var(--ays-font-size-base); }
        .ays-text-lg { font-size: var(--ays-font-size-lg); }
        .ays-text-xl { font-size: var(--ays-font-size-xl); }
        .ays-text-bold { font-weight: var(--ays-font-weight-bold); }
        .ays-text-normal { font-weight: var(--ays-font-weight-normal); }
        
        /* Border Utilities */
        .ays-border-none { border: none; }
        .ays-border-sm { border: 1px solid var(--ays-color-gray-300); }
        .ays-rounded-sm { border-radius: var(--ays-radius-sm); }
        .ays-rounded-md { border-radius: var(--ays-radius-md); }
        .ays-rounded-lg { border-radius: var(--ays-radius-lg); }
        
        /* Shadow Utilities */
        .ays-shadow-sm { box-shadow: var(--ays-shadow-sm); }
        .ays-shadow-md { box-shadow: var(--ays-shadow-md); }
        .ays-shadow-lg { box-shadow: var(--ays-shadow-lg); }
        
        /* Transition Utilities */
        .ays-transition { transition: all var(--ays-transition-base); }
        .ays-transition-fast { transition: all var(--ays-transition-fast); }
        .ays-transition-slow { transition: all var(--ays-transition-slow); }
        
        /* Interactive Elements Base Styles */
        .ays-interactive {
            cursor: pointer;
            transition: all var(--ays-transition-base);
        }
        
        .ays-interactive:hover {
            transform: translateY(-1px);
        }
        
        .ays-interactive:active {
            transform: translateY(1px);
        }
        
        /* Focus States */
        .ays-focusable:focus {
            outline: none;
            box-shadow: var(--ays-shadow-focus);
        }
        
        /* Focus-Within State (for label highlighting) */
        .ays-field-wrapper:focus-within label {
            color: var(--ays-color-primary);
            transition: color var(--ays-transition-fast);
        }
        
        /* Error State */
        .ays-field-error {
            border-color: var(--ays-color-danger) !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
            transition: all var(--ays-transition-base);
        }
        
        .ays-field-error + label,
        .ays-field-wrapper.ays-error label {
            color: var(--ays-color-danger);
            transition: color var(--ays-transition-fast);
        }
        
        .ays-field-error:focus {
            border-color: var(--ays-color-danger) !important;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15) !important;
        }
        
        /* Success State */
        .ays-field-success {
            border-color: var(--ays-color-success) !important;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
            transition: all var(--ays-transition-base);
        }
        
        .ays-field-success + label,
        .ays-field-wrapper.ays-success label {
            color: var(--ays-color-success);
            transition: color var(--ays-transition-fast);
        }
        
        .ays-field-success:focus {
            border-color: var(--ays-color-success) !important;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15) !important;
        }
        
        /* Disabled State */
        .ays-field-disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background-color: var(--ays-color-gray-100);
            transition: all var(--ays-transition-base);
        }
        
        .ays-field-disabled:focus {
            box-shadow: none;
            border-color: var(--ays-color-gray-300) !important;
        }
        
        .ays-field-disabled + label,
        .ays-field-wrapper.ays-disabled label {
            opacity: 0.6;
            cursor: not-allowed;
            transition: opacity var(--ays-transition-fast);
        }
        
        /* Loading State (pulse animation) */
        @keyframes ays-pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }
        
        .ays-field-loading {
            animation: ays-pulse 1.5s ease-in-out infinite;
            border-color: var(--ays-color-primary) !important;
            transition: all var(--ays-transition-base);
        }
        
        .ays-field-loading:focus {
            border-color: var(--ays-color-primary) !important;
            box-shadow: var(--ays-shadow-focus);
        }
    `;
    
    // Inject the style tag into the document head
    (document.head || document.documentElement).appendChild(style);
    
    // ==================================================================
    // END CSS DESIGN SYSTEM
    // ==================================================================

    // ==================================================================
    // KEYBOARD SHORTCUTS REGISTRY SYSTEM
    // ==================================================================

    /**
     * Reserved browser shortcuts that should not be overridden
     * Common browser shortcuts that would break native functionality
     */
    const RESERVED_BROWSER_SHORTCUTS = [
        { key: 'Tab', modifiers: [], description: 'Tab navigation' },
        { key: 'Escape', modifiers: ['ctrl'], description: 'Close browser tab' },
        { key: 'F1', modifiers: [], description: 'Help' },
        { key: 'F5', modifiers: [], description: 'Refresh' },
        { key: 'F6', modifiers: [], description: 'Address bar' },
        { key: 'F7', modifiers: [], description: 'Caret browsing' },
        { key: 'F11', modifiers: [], description: 'Fullscreen' },
        { key: 'F12', modifiers: [], description: 'DevTools' },
        { key: 'c', modifiers: ['ctrl'], description: 'Copy' },
        { key: 'v', modifiers: ['ctrl'], description: 'Paste' },
        { key: 'x', modifiers: ['ctrl'], description: 'Cut' },
        { key: 'a', modifiers: ['ctrl'], description: 'Select all' },
        { key: 'z', modifiers: ['ctrl'], description: 'Undo' },
        { key: 'z', modifiers: ['ctrl', 'shift'], description: 'Redo' },
        { key: 'y', modifiers: ['ctrl'], description: 'Redo' },
        { key: 's', modifiers: ['ctrl'], description: 'Save' },
        { key: 'p', modifiers: ['ctrl'], description: 'Print' },
        { key: 'f', modifiers: ['ctrl'], description: 'Find' },
        { key: 'g', modifiers: ['ctrl'], description: 'Find next' },
        { key: 'g', modifiers: ['ctrl', 'shift'], description: 'Find previous' },
        { key: 'r', modifiers: ['ctrl'], description: 'Refresh' },
        { key: 'n', modifiers: ['ctrl'], description: 'New window' },
        { key: 't', modifiers: ['ctrl'], description: 'New tab' },
        { key: 'w', modifiers: ['ctrl'], description: 'Close tab' },
        { key: 'l', modifiers: ['ctrl'], description: 'Address bar' },
        { key: 'd', modifiers: ['ctrl'], description: 'Bookmark' },
        { key: 'j', modifiers: ['ctrl'], description: 'Downloads' },
        { key: '+', modifiers: ['ctrl'], description: 'Zoom in' },
        { key: '-', modifiers: ['ctrl'], description: 'Zoom out' },
        { key: '0', modifiers: ['ctrl'], description: 'Reset zoom' },
        { key: 'PageUp', modifiers: [], description: 'Page up' },
        { key: 'PageDown', modifiers: [], description: 'Page down' },
        { key: 'Home', modifiers: [], description: 'Home' },
        { key: 'End', modifiers: [], description: 'End' },
        { key: 'ArrowUp', modifiers: [], description: 'Scroll up' },
        { key: 'ArrowDown', modifiers: [], description: 'Scroll down' },
        { key: 'ArrowLeft', modifiers: [], description: 'Scroll left' },
        { key: 'ArrowRight', modifiers: [], description: 'Scroll right' },
        { key: ' ', modifiers: [], description: 'Page down (Space)' }
    ];

    /**
     * Keyboard Shortcuts Registry
     * Manages all keyboard shortcuts with conflict detection and customization support
     */
    const KEYBOARD_SHORTCUTS = {
        // Default shortcuts configuration
        defaults: [
            {
                actionId: 'executeSavedSearch1',
                displayName: 'Execute Saved Search 1',
                defaultCombo: { key: '1', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch2',
                displayName: 'Execute Saved Search 2',
                defaultCombo: { key: '2', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch3',
                displayName: 'Execute Saved Search 3',
                defaultCombo: { key: '3', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch4',
                displayName: 'Execute Saved Search 4',
                defaultCombo: { key: '4', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch5',
                displayName: 'Execute Saved Search 5',
                defaultCombo: { key: '5', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch6',
                displayName: 'Execute Saved Search 6',
                defaultCombo: { key: '6', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch7',
                displayName: 'Execute Saved Search 7',
                defaultCombo: { key: '7', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch8',
                displayName: 'Execute Saved Search 8',
                defaultCombo: { key: '8', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'executeSavedSearch9',
                displayName: 'Execute Saved Search 9',
                defaultCombo: { key: '9', modifiers: ['alt'] },
                userCombo: null,
                isCustomizable: false
            },
            {
                actionId: 'focusSearch',
                displayName: 'Focus Search',
                defaultCombo: { key: 'k', modifiers: ['ctrl'] },
                userCombo: null,
                isCustomizable: true
            },
            {
                actionId: 'closePopup',
                displayName: 'Close Popup',
                defaultCombo: { key: 'Escape', modifiers: [] },
                userCombo: null,
                isCustomizable: true
            },
            {
                actionId: 'executeSearch',
                displayName: 'Execute Search',
                defaultCombo: { key: 'Enter', modifiers: [] },
                userCombo: null,
                isCustomizable: true
            }
        ],

        /**
         * Get all shortcuts with user customizations applied
         */
        getAllShortcuts() {
            const savedCustomizations = getCustomShortcuts();
            return this.defaults.map(shortcut => ({
                ...shortcut,
                userCombo: savedCustomizations[shortcut.actionId] || shortcut.userCombo
            }));
        },

        /**
         * Get active combo for a specific action (user combo if set, otherwise default)
         */
        getActiveCombo(actionId) {
            const shortcut = this.getAllShortcuts().find(s => s.actionId === actionId);
            if (!shortcut) return null;
            return shortcut.userCombo || shortcut.defaultCombo;
        },

        /**
         * Find action associated with a keyboard event
         */
        findActionForEvent(event) {
            const shortcuts = this.getAllShortcuts();
            const eventCombo = this.eventToCombo(event);
            
            if (!eventCombo) return null;

            return shortcuts.find(shortcut => {
                const combo = shortcut.userCombo || shortcut.defaultCombo;
                return combo.key.toLowerCase() === eventCombo.key.toLowerCase() &&
                       this.arraysEqual(combo.modifiers, eventCombo.modifiers);
            });
        },

        /**
         * Convert keyboard event to combo object
         */
        eventToCombo(event) {
            if (event.ctrlKey && event.key === 'k') {
                return { key: 'k', modifiers: ['ctrl'] };
            }

            const modifiers = [];
            if (event.ctrlKey) modifiers.push('ctrl');
            if (event.altKey) modifiers.push('alt');
            if (event.shiftKey) modifiers.push('shift');
            if (event.metaKey) modifiers.push('meta');

            return {
                key: event.key,
                modifiers: modifiers.sort()
            };
        },

        /**
         * Check if a combo conflicts with reserved browser shortcuts
         */
        isReservedShortcut(combo) {
            return RESERVED_BROWSER_SHORTCUTS.some(reserved => {
                return reserved.key.toLowerCase() === combo.key.toLowerCase() &&
                       this.arraysEqual(reserved.modifiers, combo.modifiers);
            });
        },

        /**
         * Get reserved shortcut description if it exists
         */
        getReservedShortcutDescription(combo) {
            const reserved = RESERVED_BROWSER_SHORTCUTS.find(r => {
                return r.key.toLowerCase() === combo.key.toLowerCase() &&
                       this.arraysEqual(r.modifiers, combo.modifiers);
            });
            return reserved ? reserved.description : null;
        },

        /**
         * Find conflicting shortcut
         */
        findConflict(combo, excludeActionId = null) {
            const shortcuts = this.getAllShortcuts();
            
            return shortcuts.find(shortcut => {
                if (excludeActionId && shortcut.actionId === excludeActionId) return false;
                
                const existingCombo = shortcut.userCombo || shortcut.defaultCombo;
                return existingCombo.key.toLowerCase() === combo.key.toLowerCase() &&
                       this.arraysEqual(existingCombo.modifiers, combo.modifiers);
            });
        },

        /**
         * Check if a combo conflicts with existing shortcuts
         */
        hasConflict(combo, excludeActionId = null) {
            return this.findConflict(combo, excludeActionId) !== undefined;
        },

        /**
         * Validate a shortcut combo
         */
        isValidCombo(combo) {
            if (!combo || !combo.key) return false;
            
            const validModifiers = ['ctrl', 'alt', 'shift', 'meta'];
            if (!combo.modifiers.every(m => validModifiers.includes(m))) return false;
            
            return true;
        },

        /**
         * Set user-defined shortcut for an action
         */
        setCustomShortcut(actionId, combo) {
            if (!this.isValidCombo(combo)) {
                throw new Error('Invalid shortcut combination');
            }

            const shortcut = this.defaults.find(s => s.actionId === actionId);
            if (!shortcut) {
                throw new Error('Action not found');
            }

            if (!shortcut.isCustomizable) {
                throw new Error('This shortcut cannot be customized');
            }

            if (this.hasConflict(combo, actionId)) {
                throw new Error('Shortcut conflicts with existing shortcut');
            }

            const savedCustomizations = getCustomShortcuts();
            savedCustomizations[actionId] = combo;
            saveCustomShortcuts(savedCustomizations);
        },

        /**
         * Reset a shortcut to default
         */
        resetShortcut(actionId) {
            const savedCustomizations = getCustomShortcuts();
            delete savedCustomizations[actionId];
            saveCustomShortcuts(savedCustomizations);
        },

        /**
         * Reset all shortcuts to defaults
         */
        resetAllShortcuts() {
            localStorage.removeItem(KEYBOARD_SHORTCUTS_KEY);
        },

        /**
         * Helper to compare arrays
         */
        arraysEqual(a, b) {
            if (a.length !== b.length) return false;
            return a.every((val, i) => val === b[i]);
        },

        /**
         * Format combo for display
         */
        formatCombo(combo) {
            if (!combo) return '';
            const modifierNames = {
                ctrl: 'Ctrl',
                alt: 'Alt',
                shift: 'Shift',
                meta: 'Cmd'
            };
            const modifierStr = combo.modifiers
                .map(m => modifierNames[m] || m)
                .join(' + ');
            return modifierStr ? `${modifierStr} + ${combo.key}` : combo.key;
        }
    };

    // ==================================================================
    // END KEYBOARD SHORTCUTS REGISTRY SYSTEM
    // ==================================================================

    // Wait until the YouTube page is fully loaded
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, me) => {
            const element = document.querySelector(selector);
            if (element) {
                me.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Mapping for video length to 'sp' parameter
    const videoLengthOptions = {
        "any": "",
        "short": "EgIYAQ%253D%253D",      // Under 4 minutes
        "medium": "EgIYAw%253D%253D",     // 4-20 minutes
        "long": "EgIYAg%253D%253D"        // Over 20 minutes
    };

    // Quick Filter Presets - constant array for easy maintenance and addition
    const QUICK_FILTER_PRESETS = [
        {
            id: 'hd-4k',
            name: 'HD 4K',
            description: 'High quality videos over 20 minutes',
            icon: '🎬',
            category: 'Quality',
            keyboardShortcut: 'Alt+Q',
            parameters: {
                videoLength: 'long',
                notes: 'Filter for HD/4K content (note: YouTube HD filtering requires sp parameter)'
            }
        },
        {
            id: 'this-week',
            name: 'This Week',
            description: 'Videos from the past 7 days',
            icon: '📅',
            category: 'Date',
            keyboardShortcut: 'Alt+W',
            parameters: {
                dateRange: 'this_week',
                notes: 'Filter to videos uploaded in the last 7 days'
            }
        },
        {
            id: 'popular',
            name: 'Popular',
            description: 'Sort by view count',
            icon: '🔥',
            category: 'Sorting',
            keyboardShortcut: 'Alt+P',
            parameters: {
                sortBy: 'view_count',
                spParam: 'CAM%253D',
                notes: 'Sort results by view count (Popularity)'
            }
        },
        {
            id: 'recent',
            name: 'Recent',
            description: 'Sort by upload date',
            icon: '🕐',
            category: 'Sorting',
            keyboardShortcut: 'Alt+R',
            parameters: {
                sortBy: 'date',
                spParam: 'CAI%253D',
                notes: 'Sort results by upload date'
            }
        },
        {
            id: 'hd-only',
            name: 'HD Only',
            description: 'High definition quality videos',
            icon: '✨',
            category: 'Quality',
            keyboardShortcut: 'Alt+H',
            parameters: {
                notes: 'Filter for HD content (note: YouTube HD filtering requires sp parameter)'
            }
        },
        {
            id: 'shorts',
            name: 'Shorts',
            description: 'Videos under 4 minutes',
            icon: '⚡',
            category: 'Duration',
            keyboardShortcut: 'Alt+S',
            parameters: {
                videoLength: 'short',
                notes: 'Filter for short-form content'
            }
        },
        {
            id: 'today',
            name: 'Today',
            description: 'Videos from the last 24 hours',
            icon: '📆',
            category: 'Date',
            keyboardShortcut: 'Alt+T',
            parameters: {
                dateRange: 'today',
                notes: 'Filter to videos uploaded today'
            }
        },
        {
            id: 'long-form',
            name: 'Long Form',
            description: 'Videos over 20 minutes',
            icon: '📺',
            category: 'Duration',
            keyboardShortcut: 'Alt+L',
            parameters: {
                videoLength: 'long',
                notes: 'Filter for in-depth, long-form content'
            }
        }
    ];

    // Helper function to get date range for preset
    function getDateRangeForPreset(rangeType) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch(rangeType) {
            case 'today':
                return {
                    dateAfter: today.toISOString().split('T')[0],
                    dateBefore: today.toISOString().split('T')[0]
                };
            case 'this_week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return {
                    dateAfter: weekAgo.toISOString().split('T')[0],
                    dateBefore: null
                };
            case 'this_month':
                const monthAgo = new Date(today);
                monthAgo.setDate(monthAgo.getDate() - 30);
                return {
                    dateAfter: monthAgo.toISOString().split('T')[0],
                    dateBefore: null
                };
            default:
                return { dateAfter: null, dateBefore: null };
        }
    }

        // Storage key for saved searches in localStorage
        const STORAGE_KEY = 'advancedYoutubeSearches';
        // Storage key for custom presets in localStorage
        const CUSTOM_PRESETS_KEY = 'advancedYoutubeCustomPresets';
        // Storage key for active preset state in localStorage
        const ACTIVE_PRESET_KEY = 'advancedYoutubeActivePreset';
        // Storage key for preset version (for migration)
        const PRESET_VERSION_KEY = 'advancedYoutubePresetVersion';
        const CURRENT_PRESET_VERSION = '1.0.0';
        // Storage key for keyboard shortcuts customizations
        const KEYBOARD_SHORTCUTS_KEY = 'advancedYoutubeKeyboardShortcuts';
        // Storage key for shortcuts version (for migration)
        const SHORTCUTS_VERSION_KEY = 'advancedYoutubeShortcutsVersion';
        const CURRENT_SHORTCUTS_VERSION = '1.0.0';

        /**
         * Validate keyboard shortcuts data structure
         * @param {Object} shortcuts - The shortcuts object to validate
         * @returns {boolean} True if valid, false otherwise
         */
        function isValidShortcutsData(shortcuts) {
            if (!shortcuts || typeof shortcuts !== 'object') return false;

            for (const actionId in shortcuts) {
                const shortcut = shortcuts[actionId];
                if (!shortcut || typeof shortcut !== 'object') return false;
                if (typeof shortcut.key !== 'string' || !shortcut.key) return false;
                if (!Array.isArray(shortcut.modifiers)) return false;
                if (!shortcut.modifiers.every(m => ['ctrl', 'alt', 'shift', 'meta'].includes(m))) return false;
            }

            return true;
        }

        /**
         * Load custom shortcuts with validation and migration
         * @returns {Object} Validated custom shortcuts object
         */
        function getCustomShortcuts() {
            try {
                const stored = localStorage.getItem(KEYBOARD_SHORTCUTS_KEY);
                if (!stored) {
                    return {};
                }

                const shortcuts = JSON.parse(stored);

                // Validate shortcuts data structure
                if (!isValidShortcutsData(shortcuts)) {
                    console.warn('Invalid keyboard shortcuts data structure, resetting');
                    localStorage.removeItem(KEYBOARD_SHORTCUTS_KEY);
                    return {};
                }

                return shortcuts;
            } catch (error) {
                console.error('Failed to load custom shortcuts:', error);
                return {};
            }
        }

        /**
         * Save custom shortcuts to localStorage
         * @param {Object} shortcuts - The shortcuts object to save
         * @returns {boolean} True if successful, false otherwise
         */
        function saveCustomShortcuts(shortcuts) {
            try {
                localStorage.setItem(KEYBOARD_SHORTCUTS_KEY, JSON.stringify(shortcuts));
                return true;
            } catch (error) {
                console.error('Failed to save custom shortcuts:', error);
                return false;
            }
        }

        /**
         * Handle migration when shortcuts structure changes in future versions
         */
        function handleShortcutsMigration() {
            const currentVersion = localStorage.getItem(SHORTCUTS_VERSION_KEY);

            // If this is a new installation or version has changed
            if (!currentVersion || currentVersion !== CURRENT_SHORTCUTS_VERSION) {
                console.log(`Migrating shortcuts from ${currentVersion || 'none'} to ${CURRENT_SHORTCUTS_VERSION}`);

                // Load existing custom shortcuts
                const existingShortcuts = getCustomShortcuts();

                // Future migration logic can go here, for example:
                // - Renaming action IDs
                // - Restructuring shortcuts data
                // - Removing deprecated shortcuts
                // - Adding new default shortcuts
                // - Converting old shortcut formats

                // Example migration for future versions:
                // if (currentVersion === '1.0.0' && CURRENT_SHORTCUTS_VERSION === '1.1.0') {
                //     existingShortcuts['newActionId'] = existingShortcuts['oldActionId'];
                //     delete existingShortcuts['oldActionId'];
                // }

                // Re-validate and save migrated shortcuts
                if (Object.keys(existingShortcuts).length > 0) {
                    if (isValidShortcutsData(existingShortcuts)) {
                        saveCustomShortcuts(existingShortcuts);
                        console.log('Shortcuts migrated successfully');
                    } else {
                        console.warn('Shortcuts migration failed validation, resetting to defaults');
                        localStorage.removeItem(KEYBOARD_SHORTCUTS_KEY);
                    }
                }

                // Update the version to current
                localStorage.setItem(SHORTCUTS_VERSION_KEY, CURRENT_SHORTCUTS_VERSION);
            }
        }

        // Load custom presets from localStorage
        function getCustomPresets() {
            try {
                const stored = localStorage.getItem(CUSTOM_PRESETS_KEY);
                if (!stored) {
                    return [];
                }

                const presets = JSON.parse(stored);

                // Validate preset data structure
                if (!Array.isArray(presets)) {
                    console.warn('Invalid custom presets data structure, resetting');
                    return [];
                }

                // Filter out invalid presets
                const validPresets = presets.filter(preset => {
                    return preset &&
                           typeof preset === 'object' &&
                           typeof preset.name === 'string' &&
                           typeof preset.description === 'string' &&
                           typeof preset.id === 'string';
                });

                if (validPresets.length !== presets.length) {
                    console.warn(`Filtered out ${presets.length - validPresets.length} invalid custom presets`);
                    saveCustomPresets(validPresets);
                }

                return validPresets;
            } catch (error) {
                console.error('Failed to load custom presets:', error);
                return [];
            }
        }

        // Save custom presets to localStorage
        function saveCustomPresets(customPresets) {
            try {
                localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
                return true;
            } catch (error) {
                console.error('Failed to save custom presets:', error);
                return false;
            }
        }

        // Handle migration when adding new default presets in future versions
        function handlePresetMigration() {
            const currentVersion = localStorage.getItem(PRESET_VERSION_KEY);

            // If this is a new installation or version has changed
            if (!currentVersion || currentVersion !== CURRENT_PRESET_VERSION) {
                console.log(`Migrating presets from ${currentVersion || 'none'} to ${CURRENT_PRESET_VERSION}`);

                // Future migration logic can go here
                // For example: merging new default presets, updating preset structure, etc.

                // Update the version to current
                localStorage.setItem(PRESET_VERSION_KEY, CURRENT_PRESET_VERSION);
            }
        }

        // Get all presets (built-in + custom)
        function getAllPresets() {
            return [...QUICK_FILTER_PRESETS, ...getCustomPresets()];
        }

        // Add a new custom preset
        function addCustomPreset(preset) {
            const customPresets = getCustomPresets();
            preset.id = 'custom_' + Date.now();
            preset.isCustom = true;
            customPresets.push(preset);
            return saveCustomPresets(customPresets);
        }

        // Update an existing custom preset
        function updateCustomPreset(presetId, updatedPreset) {
            const customPresets = getCustomPresets();
            const index = customPresets.findIndex(p => p.id === presetId);
            if (index === -1) return false;

            customPresets[index] = { ...customPresets[index], ...updatedPreset };
            return saveCustomPresets(customPresets);
        }

        // Delete a custom preset
        function deleteCustomPreset(presetId) {
            const customPresets = getCustomPresets();
            const filtered = customPresets.filter(p => p.id !== presetId);
            if (filtered.length === customPresets.length) return false;
            return saveCustomPresets(filtered);
        }

        // Reorder custom presets
        function reorderCustomPresets(newOrder) {
            return saveCustomPresets(newOrder);
        }

    /**
     * Validate if localStorage is available and accessible
     * @returns {boolean} True if localStorage is available, false otherwise
     */
    function isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Sanitize a string to prevent XSS and ensure safe storage
     * @param {string} str - The string to sanitize
     * @returns {string} Sanitized string
     */
    function sanitizeString(str) {
        if (typeof str !== 'string') return '';
        // Remove HTML tags and escape special characters
        return str
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }

    /**
     * Validate a saved search object structure
     * @param {Object} search - The search object to validate
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidSearchObject(search) {
        if (!search || typeof search !== 'object') return false;
        if (!search.id || typeof search.id !== 'string') return false;
        if (!search.name || typeof search.name !== 'string') return false;
        if (!search.config || typeof search.config !== 'object') return false;
        return true;
    }

    /**
     * Validate search configuration object
     * @param {Object} config - The config object to validate
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidConfig(config) {
        if (!config || typeof config !== 'object') return false;
        // All fields are optional, but if present, must be strings
        const allowedFields = ['regularSearch', 'exactTerm', 'excludeTerms', 'titleIncludes', 'videoLength', 'dateAfter', 'dateBefore'];
        for (const key in config) {
            if (!allowedFields.includes(key)) return false;
            if (typeof config[key] !== 'string') return false;
        }
        return true;
    }

    /**
     * Load data from localStorage with comprehensive error handling
     * @returns {Object} Object with success flag, data array, and error message
     */
    function loadFromStorage() {
        const result = {
            success: false,
            data: [],
            error: null
        };

        // Check if localStorage is available
        if (!isStorageAvailable()) {
            result.error = 'localStorage is not available. Your browser may be in private mode or localStorage is disabled.';
            return result;
        }

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) {
                result.success = true;
                result.data = [];
                return result;
            }

            const parsed = JSON.parse(data);

            // Ensure we have an array
            if (!Array.isArray(parsed)) {
                result.error = 'Corrupted data: expected an array of searches';
                result.data = [];
                return result;
            }

            // Filter out invalid search objects
            const validSearches = parsed.filter(search => isValidSearchObject(search));

            // If we filtered out some corrupted searches, note it
            if (validSearches.length !== parsed.length) {
                console.warn(`Filtered out ${parsed.length - validSearches.length} corrupted search(es)`);
            }

            result.success = true;
            result.data = validSearches;
            return result;

        } catch (error) {
            if (error instanceof SyntaxError) {
                result.error = 'Corrupted data: unable to parse saved searches';
            } else if (error.name === 'SecurityError') {
                result.error = 'Security error: unable to access localStorage';
            } else {
                result.error = `Error loading saved searches: ${error.message}`;
            }
            result.data = [];
            return result;
        }
    }

    /**
     * Save data to localStorage with comprehensive error handling
     * @param {Array} data - The data array to save to localStorage
     * @returns {Object} Object with success flag and error message
     */
    function saveToStorage(data) {
        const result = {
            success: false,
            error: null
        };

        // Check if localStorage is available
        if (!isStorageAvailable()) {
            result.error = 'localStorage is not available. Your browser may be in private mode or localStorage is disabled.';
            return result;
        }

        // Validate input
        if (!Array.isArray(data)) {
            result.error = 'Invalid data: expected an array';
            return result;
        }

        try {
            const serialized = JSON.stringify(data);

            // Check if data size is reasonable (warn if > 1MB)
            if (serialized.length > 1000000) {
                console.warn('Saved searches data is very large (>1MB), consider removing old searches');
            }

            localStorage.setItem(STORAGE_KEY, serialized);
            result.success = true;
            return result;

        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                result.error = 'Storage quota exceeded. Please delete some saved searches or clear browser data.';
            } else if (error.name === 'SecurityError') {
                result.error = 'Security error: unable to save to localStorage';
            } else {
                result.error = `Error saving searches: ${error.message}`;
            }
            return result;
        }
    }

    /**
     * Generate a unique ID for a saved search
     * @returns {string} Unique identifier based on timestamp
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Generic storage helper: Get data from localStorage by key
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The stored data or defaultValue
     */
    function getFromStorage(key, defaultValue = null) {
        if (!isStorageAvailable()) {
            return defaultValue;
        }

        try {
            const stored = localStorage.getItem(key);
            if (stored === null) {
                return defaultValue;
            }

            return JSON.parse(stored);
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return defaultValue;
        }
    }

    /**
     * Generic storage helper: Save data to localStorage by key
     * @param {string} key - The storage key
     * @param {*} data - The data to save
     * @returns {boolean} True if successful, false otherwise
     */
    function saveToStorageByKey(key, data) {
        if (!isStorageAvailable()) {
            console.error('localStorage is not available');
            return false;
        }

        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to storage:`, error);
            return false;
        }
    }

    /**
     * Save a search configuration to localStorage
     * @param {Object} searchData - The search data to save
     * @param {string} searchData.name - Name of the saved search
     * @param {string} searchData.folder - Optional folder/category
     * @param {Object} searchData.config - Search configuration
     * @returns {Object} Object with success flag, search data, and error message
     */
    function saveSearch(searchData) {
        const result = {
            success: false,
            data: null,
            error: null
        };

        // Validate input
        if (!searchData || typeof searchData !== 'object') {
            result.error = 'Invalid search data';
            return result;
        }

        if (!searchData.name || typeof searchData.name !== 'string') {
            result.error = 'Search name is required';
            return result;
        }

        // Validate config
        if (!isValidConfig(searchData.config)) {
            result.error = 'Invalid search configuration';
            return result;
        }

        // Load existing searches
        const loadResult = loadFromStorage();
        if (!loadResult.success) {
            result.error = loadResult.error || 'Failed to load existing searches';
            return result;
        }

        const searches = loadResult.data;

        // Check for duplicate names (within the same folder)
        const folder = searchData.folder || '';
        const isDuplicate = searches.some(search =>
            search.name.trim().toLowerCase() === searchData.name.trim().toLowerCase() &&
            (search.folder || '') === folder
        );

        if (isDuplicate) {
            result.error = `A search named "${searchData.name}" already exists in this folder. Please use a different name.`;
            return result;
        }

        // Create new search object
        const newSearch = {
            id: generateId(),
            name: sanitizeString(searchData.name),
            folder: sanitizeString(searchData.folder || ''),
            config: searchData.config,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        searches.push(newSearch);

        // Save to storage
        const saveResult = saveToStorage(searches);
        if (!saveResult.success) {
            result.error = saveResult.error || 'Failed to save search';
            return result;
        }

        result.success = true;
        result.data = newSearch;
        return result;
    }

    /**
     * Retrieve all saved searches from localStorage
     * @returns {Object} Object with success flag, data array, and error message
     */
    function getAllSearches() {
        return loadFromStorage();
    }

    /**
     * Get a specific saved search by ID
     * @param {string} id - The search ID to retrieve
     * @returns {Object} Object with success flag, search data, and error message
     */
    function getSearchById(id) {
        const result = {
            success: false,
            data: null,
            error: null
        };

        if (!id || typeof id !== 'string') {
            result.error = 'Invalid search ID';
            return result;
        }

        const loadResult = loadFromStorage();
        if (!loadResult.success) {
            result.error = loadResult.error || 'Failed to load searches';
            return result;
        }

        const search = loadResult.data.find(search => search.id === id);

        if (!search) {
            result.error = 'Search not found';
            return result;
        }

        result.success = true;
        result.data = search;
        return result;
    }

    /**
     * Update an existing saved search
     * @param {string} id - The ID of the search to update
     * @param {Object} newData - The new data to update
     * @returns {Object} Object with success flag, search data, and error message
     */
    function updateSearch(id, newData) {
        const result = {
            success: false,
            data: null,
            error: null
        };

        if (!id || typeof id !== 'string') {
            result.error = 'Invalid search ID';
            return result;
        }

        if (!newData || typeof newData !== 'object') {
            result.error = 'Invalid update data';
            return result;
        }

        const loadResult = loadFromStorage();
        if (!loadResult.success) {
            result.error = loadResult.error || 'Failed to load searches';
            return result;
        }

        const searches = loadResult.data;
        const index = searches.findIndex(search => search.id === id);

        if (index === -1) {
            result.error = 'Search not found';
            return result;
        }

        // Validate name if provided
        if (newData.name !== undefined) {
            if (!newData.name || typeof newData.name !== 'string') {
                result.error = 'Invalid search name';
                return result;
            }

            // Check for duplicate names (excluding current search)
            const folder = (newData.folder !== undefined ? newData.folder : searches[index].folder) || '';
            const isDuplicate = searches.some(search =>
                search.id !== id &&
                search.name.trim().toLowerCase() === newData.name.trim().toLowerCase() &&
                (search.folder || '') === folder
            );

            if (isDuplicate) {
                result.error = `A search named "${newData.name}" already exists in this folder`;
                return result;
            }
        }

        // Validate config if provided
        if (newData.config !== undefined && !isValidConfig(newData.config)) {
            result.error = 'Invalid search configuration';
            return result;
        }

        // Update search while preserving id and createdAt
        searches[index] = {
            ...searches[index],
            ...newData,
            id: searches[index].id,
            createdAt: searches[index].createdAt,
            updatedAt: new Date().toISOString()
        };

        // Sanitize string fields
        if (searches[index].name) {
            searches[index].name = sanitizeString(searches[index].name);
        }
        if (searches[index].folder !== undefined) {
            searches[index].folder = sanitizeString(searches[index].folder);
        }

        const saveResult = saveToStorage(searches);
        if (!saveResult.success) {
            result.error = saveResult.error || 'Failed to update search';
            return result;
        }

        result.success = true;
        result.data = searches[index];
        return result;
    }

    /**
     * Delete a saved search by ID
     * @param {string} id - The ID of the search to delete
     * @returns {Object} Object with success flag and error message
     */
    function deleteSearch(id) {
        const result = {
            success: false,
            error: null
        };

        if (!id || typeof id !== 'string') {
            result.error = 'Invalid search ID';
            return result;
        }

        const loadResult = loadFromStorage();
        if (!loadResult.success) {
            result.error = loadResult.error || 'Failed to load searches';
            return result;
        }

        const searches = loadResult.data;
        const filteredSearches = searches.filter(search => search.id !== id);

        if (filteredSearches.length === searches.length) {
            result.error = 'Search not found';
            return result;
        }

        const saveResult = saveToStorage(filteredSearches);
        if (!saveResult.success) {
            result.error = saveResult.error || 'Failed to delete search';
            return result;
        }

        result.success = true;
        return result;
    }

    /**
     * Reorder a saved search by moving it up or down within its folder
     * @param {string} id - The ID of the search to reorder
     * @param {string} direction - 'up' or 'down'
     * @returns {Object} Object with success flag and error message
     */
    function reorderSearch(id, direction) {
        const result = {
            success: false,
            error: null
        };

        if (!id || typeof id !== 'string') {
            result.error = 'Invalid search ID';
            return result;
        }

        if (direction !== 'up' && direction !== 'down') {
            result.error = 'Invalid direction. Must be "up" or "down"';
            return result;
        }

        const loadResult = loadFromStorage();
        if (!loadResult.success) {
            result.error = loadResult.error || 'Failed to load searches';
            return result;
        }

        const searches = loadResult.data;
        const searchIndex = searches.findIndex(search => search.id === id);

        if (searchIndex === -1) {
            result.error = 'Search not found';
            return result;
        }

        const currentSearch = searches[searchIndex];
        const currentFolder = currentSearch.folder || '';

        // Find all searches in the same folder
        const folderSearches = searches
            .map((search, index) => ({ ...search, originalIndex: index }))
            .filter(search => (search.folder || '') === currentFolder);

        const positionInFolder = folderSearches.findIndex(s => s.id === id);

        if (positionInFolder === -1) {
            result.error = 'Search position error';
            return result;
        }

        // Calculate the target position
        let targetPosition;
        if (direction === 'up') {
            if (positionInFolder === 0) {
                result.error = 'Already at the top of the folder';
                return result;
            }
            targetPosition = positionInFolder - 1;
        } else if (direction === 'down') {
            if (positionInFolder === folderSearches.length - 1) {
                result.error = 'Already at the bottom of the folder';
                return result;
            }
            targetPosition = positionInFolder + 1;
        } else {
            result.error = 'Invalid direction';
            return result;
        }

        // Get the search to swap with
        const targetSearch = folderSearches[targetPosition];

        // Swap the searches in the original array
        const temp = searches[searchIndex];
        searches[searchIndex] = searches[targetSearch.originalIndex];
        searches[targetSearch.originalIndex] = temp;

        const saveResult = saveToStorage(searches);
        if (!saveResult.success) {
            result.error = saveResult.error || 'Failed to reorder search';
            return result;
        }

        result.success = true;
        return result;
    }

    /**
     * Apply consistent button styling with hover effects
     * @param {HTMLElement} button - The button element to style
     * @param {string} baseColor - The base background color
     * @param {string} hoverColor - The hover background color
     */
    function applyButtonStyle(button, baseColor, hoverColor) {
        const originalColor = baseColor;
        button.style.transition = 'all var(--ays-transition-base)';
        button.style.transformOrigin = 'center center';

        button.addEventListener('mouseenter', function() {
            button.style.backgroundColor = hoverColor;
            button.style.transform = 'scale(1.02) translateY(-1px)';
            button.style.boxShadow = 'var(--ays-shadow-md)';
        });

        button.addEventListener('mouseleave', function() {
            button.style.backgroundColor = originalColor;
            button.style.transform = 'scale(1) translateY(0)';
            button.style.boxShadow = '';
        });

        button.addEventListener('mousedown', function() {
            button.style.transform = 'scale(0.98) translateY(1px)';
            button.style.boxShadow = 'var(--ays-shadow-xs)';
        });

        button.addEventListener('mouseup', function() {
            button.style.transform = 'scale(1.02) translateY(-1px)';
            button.style.boxShadow = 'var(--ays-shadow-md)';
        });
    }

    /**
     * Apply modal fade-in/fade-out animation
     * @param {HTMLElement} modal - The modal element
     * @param {boolean} show - Whether to show or hide the modal
     */
    function animateModal(modal, show) {
        if (show) {
            modal.style.display = 'block';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity var(--ays-transition-slow)';
            modal.style.backdropFilter = 'blur(8px)';
            modal.style.webkitBackdropFilter = 'blur(8px)';

            // Trigger reflow
            void modal.offsetWidth;

            modal.style.opacity = '1';
        } else {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.style.opacity === '0') {
                    modal.style.display = 'none';
                }
            }, 300);
        }
    }

    /**
     * Show a toast notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success, error, info)
     * @param {number} duration - Duration in milliseconds (default 3000)
     */
    function showToast(message, type = 'info', duration = 3000) {
        // Remove existing toast if any
        const existingToast = document.getElementById('ays-toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'ays-toast-notification';
        toast.innerText = message;

        // Base styles
        toast.style.position = 'fixed';
        toast.style.bottom = '80px';
        toast.style.right = '20px';
        toast.style.zIndex = 'var(--ays-z-toast)';
        toast.style.padding = 'var(--ays-spacing-md) var(--ays-spacing-xl)';
        toast.style.borderRadius = 'var(--ays-radius-md)';
        toast.style.color = 'var(--ays-color-white)';
        toast.style.fontSize = 'var(--ays-font-size-sm)';
        toast.style.fontWeight = 'var(--ays-font-weight-bold)';
        toast.style.fontFamily = 'var(--ays-font-family)';
        toast.style.boxShadow = 'var(--ays-shadow-lg)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all var(--ays-transition-slow)';
        toast.style.maxWidth = '350px';
        toast.style.wordWrap = 'break-word';

        // Type-specific styles
        switch(type) {
            case 'success':
                toast.style.backgroundColor = 'var(--ays-color-success)';
                toast.innerHTML = '✓ ' + message;
                break;
            case 'error':
                toast.style.backgroundColor = 'var(--ays-color-danger)';
                toast.innerHTML = '✗ ' + message;
                break;
            case 'info':
            default:
                toast.style.backgroundColor = 'var(--ays-color-secondary)';
                toast.innerHTML = 'ℹ ' + message;
                break;
        }

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    // Create and inject the toggle button and advanced search popup
    function injectAdvancedSearchPopup() {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.innerText = '🔍 Advanced Search';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '20px';
        toggleButton.style.right = '20px';
        toggleButton.style.zIndex = '1000';
        toggleButton.style.padding = 'var(--ays-spacing-md) var(--ays-spacing-lg)';
        toggleButton.style.backgroundColor = 'var(--ays-color-primary)';
        toggleButton.style.color = 'var(--ays-color-white)';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = 'var(--ays-radius-md)';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.boxShadow = 'var(--ays-shadow-sm)';
        toggleButton.style.fontSize = 'var(--ays-font-size-sm)';
        toggleButton.style.fontWeight = 'var(--ays-font-weight-bold)';
        toggleButton.style.fontFamily = 'var(--ays-font-family)';
        toggleButton.style.transition = 'all var(--ays-transition-base)';
        toggleButton.title = 'Toggle Advanced YouTube Search';

        // Apply modern hover effect with scale transform
        toggleButton.addEventListener('mouseenter', function() {
            toggleButton.style.backgroundColor = 'var(--ays-color-primary-dark)';
            toggleButton.style.transform = 'scale(1.05)';
            toggleButton.style.boxShadow = 'var(--ays-shadow-md)';
        });

        toggleButton.addEventListener('mouseleave', function() {
            toggleButton.style.backgroundColor = 'var(--ays-color-primary)';
            toggleButton.style.transform = 'scale(1)';
            toggleButton.style.boxShadow = 'var(--ays-shadow-sm)';
        });

        toggleButton.addEventListener('mousedown', function() {
            toggleButton.style.transform = 'scale(0.98)';
            toggleButton.style.boxShadow = 'var(--ays-shadow-xs)';
        });

        toggleButton.addEventListener('mouseup', function() {
            toggleButton.style.transform = 'scale(1.05)';
            toggleButton.style.boxShadow = 'var(--ays-shadow-md)';
        });

        document.body.appendChild(toggleButton);

        // Create the popup container
        const popupDiv = document.createElement('div');
        popupDiv.id = 'advancedSearchPopup';
        popupDiv.style.position = 'fixed';
        popupDiv.style.top = '100px';
        popupDiv.style.left = '50%';
        popupDiv.style.transform = 'translateX(-50%)';
        popupDiv.style.width = '450px';
        popupDiv.style.maxWidth = 'calc(100vw - 40px)';
        popupDiv.style.backgroundColor = 'var(--ays-color-white)';
        popupDiv.style.border = '1px solid var(--ays-color-gray-300)';
        popupDiv.style.borderRadius = 'var(--ays-radius-lg)';
        popupDiv.style.boxShadow = 'var(--ays-shadow-lg)';
        popupDiv.style.padding = '0';
        popupDiv.style.zIndex = '1001';
        popupDiv.style.display = 'none'; // Initially hidden
        popupDiv.style.cursor = 'default';
        popupDiv.style.fontFamily = 'var(--ays-font-family)';
        popupDiv.style.transition = 'opacity var(--ays-transition-base)';

        // Create the popup header for dragging
        const popupHeader = document.createElement('div');
        popupHeader.style.backgroundColor = 'var(--ays-color-primary)';
        popupHeader.style.color = 'var(--ays-color-white)';
        popupHeader.style.padding = 'var(--ays-spacing-md)';
        popupHeader.style.cursor = 'move';
        popupHeader.style.borderTopLeftRadius = 'var(--ays-radius-lg)';
        popupHeader.style.borderTopRightRadius = 'var(--ays-radius-lg)';
        popupHeader.style.fontSize = 'var(--ays-font-size-lg)';
        popupHeader.style.fontWeight = 'var(--ays-font-weight-bold)';
        popupHeader.style.fontFamily = 'var(--ays-font-family)';
        popupHeader.style.display = 'flex';
        popupHeader.style.alignItems = 'center';
        popupHeader.style.justifyContent = 'space-between';

        const popupTitle = document.createElement('span');
        popupTitle.innerText = 'Advanced YouTube Search';

        const keyboardShortcutsBtn = document.createElement('button');
        keyboardShortcutsBtn.type = 'button';
        keyboardShortcutsBtn.innerHTML = '⌨️';
        keyboardShortcutsBtn.style.background = 'none';
        keyboardShortcutsBtn.style.border = 'none';
        keyboardShortcutsBtn.style.cursor = 'pointer';
        keyboardShortcutsBtn.style.fontSize = '14px';
        keyboardShortcutsBtn.style.color = 'white';
        keyboardShortcutsBtn.style.padding = '2px 8px';
        keyboardShortcutsBtn.style.transition = 'all 0.2s ease';
        keyboardShortcutsBtn.title = 'Keyboard Shortcuts Settings';

        keyboardShortcutsBtn.addEventListener('mouseenter', function() {
            keyboardShortcutsBtn.style.opacity = '0.8';
            keyboardShortcutsBtn.style.transform = 'scale(1.1)';
        });

        keyboardShortcutsBtn.addEventListener('mouseleave', function() {
            keyboardShortcutsBtn.style.opacity = '1';
            keyboardShortcutsBtn.style.transform = 'scale(1)';
        });

        popupHeader.appendChild(popupTitle);
        popupHeader.appendChild(keyboardShortcutsBtn);

        popupDiv.appendChild(popupHeader);

        // === Quick Filter Presets Section ===
        const presetsContainer = document.createElement('div');
        presetsContainer.id = 'aysPresetsContainer';
        presetsContainer.style.backgroundColor = '#f8f9fa';
        presetsContainer.style.borderBottom = '1px solid var(--ays-color-gray-300)';
        presetsContainer.style.transition = 'all var(--ays-transition-base)';

        // Presets Header with Toggle Button
        const presetsHeader = document.createElement('div');
        presetsHeader.style.display = 'flex';
        presetsHeader.style.alignItems = 'center';
        presetsHeader.style.justifyContent = 'space-between';
        presetsHeader.style.padding = 'var(--ays-spacing-sm) var(--ays-spacing-md)';

        const presetsTitle = document.createElement('span');
        presetsTitle.innerText = 'Quick Filters';
        presetsTitle.style.fontSize = 'var(--ays-font-size-sm)';
        presetsTitle.style.fontWeight = 'var(--ays-font-weight-bold)';
        presetsTitle.style.color = 'var(--ays-color-gray-700)';
        presetsTitle.style.fontFamily = 'var(--ays-font-family)';

        const presetsControls = document.createElement('div');
        presetsControls.style.display = 'flex';
        presetsControls.style.alignItems = 'center';
        presetsControls.style.gap = '8px';

        const togglePresetsBtn = document.createElement('button');
        togglePresetsBtn.type = 'button';
        togglePresetsBtn.id = 'aysTogglePresetsBtn';
        togglePresetsBtn.innerHTML = '▲';
        togglePresetsBtn.style.background = 'none';
        togglePresetsBtn.style.border = 'none';
        togglePresetsBtn.style.cursor = 'pointer';
        togglePresetsBtn.style.fontSize = 'var(--ays-font-size-sm)';
        togglePresetsBtn.style.color = 'var(--ays-color-gray-600)';
        togglePresetsBtn.style.padding = '2px 6px';
        togglePresetsBtn.style.transition = 'transform var(--ays-transition-fast)';
        togglePresetsBtn.title = 'Toggle Quick Filters';

        const managePresetsBtn = document.createElement('button');
        managePresetsBtn.type = 'button';
        managePresetsBtn.id = 'aysManagePresetsBtn';
        managePresetsBtn.innerHTML = '⚙️';
        managePresetsBtn.style.background = 'none';
        managePresetsBtn.style.border = 'none';
        managePresetsBtn.style.cursor = 'pointer';
        managePresetsBtn.style.fontSize = 'var(--ays-font-size-sm)';
        managePresetsBtn.style.color = 'var(--ays-color-gray-600)';
        managePresetsBtn.style.padding = '2px 6px';
        managePresetsBtn.style.transition = 'all var(--ays-transition-fast)';
        managePresetsBtn.title = 'Manage Presets';

        presetsControls.appendChild(togglePresetsBtn);
        presetsControls.appendChild(managePresetsBtn);

        presetsHeader.appendChild(presetsTitle);
        presetsHeader.appendChild(presetsControls);
        presetsContainer.appendChild(presetsHeader);

        // Presets Bar Container (Scrollable)
        const presetsBar = document.createElement('div');
        presetsBar.id = 'aysPresetsBar';
        presetsBar.style.display = 'flex';
        presetsBar.style.gap = '8px';
        presetsBar.style.padding = '10px var(--ays-spacing-md)';
        presetsBar.style.overflowX = 'auto';
        presetsBar.style.scrollbarWidth = 'thin';
        presetsBar.style.scrollbarColor = 'var(--ays-color-gray-400) var(--ays-color-gray-200)';
        presetsBar.style.transition = 'all var(--ays-transition-base)';

        // Custom scrollbar styles for webkit browsers
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.textContent = `
            #aysPresetsBar::-webkit-scrollbar {
                height: 6px;
            }
            #aysPresetsBar::-webkit-scrollbar-track {
                background: var(--ays-color-gray-200);
                border-radius: 3px;
            }
            #aysPresetsBar::-webkit-scrollbar-thumb {
                background: var(--ays-color-gray-400);
                border-radius: 3px;
            }
            #aysPresetsBar::-webkit-scrollbar-thumb:hover {
                background: var(--ays-color-gray-500);
            }
        `;
        document.head.appendChild(scrollbarStyle);

        // Create preset buttons
        QUICK_FILTER_PRESETS.forEach(preset => {
            const presetBtn = document.createElement('button');
            presetBtn.type = 'button';
            presetBtn.className = 'ays-preset-btn';
            presetBtn.dataset.presetId = preset.id;
            presetBtn.style.display = 'flex';
            presetBtn.style.alignItems = 'center';
            presetBtn.style.gap = '6px';
            presetBtn.style.padding = '8px 14px';
            presetBtn.style.border = '1px solid var(--ays-color-gray-300)';
            presetBtn.style.borderRadius = '20px';
            presetBtn.style.backgroundColor = 'var(--ays-color-white)';
            presetBtn.style.cursor = 'pointer';
            presetBtn.style.fontSize = 'var(--ays-font-size-sm)';
            presetBtn.style.fontFamily = 'var(--ays-font-family)';
            presetBtn.style.fontWeight = '500';
            presetBtn.style.color = 'var(--ays-color-gray-700)';
            presetBtn.style.transition = 'all var(--ays-transition-fast)';
            presetBtn.style.whiteSpace = 'nowrap';
            presetBtn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            presetBtn.title = `${preset.name}: ${preset.description}`;

            // Icon
            const icon = document.createElement('span');
            icon.innerText = preset.icon;
            icon.style.fontSize = 'var(--ays-font-size-base)';

            // Label
            const label = document.createElement('span');
            label.innerText = preset.name;

            presetBtn.appendChild(icon);
            presetBtn.appendChild(label);

            // Hover effects
            presetBtn.addEventListener('mouseenter', function() {
                if (!presetBtn.classList.contains('ays-preset-active')) {
                    presetBtn.style.backgroundColor = 'var(--ays-color-gray-50)';
                    presetBtn.style.borderColor = 'var(--ays-color-gray-400)';
                    presetBtn.style.transform = 'translateY(-1px)';
                    presetBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                }
            });

            presetBtn.addEventListener('mouseleave', function() {
                if (!presetBtn.classList.contains('ays-preset-active')) {
                    presetBtn.style.backgroundColor = 'var(--ays-color-white)';
                    presetBtn.style.borderColor = 'var(--ays-color-gray-300)';
                    presetBtn.style.transform = 'translateY(0)';
                    presetBtn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }
            });

            presetsBar.appendChild(presetBtn);
        });

        presetsContainer.appendChild(presetsBar);
        popupDiv.appendChild(presetsContainer);

        // Toggle functionality
        let presetsExpanded = true;
        togglePresetsBtn.addEventListener('click', function() {
            presetsExpanded = !presetsExpanded;
            if (presetsExpanded) {
                presetsBar.style.display = 'flex';
                presetsBar.style.opacity = '1';
                presetsBar.style.padding = '10px var(--ays-spacing-md)';
                togglePresetsBtn.innerHTML = '▲';
                togglePresetsBtn.style.transform = 'rotate(0deg)';
            } else {
                presetsBar.style.display = 'none';
                presetsBar.style.opacity = '0';
                presetsBar.style.padding = '0';
                togglePresetsBtn.innerHTML = '▼';
                togglePresetsBtn.style.transform = 'rotate(0deg)';
            }
        });

        // Add CSS styles for active state
        const activePresetStyle = document.createElement('style');
        activePresetStyle.textContent = `
            .ays-preset-active {
                background-color: var(--ays-color-primary) !important;
                color: var(--ays-color-white) !important;
                border-color: var(--ays-color-primary-dark) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
            }
            .ays-preset-active:hover {
                background-color: var(--ays-color-primary-dark) !important;
                border-color: var(--ays-color-primary-dark) !important;
            }
        `;
        document.head.appendChild(activePresetStyle);

        // Create the form container
        const formContainer = document.createElement('div');
        formContainer.style.padding = 'var(--ays-spacing-xl)';
        popupDiv.appendChild(formContainer);

        // Create form element
        const form = document.createElement('form');

        // Helper function to create form fields
        function createField(labelText, inputType, inputName, placeholder='', options=[]) {
            const wrapper = document.createElement('div');
            wrapper.className = 'ays-field-wrapper';
            wrapper.style.marginBottom = 'var(--ays-spacing-md)';
            wrapper.style.transition = 'all var(--ays-transition-base)';

            const label = document.createElement('label');
            label.innerText = labelText;
            label.htmlFor = inputName;
            label.style.display = 'block';
            label.style.marginBottom = '6px';
            label.style.fontWeight = 'var(--ays-font-weight-bold)';
            label.style.fontSize = 'var(--ays-font-size-sm)';
            label.style.color = 'var(--ays-color-gray-700)';
            label.style.fontFamily = 'var(--ays-font-family)';
            label.style.transition = 'color var(--ays-transition-fast)';

            let input;
            if (inputType === 'select') {
                input = document.createElement('select');
                input.name = inputName;
                input.id = inputName;
                input.className = 'ays-input';
                input.style.cursor = 'pointer';

                // Add options based on select options provided
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.value;
                    opt.text = option.text;
                    input.appendChild(opt);
                });
            } else if (inputType === 'date') {
                input = document.createElement('input');
                input.type = 'date';
                input.name = inputName;
                input.id = inputName;
                input.className = 'ays-input';
            } else {
                input = document.createElement('input');
                input.type = inputType;
                input.name = inputName;
                input.id = inputName;
                input.className = 'ays-input';
                input.placeholder = placeholder;
            }

            input.style.width = '100%';
            input.style.padding = 'var(--ays-spacing-sm)';
            input.style.boxSizing = 'border-box';
            input.style.border = '1px solid var(--ays-color-gray-300)';
            input.style.borderRadius = 'var(--ays-radius-sm)';
            input.style.transition = 'all var(--ays-transition-base)';
            input.style.outline = 'none';
            input.style.fontSize = 'var(--ays-font-size-sm)';
            input.style.fontFamily = 'var(--ays-font-family)';
            input.style.backgroundColor = 'var(--ays-color-white)';

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            
            // Add focus effects to the input
            addInputFocusEffects(input);
            
            return wrapper;
        }

        /**
         * Set field error state with visual feedback
         * @param {string} fieldId - The ID of the field to set as error
         */
        function setFieldError(fieldId) {
            const input = document.getElementById(fieldId);
            if (!input) return;
            
            input.classList.add('ays-field-error');
            input.classList.remove('ays-field-success', 'ays-field-loading');
        }

        /**
         * Set field success state with visual feedback
         * @param {string} fieldId - The ID of the field to set as success
         */
        function setFieldSuccess(fieldId) {
            const input = document.getElementById(fieldId);
            if (!input) return;
            
            input.classList.add('ays-field-success');
            input.classList.remove('ays-field-error', 'ays-field-loading');
        }

        /**
         * Set field disabled state
         * @param {string} fieldId - The ID of the field to disable
         * @param {boolean} disabled - Whether to disable or enable
         */
        function setFieldDisabled(fieldId, disabled = true) {
            const input = document.getElementById(fieldId);
            if (!input) return;
            
            if (disabled) {
                input.disabled = true;
                input.classList.add('ays-field-disabled');
            } else {
                input.disabled = false;
                input.classList.remove('ays-field-disabled');
            }
        }

        /**
         * Set field loading state with pulse animation
         * @param {string} fieldId - The ID of the field to set as loading
         * @param {boolean} loading - Whether to set loading or remove it
         */
        function setFieldLoading(fieldId, loading = true) {
            const input = document.getElementById(fieldId);
            if (!input) return;
            
            if (loading) {
                input.classList.add('ays-field-loading');
                input.classList.remove('ays-field-error', 'ays-field-success');
            } else {
                input.classList.remove('ays-field-loading');
            }
        }

        /**
         * Clear all visual states from a field
         * @param {string} fieldId - The ID of the field to clear states from
         */
        function clearFieldState(fieldId) {
            const input = document.getElementById(fieldId);
            if (!input) return;
            
            input.classList.remove('ays-field-error', 'ays-field-success', 'ays-field-loading', 'ays-field-disabled');
        }

        /**
         * Add focus effects to input elements
         * @param {HTMLInputElement|HTMLSelectElement} input - The input element to add focus effects to
         */
        function addInputFocusEffects(input) {
            input.addEventListener('focus', function() {
                if (!input.classList.contains('ays-field-error') && 
                    !input.classList.contains('ays-field-success') &&
                    !input.classList.contains('ays-field-loading')) {
                    input.style.borderColor = 'var(--ays-color-primary)';
                    input.style.boxShadow = 'var(--ays-shadow-focus)';
                }
            });

            input.addEventListener('blur', function() {
                if (!input.classList.contains('ays-field-error') && 
                    !input.classList.contains('ays-field-success')) {
                    input.style.borderColor = 'var(--ays-color-gray-300)';
                    input.style.boxShadow = 'none';
                }
            });
        }

        // === Regular Search Section ===
        const regularSearchSection = document.createElement('div');
        regularSearchSection.style.marginBottom = 'var(--ays-spacing-2xl)';

        const regularSearchTitle = document.createElement('h3');
        regularSearchTitle.innerText = 'Regular Search';
        regularSearchTitle.style.marginTop = '0';
        regularSearchTitle.style.marginBottom = 'var(--ays-spacing-md)';
        regularSearchTitle.style.fontSize = 'var(--ays-font-size-xl)';
        regularSearchTitle.style.color = 'var(--ays-color-gray-800)';
        regularSearchTitle.style.fontWeight = 'var(--ays-font-weight-bold)';
        regularSearchTitle.style.fontFamily = 'var(--ays-font-family)';

        regularSearchSection.appendChild(regularSearchTitle);

        const regularSearchInput = createField('Search:', 'text', 'regularSearch', 'e.g., funny cats');

        regularSearchSection.appendChild(regularSearchInput);

        form.appendChild(regularSearchSection);

        // === Advanced Search Section ===
        const advancedSearchSection = document.createElement('div');

        const advancedSearchTitle = document.createElement('h3');
        advancedSearchTitle.innerText = 'Advanced Options';
        advancedSearchTitle.style.marginTop = '0';
        advancedSearchTitle.style.marginBottom = 'var(--ays-spacing-md)';
        advancedSearchTitle.style.fontSize = 'var(--ays-font-size-xl)';
        advancedSearchTitle.style.color = 'var(--ays-color-gray-800)';
        advancedSearchTitle.style.fontWeight = 'var(--ays-font-weight-bold)';
        advancedSearchTitle.style.fontFamily = 'var(--ays-font-family)';

        advancedSearchSection.appendChild(advancedSearchTitle);

        // Exact Term
        advancedSearchSection.appendChild(createField('Exact Term:', 'text', 'exactTerm', 'e.g., "Awesome List"'));

        // Exclude Term
        advancedSearchSection.appendChild(createField('Exclude Term(s):', 'text', 'excludeTerms', 'e.g., spam, ads'));

        // Title Includes
        advancedSearchSection.appendChild(createField('Title Includes:', 'text', 'titleIncludes', 'e.g., tutorial'));

        // Video Length
        advancedSearchSection.appendChild(createField('Video Length:', 'select', 'videoLength', '', [
            {value: 'any', text: 'Any Length'},
            {value: 'short', text: 'Under 4 minutes'},
            {value: 'medium', text: '4-20 minutes'},
            {value: 'long', text: 'Over 20 minutes'}
        ]));

        // Date After
        advancedSearchSection.appendChild(createField('Date After:', 'date', 'dateAfter'));

        // Date Before
        advancedSearchSection.appendChild(createField('Date Before:', 'date', 'dateBefore'));

        form.appendChild(advancedSearchSection);

        // === Saved Searches Section ===
        const savedSearchesSection = document.createElement('div');
        savedSearchesSection.style.marginTop = 'var(--ays-spacing-lg)';
        savedSearchesSection.style.marginBottom = 'var(--ays-spacing-lg)';
        savedSearchesSection.style.paddingTop = 'var(--ays-spacing-lg)';
        savedSearchesSection.style.borderTop = '1px solid var(--ays-color-gray-300)';

        const savedSearchesTitle = document.createElement('h3');
        savedSearchesTitle.innerText = 'Saved Searches';
        savedSearchesTitle.style.marginTop = '0';
        savedSearchesTitle.style.marginBottom = 'var(--ays-spacing-md)';
        savedSearchesTitle.style.fontSize = 'var(--ays-font-size-xl)';
        savedSearchesTitle.style.color = 'var(--ays-color-gray-800)';
        savedSearchesTitle.style.fontWeight = 'var(--ays-font-weight-bold)';
        savedSearchesTitle.style.fontFamily = 'var(--ays-font-family)';

        savedSearchesSection.appendChild(savedSearchesTitle);

        // Add keyboard shortcuts help text
        const shortcutsHelp = document.createElement('div');
        shortcutsHelp.style.fontSize = '12px';
        shortcutsHelp.style.color = '#666';
        shortcutsHelp.style.marginBottom = '10px';
        shortcutsHelp.style.fontStyle = 'italic';
        shortcutsHelp.innerText = '💡 Tip: Press Alt+1-9 to quickly execute your saved searches';
        savedSearchesSection.appendChild(shortcutsHelp);

        // Container for dropdown and load button
        const savedSearchesControls = document.createElement('div');
        savedSearchesControls.style.display = 'flex';
        savedSearchesControls.style.gap = 'var(--ays-spacing-md)';

        // Saved searches dropdown
        const savedSearchesDiv = document.createElement('div');
        savedSearchesDiv.style.flex = '1';

        const savedSearchesLabel = document.createElement('label');
        savedSearchesLabel.innerText = 'Select a saved search:';
        savedSearchesLabel.htmlFor = 'savedSearchesSelect';
        savedSearchesLabel.style.display = 'block';
        savedSearchesLabel.style.marginBottom = '6px';
        savedSearchesLabel.style.fontWeight = 'var(--ays-font-weight-bold)';
        savedSearchesLabel.style.fontSize = 'var(--ays-font-size-sm)';
        savedSearchesLabel.style.color = 'var(--ays-color-gray-700)';
        savedSearchesLabel.style.fontFamily = 'var(--ays-font-family)';

        const savedSearchesSelect = document.createElement('select');
        savedSearchesSelect.id = 'savedSearchesSelect';
        savedSearchesSelect.name = 'savedSearchesSelect';
        savedSearchesSelect.style.width = '100%';
        savedSearchesSelect.style.padding = 'var(--ays-spacing-sm)';
        savedSearchesSelect.style.boxSizing = 'border-box';
        savedSearchesSelect.style.border = '1px solid var(--ays-color-gray-300)';
        savedSearchesSelect.style.borderRadius = 'var(--ays-radius-sm)';
        savedSearchesSelect.style.backgroundColor = 'var(--ays-color-white)';
        savedSearchesSelect.style.cursor = 'pointer';
        savedSearchesSelect.style.fontSize = 'var(--ays-font-size-sm)';
        savedSearchesSelect.style.fontFamily = 'var(--ays-font-family)';
        savedSearchesSelect.style.transition = 'all var(--ays-transition-base)';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select a saved search --';
        savedSearchesSelect.appendChild(defaultOption);

        savedSearchesDiv.appendChild(savedSearchesLabel);
        savedSearchesDiv.appendChild(savedSearchesSelect);

        // Load button
        const loadSearchBtn = document.createElement('button');
        loadSearchBtn.type = 'button';
        loadSearchBtn.innerText = 'Load';
        loadSearchBtn.style.padding = 'var(--ays-spacing-md) var(--ays-spacing-xl)';
        loadSearchBtn.style.backgroundColor = 'var(--ays-color-success)';
        loadSearchBtn.style.color = 'var(--ays-color-white)';
        loadSearchBtn.style.border = 'none';
        loadSearchBtn.style.borderRadius = 'var(--ays-radius-sm)';
        loadSearchBtn.style.cursor = 'pointer';
        loadSearchBtn.style.fontSize = 'var(--ays-font-size-sm)';
        loadSearchBtn.style.fontWeight = 'var(--ays-font-weight-bold)';
        loadSearchBtn.style.alignSelf = 'flex-end';
        loadSearchBtn.style.marginBottom = '2px';
        loadSearchBtn.style.fontFamily = 'var(--ays-font-family)';
        loadSearchBtn.style.transition = 'all var(--ays-transition-base)';

        // Modern hover effect with scale transform
        loadSearchBtn.addEventListener('mouseenter', function() {
            loadSearchBtn.style.backgroundColor = 'var(--ays-color-success-dark)';
            loadSearchBtn.style.transform = 'scale(1.05)';
            loadSearchBtn.style.boxShadow = 'var(--ays-shadow-md)';
        });

        loadSearchBtn.addEventListener('mouseleave', function() {
            loadSearchBtn.style.backgroundColor = 'var(--ays-color-success)';
            loadSearchBtn.style.transform = 'scale(1)';
            loadSearchBtn.style.boxShadow = 'var(--ays-shadow-sm)';
        });

        loadSearchBtn.addEventListener('mousedown', function() {
            loadSearchBtn.style.transform = 'scale(0.98)';
            loadSearchBtn.style.boxShadow = 'var(--ays-shadow-xs)';
        });

        loadSearchBtn.addEventListener('mouseup', function() {
            loadSearchBtn.style.transform = 'scale(1.05)';
            loadSearchBtn.style.boxShadow = 'var(--ays-shadow-md)';
        });

        savedSearchesControls.appendChild(savedSearchesDiv);
        savedSearchesControls.appendChild(loadSearchBtn);
        savedSearchesSection.appendChild(savedSearchesControls);

        form.appendChild(savedSearchesSection);

        /**
         * Refresh the saved searches dropdown with current data
         */
        function refreshSavedSearchesDropdown() {
            const select = document.getElementById('savedSearchesSelect');
            if (!select) return;

            // Save current selection
            const currentValue = select.value;

            // Clear existing options (except the first default option)
            while (select.options.length > 1) {
                select.remove(1);
            }

            // Get all saved searches
            const result = getAllSearches();

            if (!result.success) {
                // Show error as option
                const errorOption = document.createElement('option');
                errorOption.text = 'Error loading searches';
                errorOption.disabled = true;
                select.appendChild(errorOption);
                console.error('Failed to load saved searches:', result.error);
                return;
            }

            const searches = result.data;

            // Populate dropdown with saved searches
            searches.forEach((search, index) => {
                const option = document.createElement('option');
                option.value = search.id;

                // Display name with folder if exists, plus keyboard shortcut hint
                const shortcutHint = index < 9 ? `[Alt+${index + 1}] ` : '';
                const displayText = search.folder
                    ? `${shortcutHint}${search.name} (${search.folder})`
                    : `${shortcutHint}${search.name}`;
                option.text = displayText;

                select.appendChild(option);
            });

            // Restore previous selection if it still exists
            if (currentValue) {
                const optionExists = Array.from(select.options).some(opt => opt.value === currentValue);
                if (optionExists) {
                    select.value = currentValue;
                }
            }
        }

        /**
         * Load a saved search into the form fields
         * @param {string} searchId - The ID of the saved search to load
         */
        function loadSavedSearch(searchId) {
            const result = getSearchById(searchId);

            if (!result.success) {
                showToast(result.error || 'Failed to load saved search', 'error');
                return;
            }

            const search = result.data;
            const config = search.config || {};

            // Populate all form fields with saved config with defaults for missing fields
            document.getElementById('regularSearch').value = config.regularSearch || '';
            document.getElementById('exactTerm').value = config.exactTerm || '';
            document.getElementById('excludeTerms').value = config.excludeTerms || '';
            document.getElementById('titleIncludes').value = config.titleIncludes || '';
            document.getElementById('videoLength').value = config.videoLength || 'any';
            document.getElementById('dateAfter').value = config.dateAfter || '';
            document.getElementById('dateBefore').value = config.dateBefore || '';
        }

        // === Quick Filter Presets Logic ===
        let activePresetId = null;

        /**
         * Apply a quick filter preset to the search form
         * @param {string} presetId - The ID of the preset to apply
         */
        function applyPreset(presetId) {
            const preset = QUICK_FILTER_PRESETS.find(p => p.id === presetId);
            if (!preset) {
                console.error('Preset not found:', presetId);
                return;
            }

            // Get current manual values (user input in the form)
            const manualValues = {
                regularSearch: document.getElementById('regularSearch').value.trim(),
                exactTerm: document.getElementById('exactTerm').value.trim(),
                excludeTerms: document.getElementById('excludeTerms').value.trim(),
                titleIncludes: document.getElementById('titleIncludes').value.trim(),
                videoLength: document.getElementById('videoLength').value,
                dateAfter: document.getElementById('dateAfter').value,
                dateBefore: document.getElementById('dateBefore').value
            };

            // Track which fields were manually filled (non-empty or not default)
            const hasManualInput = {
                regularSearch: manualValues.regularSearch !== '',
                exactTerm: manualValues.exactTerm !== '',
                excludeTerms: manualValues.excludeTerms !== '',
                titleIncludes: manualValues.titleIncludes !== '',
                videoLength: manualValues.videoLength !== 'any',
                dateAfter: manualValues.dateAfter !== '',
                dateBefore: manualValues.dateBefore !== ''
            };

            // Apply preset parameters, respecting manual input
            const params = preset.parameters;

            // Video Length - apply only if not manually set
            if (params.videoLength && !hasManualInput.videoLength) {
                document.getElementById('videoLength').value = params.videoLength;
            }

            // Date Range - apply only if not manually set
            if (params.dateRange) {
                const dateRange = getDateRangeForPreset(params.dateRange);
                if (dateRange.dateAfter && !hasManualInput.dateAfter) {
                    document.getElementById('dateAfter').value = dateRange.dateAfter;
                }
                if (dateRange.dateBefore && !hasManualInput.dateBefore) {
                    document.getElementById('dateBefore').value = dateRange.dateBefore;
                }
            }

            // SP Parameter for sorting - this would be used in URL generation
            if (params.spParam) {
                document.getElementById('spParam').value = params.spParam;
            }

            // Update active preset state
            activePresetId = presetId;

            // Save active preset to localStorage for persistence
            localStorage.setItem(ACTIVE_PRESET_KEY, presetId);

            // Update visual state of preset buttons
            updatePresetButtonStates();

            // Show toast notification
            showToast(`Applied preset: ${preset.name}`, 'success');

            // Update search preview to reflect active preset
            updateSearchPreview();
        }

        /**
         * Deactivate the current preset and reset to defaults
         */
        function deactivatePreset() {
            if (!activePresetId) {
                showToast('No active preset', 'info');
                return;
            }

            // Reset video length to default
            document.getElementById('videoLength').value = 'any';

            // Clear date fields
            document.getElementById('dateAfter').value = '';
            document.getElementById('dateBefore').value = '';

            // Clear sp parameter
            const spParam = document.getElementById('spParam');
            if (spParam) {
                spParam.value = '';
            }

            // Clear active preset
            activePresetId = null;

            // Remove active preset from localStorage
            localStorage.removeItem(ACTIVE_PRESET_KEY);

            // Update visual state
            updatePresetButtonStates();

            // Show toast notification
            showToast('Preset deactivated', 'info');

            // Update search preview
            updateSearchPreview();
        }

        /**
         * Update the visual state of all preset buttons
         */
        function updatePresetButtonStates() {
            const presetButtons = document.querySelectorAll('.ays-preset-btn');
            presetButtons.forEach(btn => {
                const btnPresetId = btn.dataset.presetId;
                if (btnPresetId === activePresetId) {
                    btn.classList.add('ays-preset-active');
                } else {
                    btn.classList.remove('ays-preset-active');
                }
            });
        }

        /**
         * Update the search preview text to reflect active preset
         */
        function updateSearchPreview() {
            const preview = document.getElementById('searchPreview');
            if (!preview) return;

            // Get current form values
            const regularSearch = document.getElementById('regularSearch').value.trim();
            const videoLength = document.getElementById('videoLength').value;
            const dateAfter = document.getElementById('dateAfter').value;
            const dateBefore = document.getElementById('dateBefore').value;

            // Build preview text
            let previewText = '';

            if (activePresetId) {
                const activePreset = QUICK_FILTER_PRESETS.find(p => p.id === activePresetId);
                if (activePreset) {
                    previewText += `📋 Active preset: ${activePreset.name} (${activePreset.description})`;
                }
            }

            if (regularSearch) {
                previewText += previewText ? '\n' : '';
                previewText += `🔍 Searching for: ${regularSearch}`;
            }

            if (videoLength !== 'any') {
                const lengthText = {
                    'short': 'Short (<4 min)',
                    'medium': 'Medium (4-20 min)',
                    'long': 'Long (>20 min)'
                }[videoLength] || videoLength;
                previewText += previewText ? '\n' : '';
                previewText += `⏱️ Length: ${lengthText}`;
            }

            if (dateAfter) {
                previewText += previewText ? '\n' : '';
                previewText += `📅 After: ${dateAfter}`;
            }

            if (dateBefore) {
                previewText += previewText ? '\n' : '';
                previewText += `📅 Before: ${dateBefore}`;
            }

            preview.innerText = previewText || 'Start typing to preview your search';
        }

        // Add preset button click handlers
        document.addEventListener('DOMContentLoaded', function() {
            // Restore last active preset from localStorage
            const savedActivePresetId = localStorage.getItem(ACTIVE_PRESET_KEY);
            if (savedActivePresetId) {
                const savedPreset = getAllPresets().find(p => p.id === savedActivePresetId);
                if (savedPreset) {
                    activePresetId = savedActivePresetId;
                    setTimeout(() => {
                        updatePresetButtonStates();
                        updateSearchPreview();
                    }, 100);
                }
            }

            const presetButtons = document.querySelectorAll('.ays-preset-btn');
            presetButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const presetId = this.dataset.presetId;

                    // If clicking the active preset, deactivate it
                    if (activePresetId === presetId) {
                        deactivatePreset();
                    } else {
                        applyPreset(presetId);
                    }
                });
            });

            // Add input listeners to update preview when user manually changes values
            const formInputs = ['regularSearch', 'exactTerm', 'excludeTerms', 'titleIncludes', 'videoLength', 'dateAfter', 'dateBefore'];
            formInputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.addEventListener('input', function() {
                        updateSearchPreview();
                    });
                }
            });
        });

        /**
         * Execute a saved search by loading it and submitting the form
         * @param {string} searchId - The ID of the saved search to execute
         */
        function executeSavedSearch(searchId) {
            const result = getSearchById(searchId);

            if (!result.success) {
                console.error('Failed to execute saved search:', result.error);
                return;
            }

            const search = result.data;
            const config = search.config || {};

            // Build query string from saved config
            let query = '';

            if (config.regularSearch) {
                query += `${config.regularSearch}`;
            }

            if (config.exactTerm) {
                if (query.length > 0) query += ' ';
                query += `"${config.exactTerm}"`;
            }

            if (config.excludeTerms) {
                const excludes = config.excludeTerms.split(',').map(term => term.trim()).filter(term => term);
                excludes.forEach(term => {
                    query += ` -${term}`;
                });
            }

            if (config.titleIncludes) {
                const titles = config.titleIncludes.split(',').map(term => term.trim()).filter(term => term);
                titles.forEach(term => {
                    query += ` intitle:${term}`;
                });
            }

            if (config.dateAfter) {
                query += ` after:${config.dateAfter}`;
            }
            if (config.dateBefore) {
                query += ` before:${config.dateBefore}`;
            }

            const encodedQuery = encodeURIComponent(query.trim());

            let searchURL = `https://www.youtube.com/results?search_query=${encodedQuery}`;

            if (config.videoLength && config.videoLength !== 'any') {
                searchURL += `&sp=${videoLengthOptions[config.videoLength]}`;
            }

            window.location.href = searchURL;
        }

        // Load button click handler
        loadSearchBtn.addEventListener('click', function() {
            const selectedSearchId = savedSearchesSelect.value;
            if (!selectedSearchId) {
                showToast('Please select a saved search to load', 'info');
                return;
            }

            loadSavedSearch(selectedSearchId);
            showToast('Search loaded successfully!', 'success');
        });

        // Manage Searches Button
        const manageSearchesBtn = document.createElement('button');
        manageSearchesBtn.type = 'button';
        manageSearchesBtn.innerText = '⚙️ Manage Searches';
        manageSearchesBtn.style.padding = 'var(--ays-spacing-md) var(--ays-spacing-xl)';
        manageSearchesBtn.style.backgroundColor = 'var(--ays-color-secondary)';
        manageSearchesBtn.style.color = 'var(--ays-color-white)';
        manageSearchesBtn.style.border = 'none';
        manageSearchesBtn.style.borderRadius = 'var(--ays-radius-sm)';
        manageSearchesBtn.style.cursor = 'pointer';
        manageSearchesBtn.style.fontSize = 'var(--ays-font-size-sm)';
        manageSearchesBtn.style.fontWeight = 'var(--ays-font-weight-bold)';
        manageSearchesBtn.style.width = '100%';
        manageSearchesBtn.style.marginTop = 'var(--ays-spacing-md)';
        manageSearchesBtn.style.fontFamily = 'var(--ays-font-family)';
        manageSearchesBtn.style.transition = 'all var(--ays-transition-base)';

        // Modern hover effect with scale transform
        manageSearchesBtn.addEventListener('mouseenter', function() {
            manageSearchesBtn.style.backgroundColor = 'var(--ays-color-secondary-dark)';
            manageSearchesBtn.style.transform = 'scale(1.02)';
            manageSearchesBtn.style.boxShadow = 'var(--ays-shadow-md)';
        });

        manageSearchesBtn.addEventListener('mouseleave', function() {
            manageSearchesBtn.style.backgroundColor = 'var(--ays-color-secondary)';
            manageSearchesBtn.style.transform = 'scale(1)';
            manageSearchesBtn.style.boxShadow = 'var(--ays-shadow-sm)';
        });

        manageSearchesBtn.addEventListener('mousedown', function() {
            manageSearchesBtn.style.transform = 'scale(0.98)';
            manageSearchesBtn.style.boxShadow = 'var(--ays-shadow-xs)';
        });

        manageSearchesBtn.addEventListener('mouseup', function() {
            manageSearchesBtn.style.transform = 'scale(1.02)';
            manageSearchesBtn.style.boxShadow = 'var(--ays-shadow-md)';
        });

        form.appendChild(manageSearchesBtn);

        // Manage Searches Modal
        const manageSearchesModal = document.createElement('div');
        manageSearchesModal.id = 'manageSearchesModal';
        manageSearchesModal.style.position = 'fixed';
        manageSearchesModal.style.top = '0';
        manageSearchesModal.style.left = '0';
        manageSearchesModal.style.width = '100%';
        manageSearchesModal.style.height = '100%';
        manageSearchesModal.style.backgroundColor = 'var(--ays-glass-backdrop)';
        manageSearchesModal.style.backdropFilter = 'blur(8px)';
        manageSearchesModal.style.webkitBackdropFilter = 'blur(8px)';
        manageSearchesModal.style.zIndex = 'var(--ays-z-modal)';
        manageSearchesModal.style.display = 'none';
        manageSearchesModal.style.overflow = 'auto';
        manageSearchesModal.style.transition = 'opacity var(--ays-transition-slow)';

        const manageModalContent = document.createElement('div');
        manageModalContent.style.position = 'absolute';
        manageModalContent.style.top = '50%';
        manageModalContent.style.left = '50%';
        manageModalContent.style.transform = 'translate(-50%, -50%)';
        manageModalContent.style.backgroundColor = 'var(--ays-color-white)';
        manageModalContent.style.borderRadius = 'var(--ays-radius-lg)';
        manageModalContent.style.boxShadow = 'var(--ays-shadow-lg)';
        manageModalContent.style.padding = 'var(--ays-spacing-2xl)';
        manageModalContent.style.width = '600px';
        manageModalContent.style.maxWidth = '90%';
        manageModalContent.style.maxHeight = '80vh';
        manageModalContent.style.overflow = 'auto';
        manageModalContent.style.fontFamily = 'var(--ays-font-family)';

        const manageModalTitle = document.createElement('h3');
        manageModalTitle.innerText = 'Manage Saved Searches';
        manageModalTitle.style.marginTop = '0';
        manageModalTitle.style.marginBottom = 'var(--ays-spacing-lg)';
        manageModalTitle.style.fontSize = 'var(--ays-font-size-xl)';
        manageModalTitle.style.color = 'var(--ays-color-gray-800)';
        manageModalTitle.style.fontWeight = 'var(--ays-font-weight-bold)';
        manageModalTitle.style.fontFamily = 'var(--ays-font-family)';

        // Folder filter container
        const folderFilterContainer = document.createElement('div');
        folderFilterContainer.style.marginBottom = '15px';

        const folderFilterLabel = document.createElement('label');
        folderFilterLabel.innerText = 'Filter by folder:';
        folderFilterLabel.htmlFor = 'folderFilterSelect';
        folderFilterLabel.style.display = 'block';
        folderFilterLabel.style.marginBottom = '6px';
        folderFilterLabel.style.fontWeight = 'bold';
        folderFilterLabel.style.fontSize = '14px';
        folderFilterLabel.style.color = '#333';

        const folderFilterSelect = document.createElement('select');
        folderFilterSelect.id = 'folderFilterSelect';
        folderFilterSelect.name = 'folderFilterSelect';
        folderFilterSelect.style.width = '100%';
        folderFilterSelect.style.padding = '8px';
        folderFilterSelect.style.boxSizing = 'border-box';
        folderFilterSelect.style.border = '1px solid #ccc';
        folderFilterSelect.style.borderRadius = '4px';
        folderFilterSelect.style.backgroundColor = '#fff';
        folderFilterSelect.style.fontSize = '14px';

        folderFilterContainer.appendChild(folderFilterLabel);
        folderFilterContainer.appendChild(folderFilterSelect);

        const searchesListContainer = document.createElement('div');
        searchesListContainer.id = 'searchesListContainer';
        searchesListContainer.style.marginTop = '15px';

        const closeManageBtn = document.createElement('button');
        closeManageBtn.type = 'button';
        closeManageBtn.innerText = 'Close';
        closeManageBtn.style.padding = '10px 20px';
        closeManageBtn.style.backgroundColor = '#666';
        closeManageBtn.style.color = '#fff';
        closeManageBtn.style.border = 'none';
        closeManageBtn.style.borderRadius = '4px';
        closeManageBtn.style.cursor = 'pointer';
        closeManageBtn.style.fontSize = '14px';
        closeManageBtn.style.fontWeight = 'bold';
        closeManageBtn.style.marginTop = '20px';

        // Apply hover effect
        applyButtonStyle(closeManageBtn, '#666', '#555');

        manageModalContent.appendChild(manageModalTitle);
        manageModalContent.appendChild(folderFilterContainer);
        manageModalContent.appendChild(searchesListContainer);
        manageModalContent.appendChild(closeManageBtn);
        manageSearchesModal.appendChild(manageModalContent);
        document.body.appendChild(manageSearchesModal);

        /**
         * Refresh the searches list in the management modal
         */
        function refreshSearchesList() {
            const container = document.getElementById('searchesListContainer');
            const folderFilter = document.getElementById('folderFilterSelect');
            if (!container || !folderFilter) return;

            container.innerHTML = '';

            const result = getAllSearches();

            if (!result.success) {
                const errorMsg = document.createElement('p');
                errorMsg.innerText = result.error || 'Error loading saved searches';
                errorMsg.style.color = '#dc3545';
                errorMsg.style.textAlign = 'center';
                errorMsg.style.padding = '20px';
                container.appendChild(errorMsg);
                console.error('Failed to load searches:', result.error);
                folderFilter.innerHTML = '<option value="">All Folders</option>';
                return;
            }

            const searches = result.data;

            if (searches.length === 0) {
                const noSearchesMsg = document.createElement('p');
                noSearchesMsg.innerText = 'No saved searches found.';
                noSearchesMsg.style.color = '#666';
                noSearchesMsg.style.textAlign = 'center';
                noSearchesMsg.style.padding = '20px';
                container.appendChild(noSearchesMsg);
                folderFilter.innerHTML = '<option value="">All Folders</option>';
                return;
            }

            // Get unique folders
            const folders = new Set();
            searches.forEach(search => {
                if (search.folder && search.folder.trim()) {
                    folders.add(search.folder.trim());
                }
            });
            const sortedFolders = Array.from(folders).sort();

            // Save current filter selection
            const currentFilter = folderFilter.value;

            // Populate folder filter dropdown
            folderFilter.innerHTML = '<option value="">All Folders</option>';
            sortedFolders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder;
                option.text = folder;
                folderFilter.appendChild(option);
            });

            // Restore filter selection
            folderFilter.value = currentFilter;

            // Filter searches based on selected folder
            const filteredSearches = currentFilter
                ? searches.filter(search => search.folder && search.folder.trim() === currentFilter)
                : searches;

            if (filteredSearches.length === 0) {
                const noSearchesMsg = document.createElement('p');
                noSearchesMsg.innerText = `No saved searches found in "${currentFilter}" folder.`;
                noSearchesMsg.style.color = '#666';
                noSearchesMsg.style.textAlign = 'center';
                noSearchesMsg.style.padding = '20px';
                container.appendChild(noSearchesMsg);
                return;
            }

            // Group searches by folder
            const groupedSearches = {};
            filteredSearches.forEach(search => {
                const folder = search.folder && search.folder.trim() ? search.folder.trim() : 'Uncategorized';
                if (!groupedSearches[folder]) {
                    groupedSearches[folder] = [];
                }
                groupedSearches[folder].push(search);
            });

            // Display searches grouped by folder
            Object.keys(groupedSearches).sort().forEach(folderName => {
                // Create folder section
                const folderSection = document.createElement('div');
                folderSection.style.marginBottom = '20px';

                // Folder header
                const folderHeader = document.createElement('div');
                folderHeader.style.backgroundColor = '#FF0000';
                folderHeader.style.color = '#fff';
                folderHeader.style.padding = '8px 12px';
                folderHeader.style.borderRadius = '4px';
                folderHeader.style.fontSize = '14px';
                folderHeader.style.fontWeight = 'bold';
                folderHeader.style.marginBottom = '10px';
                folderHeader.innerText = folderName === 'Uncategorized' ? 'Uncategorized' : folderName;

                folderSection.appendChild(folderHeader);

                // Add searches in this folder
                groupedSearches[folderName].forEach(search => {
                    const searchItem = document.createElement('div');
                    searchItem.style.backgroundColor = '#fff';
                    searchItem.style.border = '1px solid #ddd';
                    searchItem.style.borderRadius = '4px';
                    searchItem.style.padding = '12px';
                    searchItem.style.marginBottom = '10px';
                    searchItem.style.marginLeft = '10px';
                    searchItem.style.marginRight = '10px';

                    const searchHeader = document.createElement('div');
                    searchHeader.style.display = 'flex';
                    searchHeader.style.justifyContent = 'space-between';
                    searchHeader.style.alignItems = 'center';
                    searchHeader.style.marginBottom = '8px';

                    const searchName = document.createElement('div');
                    searchName.style.fontSize = '16px';
                    searchName.style.fontWeight = 'bold';
                    searchName.style.color = '#333';

                    // Find the global index of this search to determine keyboard shortcut
                    const globalIndex = searches.findIndex(s => s.id === search.id);
                    const shortcutHint = globalIndex >= 0 && globalIndex < 9 ? ` [Alt+${globalIndex + 1}]` : '';
                    searchName.innerText = search.name + shortcutHint;

                    const searchButtons = document.createElement('div');
                    searchButtons.style.display = 'flex';
                    searchButtons.style.gap = '8px';

                    const upBtn = document.createElement('button');
                    upBtn.type = 'button';
                    upBtn.innerText = '⬆️';
                    upBtn.style.padding = '6px 10px';
                    upBtn.style.backgroundColor = '#6c757d';
                    upBtn.style.color = '#fff';
                    upBtn.style.border = 'none';
                    upBtn.style.borderRadius = '4px';
                    upBtn.style.cursor = 'pointer';
                    upBtn.style.fontSize = '12px';
                    upBtn.style.fontWeight = 'bold';
                    upBtn.title = 'Move up';

                    // Apply hover effect
                    applyButtonStyle(upBtn, '#6c757d', '#5a6268');

                    const downBtn = document.createElement('button');
                    downBtn.type = 'button';
                    downBtn.innerText = '⬇️';
                    downBtn.style.padding = '6px 10px';
                    downBtn.style.backgroundColor = '#6c757d';
                    downBtn.style.color = '#fff';
                    downBtn.style.border = 'none';
                    downBtn.style.borderRadius = '4px';
                    downBtn.style.cursor = 'pointer';
                    downBtn.style.fontSize = '12px';
                    downBtn.style.fontWeight = 'bold';
                    downBtn.title = 'Move down';

                    // Apply hover effect
                    applyButtonStyle(downBtn, '#6c757d', '#5a6268');

                    const editBtn = document.createElement('button');
                    editBtn.type = 'button';
                    editBtn.innerText = '✏️ Edit';
                    editBtn.style.padding = '6px 12px';
                    editBtn.style.backgroundColor = '#FFA500';
                    editBtn.style.color = '#fff';
                    editBtn.style.border = 'none';
                    editBtn.style.borderRadius = '4px';
                    editBtn.style.cursor = 'pointer';
                    editBtn.style.fontSize = '12px';
                    editBtn.style.fontWeight = 'bold';

                    // Apply hover effect
                    applyButtonStyle(editBtn, '#FFA500', '#e69500');

                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.innerText = '🗑️ Delete';
                    deleteBtn.style.padding = '6px 12px';
                    deleteBtn.style.backgroundColor = '#dc3545';
                    deleteBtn.style.color = '#fff';
                    deleteBtn.style.border = 'none';
                    deleteBtn.style.borderRadius = '4px';
                    deleteBtn.style.cursor = 'pointer';
                    deleteBtn.style.fontSize = '12px';
                    deleteBtn.style.fontWeight = 'bold';

                    // Apply hover effect
                    applyButtonStyle(deleteBtn, '#dc3545', '#c82333');

                    searchButtons.appendChild(upBtn);
                    searchButtons.appendChild(downBtn);
                    searchButtons.appendChild(editBtn);
                    searchButtons.appendChild(deleteBtn);

                    searchHeader.appendChild(searchName);
                    searchHeader.appendChild(searchButtons);

                    const searchDetails = document.createElement('div');
                    searchDetails.style.fontSize = '12px';
                    searchDetails.style.color = '#666';
                    searchDetails.style.marginTop = '5px';

                    const config = search.config || {};
                    const detailsParts = [];
                    if (config.regularSearch) detailsParts.push(`Search: ${config.regularSearch}`);
                    if (config.exactTerm) detailsParts.push(`Exact: "${config.exactTerm}"`);
                    if (config.excludeTerms) detailsParts.push(`Exclude: ${config.excludeTerms}`);
                    if (config.titleIncludes) detailsParts.push(`Title: ${config.titleIncludes}`);
                    if (config.videoLength && config.videoLength !== 'any') detailsParts.push(`Length: ${config.videoLength}`);
                    if (config.dateAfter) detailsParts.push(`After: ${config.dateAfter}`);
                    if (config.dateBefore) detailsParts.push(`Before: ${config.dateBefore}`);

                    searchDetails.innerText = detailsParts.length > 0 ? detailsParts.join(' | ') : 'No filters set';

                    searchItem.appendChild(searchHeader);
                    searchItem.appendChild(searchDetails);
                    folderSection.appendChild(searchItem);

                    // Up button handler
                    upBtn.addEventListener('click', function() {
                        const result = reorderSearch(search.id, 'up');
                        if (result.success) {
                            refreshSearchesList();
                            refreshSavedSearchesDropdown();
                            showToast('Search moved up', 'success', 1500);
                        } else {
                            showToast(result.error || 'Failed to reorder search', 'error');
                        }
                    });

                    // Down button handler
                    downBtn.addEventListener('click', function() {
                        const result = reorderSearch(search.id, 'down');
                        if (result.success) {
                            refreshSearchesList();
                            refreshSavedSearchesDropdown();
                            showToast('Search moved down', 'success', 1500);
                        } else {
                            showToast(result.error || 'Failed to reorder search', 'error');
                        }
                    });

                    // Delete button handler
                    deleteBtn.addEventListener('click', function() {
                        if (confirm(`Are you sure you want to delete "${search.name}"?`)) {
                            const result = deleteSearch(search.id);
                            if (result.success) {
                                refreshSearchesList();
                                refreshSavedSearchesDropdown();
                                showToast('Search deleted successfully!', 'success');
                            } else {
                                showToast(result.error || 'Failed to delete search. Please try again.', 'error');
                            }
                        }
                    });

                    // Edit button handler
                    editBtn.addEventListener('click', function() {
                        openEditModal(search);
                    });
                });

                container.appendChild(folderSection);
            });
        }

        // Edit Search Modal
        const editSearchModal = document.createElement('div');
        editSearchModal.id = 'editSearchModal';
        editSearchModal.style.position = 'fixed';
        editSearchModal.style.top = '0';
        editSearchModal.style.left = '0';
        editSearchModal.style.width = '100%';
        editSearchModal.style.height = '100%';
        editSearchModal.style.backgroundColor = 'var(--ays-glass-backdrop)';
        editSearchModal.style.backdropFilter = 'blur(8px)';
        editSearchModal.style.webkitBackdropFilter = 'blur(8px)';
        editSearchModal.style.zIndex = 'var(--ays-z-modal)';
        editSearchModal.style.display = 'none';
        editSearchModal.style.transition = 'opacity var(--ays-transition-slow)';

        const editModalContent = document.createElement('div');
        editModalContent.style.position = 'absolute';
        editModalContent.style.top = '50%';
        editModalContent.style.left = '50%';
        editModalContent.style.transform = 'translate(-50%, -50%)';
        editModalContent.style.backgroundColor = 'var(--ays-color-white)';
        editModalContent.style.borderRadius = 'var(--ays-radius-lg)';
        editModalContent.style.boxShadow = 'var(--ays-shadow-lg)';
        editModalContent.style.padding = 'var(--ays-spacing-2xl)';
        editModalContent.style.width = '400px';
        editModalContent.style.maxWidth = '90%';
        editModalContent.style.fontFamily = 'var(--ays-font-family)';

        const editModalTitle = document.createElement('h3');
        editModalTitle.innerText = 'Edit Saved Search';
        editModalTitle.style.marginTop = '0';
        editModalTitle.style.marginBottom = '15px';
        editModalTitle.style.fontSize = '18px';
        editModalTitle.style.color = '#333';

        const editNameField = createField('Search Name:', 'text', 'editSearchName', '');

        const editFolderField = createField('Folder (optional):', 'text', 'editSearchFolder', '');

        const editModalButtons = document.createElement('div');
        editModalButtons.style.display = 'flex';
        editModalButtons.style.gap = '10px';
        editModalButtons.style.marginTop = '20px';

        const confirmEditBtn = document.createElement('button');
        confirmEditBtn.type = 'button';
        confirmEditBtn.innerText = 'Save Changes';
        confirmEditBtn.style.flex = '1';
        confirmEditBtn.style.padding = '10px';
        confirmEditBtn.style.backgroundColor = '#FFA500';
        confirmEditBtn.style.color = '#fff';
        confirmEditBtn.style.border = 'none';
        confirmEditBtn.style.borderRadius = '4px';
        confirmEditBtn.style.cursor = 'pointer';
        confirmEditBtn.style.fontSize = '14px';
        confirmEditBtn.style.fontWeight = 'bold';

        // Apply hover effect
        applyButtonStyle(confirmEditBtn, '#FFA500', '#e69500');

        const cancelEditBtn = document.createElement('button');
        cancelEditBtn.type = 'button';
        cancelEditBtn.innerText = 'Cancel';
        cancelEditBtn.style.flex = '1';
        cancelEditBtn.style.padding = '10px';
        cancelEditBtn.style.backgroundColor = '#666';
        cancelEditBtn.style.color = '#fff';
        cancelEditBtn.style.border = 'none';
        cancelEditBtn.style.borderRadius = '4px';
        cancelEditBtn.style.cursor = 'pointer';
        cancelEditBtn.style.fontSize = '14px';
        cancelEditBtn.style.fontWeight = 'bold';

        // Apply hover effect
        applyButtonStyle(cancelEditBtn, '#666', '#555');

        editModalButtons.appendChild(confirmEditBtn);
        editModalButtons.appendChild(cancelEditBtn);

        editModalContent.appendChild(editModalTitle);
        editModalContent.appendChild(editNameField);
        editModalContent.appendChild(editFolderField);
        editModalContent.appendChild(editModalButtons);
        editSearchModal.appendChild(editModalContent);
        document.body.appendChild(editSearchModal);

        let currentEditSearchId = null;

        /**
         * Open the edit modal with a search's data
         * @param {Object} search - The search object to edit
         */
        function openEditModal(search) {
            currentEditSearchId = search.id;
            document.getElementById('editSearchName').value = search.name;
            document.getElementById('editSearchFolder').value = search.folder || '';
            animateModal(editSearchModal, true);
            document.getElementById('editSearchName').focus();
        }

        // Confirm edit handler
        confirmEditBtn.addEventListener('click', function() {
            const name = document.getElementById('editSearchName').value.trim();
            const folder = document.getElementById('editSearchFolder').value.trim();

            if (!name) {
                showToast('Please enter a name for this search', 'error');
                return;
            }

            // Validate name length
            if (name.length > 200) {
                showToast('Search name is too long (max 200 characters)', 'error');
                return;
            }

            if (!currentEditSearchId) {
                showToast('Error: No search selected for editing', 'error');
                return;
            }

            const result = updateSearch(currentEditSearchId, {
                name: name,
                folder: folder
            });

            if (result.success) {
                animateModal(editSearchModal, false);
                currentEditSearchId = null;
                refreshSearchesList();
                refreshSavedSearchesDropdown();
                showToast('Search updated successfully!', 'success');
            } else {
                showToast(result.error || 'Failed to update search. Please try again.', 'error');
            }
        });

        // Cancel edit handler
        cancelEditBtn.addEventListener('click', function() {
            animateModal(editSearchModal, false);
            currentEditSearchId = null;
        });

        // Close edit modal when clicking outside
        editSearchModal.addEventListener('click', function(e) {
            if (e.target === editSearchModal) {
                animateModal(editSearchModal, false);
                currentEditSearchId = null;
            }
        });

        // Folder filter change handler
        folderFilterSelect.addEventListener('change', function() {
            refreshSearchesList();
        });

        // Manage searches button click handler
        manageSearchesBtn.addEventListener('click', function() {
            refreshSearchesList();
            animateModal(manageSearchesModal, true);
        });

        // Close manage modal handler
        closeManageBtn.addEventListener('click', function() {
            animateModal(manageSearchesModal, false);
        });

        // Close manage modal when clicking outside
        manageSearchesModal.addEventListener('click', function(e) {
            if (e.target === manageSearchesModal) {
                animateModal(manageSearchesModal, false);
            }
        });

        // Refresh dropdown when popup opens
        toggleButton.addEventListener('click', function() {
            setTimeout(refreshSavedSearchesDropdown, 100);
        });

        // Initial population of dropdown
        refreshSavedSearchesDropdown();

        // Submit Button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.innerText = 'Search';
        submitBtn.style.padding = '10px 20px';
        submitBtn.style.backgroundColor = '#FF0000';
        submitBtn.style.color = '#fff';
        submitBtn.style.border = 'none';
        submitBtn.style.borderRadius = '4px';
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.fontSize = '16px';
        submitBtn.style.fontWeight = 'bold';
        submitBtn.style.width = '100%';
        submitBtn.style.marginTop = '10px';

        // Apply hover effect
        applyButtonStyle(submitBtn, '#FF0000', '#CC0000');

        form.appendChild(submitBtn);

        // Save Search Button
        const saveSearchBtn = document.createElement('button');
        saveSearchBtn.type = 'button';
        saveSearchBtn.innerText = '💾 Save Search';
        saveSearchBtn.style.padding = '10px 20px';
        saveSearchBtn.style.backgroundColor = '#333';
        saveSearchBtn.style.color = '#fff';
        saveSearchBtn.style.border = 'none';
        saveSearchBtn.style.borderRadius = '4px';
        saveSearchBtn.style.cursor = 'pointer';
        saveSearchBtn.style.fontSize = '14px';
        saveSearchBtn.style.fontWeight = 'bold';
        saveSearchBtn.style.width = '100%';
        saveSearchBtn.style.marginTop = '10px';

        // Apply hover effect
        applyButtonStyle(saveSearchBtn, '#333', '#222');

        form.appendChild(saveSearchBtn);

        // Save Search Modal
        const saveSearchModal = document.createElement('div');
        saveSearchModal.id = 'saveSearchModal';
        saveSearchModal.style.position = 'fixed';
        saveSearchModal.style.top = '0';
        saveSearchModal.style.left = '0';
        saveSearchModal.style.width = '100%';
        saveSearchModal.style.height = '100%';
        saveSearchModal.style.backgroundColor = 'var(--ays-glass-backdrop)';
        saveSearchModal.style.backdropFilter = 'blur(8px)';
        saveSearchModal.style.webkitBackdropFilter = 'blur(8px)';
        saveSearchModal.style.zIndex = 'var(--ays-z-modal)';
        saveSearchModal.style.display = 'none';
        saveSearchModal.style.transition = 'opacity var(--ays-transition-slow)';

        const modalContent = document.createElement('div');
        modalContent.style.position = 'absolute';
        modalContent.style.top = '50%';
        modalContent.style.left = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
        modalContent.style.backgroundColor = 'var(--ays-color-white)';
        modalContent.style.borderRadius = 'var(--ays-radius-lg)';
        modalContent.style.boxShadow = 'var(--ays-shadow-lg)';
        modalContent.style.padding = 'var(--ays-spacing-2xl)';
        modalContent.style.width = '350px';
        modalContent.style.maxWidth = '90%';
        modalContent.style.fontFamily = 'var(--ays-font-family)';

        const modalTitle = document.createElement('h3');
        modalTitle.innerText = 'Save Search';
        modalTitle.style.marginTop = '0';
        modalTitle.style.marginBottom = '15px';
        modalTitle.style.fontSize = '18px';
        modalTitle.style.color = '#333';

        const saveNameField = createField('Search Name:', 'text', 'saveSearchName', 'e.g., Python Tutorials 2024');

        const saveFolderField = createField('Folder (optional):', 'text', 'saveSearchFolder', 'e.g., Research');

        const modalButtons = document.createElement('div');
        modalButtons.style.display = 'flex';
        modalButtons.style.gap = '10px';
        modalButtons.style.marginTop = '20px';

        const confirmSaveBtn = document.createElement('button');
        confirmSaveBtn.type = 'button';
        confirmSaveBtn.innerText = 'Save';
        confirmSaveBtn.style.flex = '1';
        confirmSaveBtn.style.padding = '10px';
        confirmSaveBtn.style.backgroundColor = '#FF0000';
        confirmSaveBtn.style.color = '#fff';
        confirmSaveBtn.style.border = 'none';
        confirmSaveBtn.style.borderRadius = '4px';
        confirmSaveBtn.style.cursor = 'pointer';
        confirmSaveBtn.style.fontSize = '14px';
        confirmSaveBtn.style.fontWeight = 'bold';

        // Apply hover effect
        applyButtonStyle(confirmSaveBtn, '#FF0000', '#CC0000');

        const cancelSaveBtn = document.createElement('button');
        cancelSaveBtn.type = 'button';
        cancelSaveBtn.innerText = 'Cancel';
        cancelSaveBtn.style.flex = '1';
        cancelSaveBtn.style.padding = '10px';
        cancelSaveBtn.style.backgroundColor = '#666';
        cancelSaveBtn.style.color = '#fff';
        cancelSaveBtn.style.border = 'none';
        cancelSaveBtn.style.borderRadius = '4px';
        cancelSaveBtn.style.cursor = 'pointer';
        cancelSaveBtn.style.fontSize = '14px';
        cancelSaveBtn.style.fontWeight = 'bold';

        // Apply hover effect
        applyButtonStyle(cancelSaveBtn, '#666', '#555');

        modalButtons.appendChild(confirmSaveBtn);
        modalButtons.appendChild(cancelSaveBtn);

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(saveNameField);
        modalContent.appendChild(saveFolderField);
        modalContent.appendChild(modalButtons);
        saveSearchModal.appendChild(modalContent);
        document.body.appendChild(saveSearchModal);

        // Save Search button click handler
        saveSearchBtn.addEventListener('click', function() {
            animateModal(saveSearchModal, true);
            document.getElementById('saveSearchName').focus();
        });

        // Confirm save handler
        confirmSaveBtn.addEventListener('click', function() {
            const name = document.getElementById('saveSearchName').value.trim();
            const folder = document.getElementById('saveSearchFolder').value.trim();

            if (!name) {
                showToast('Please enter a name for this search', 'error');
                return;
            }

            // Validate name length
            if (name.length > 200) {
                showToast('Search name is too long (max 200 characters)', 'error');
                return;
            }

            // Gather current form data
            const config = {
                regularSearch: document.getElementById('regularSearch').value.trim(),
                exactTerm: document.getElementById('exactTerm').value.trim(),
                excludeTerms: document.getElementById('excludeTerms').value.trim(),
                titleIncludes: document.getElementById('titleIncludes').value.trim(),
                videoLength: document.getElementById('videoLength').value,
                dateAfter: document.getElementById('dateAfter').value,
                dateBefore: document.getElementById('dateBefore').value
            };

            const result = saveSearch({
                name: name,
                folder: folder,
                config: config
            });

            if (result.success) {
                // Clear and close modal
                document.getElementById('saveSearchName').value = '';
                document.getElementById('saveSearchFolder').value = '';
                animateModal(saveSearchModal, false);

                // Refresh the dropdown to include the newly saved search
                refreshSavedSearchesDropdown();

                // Select the newly saved search
                if (result.data && result.data.id) {
                    savedSearchesSelect.value = result.data.id;
                }

                showToast('Search saved successfully!', 'success');
            } else {
                showToast(result.error || 'Failed to save search. Please try again.', 'error');
            }
        });

        // Cancel save handler
        cancelSaveBtn.addEventListener('click', function() {
            document.getElementById('saveSearchName').value = '';
            document.getElementById('saveSearchFolder').value = '';
            animateModal(saveSearchModal, false);
        });

        // Close modal when clicking outside
        saveSearchModal.addEventListener('click', function(e) {
            if (e.target === saveSearchModal) {
                document.getElementById('saveSearchName').value = '';
                document.getElementById('saveSearchFolder').value = '';
                animateModal(saveSearchModal, false);
            }
        });

        // === Preset Management Modal ===
        const managePresetsModal = document.createElement('div');
        managePresetsModal.id = 'managePresetsModal';
        managePresetsModal.style.position = 'fixed';
        managePresetsModal.style.top = '0';
        managePresetsModal.style.left = '0';
        managePresetsModal.style.width = '100%';
        managePresetsModal.style.height = '100%';
        managePresetsModal.style.backgroundColor = 'var(--ays-glass-backdrop)';
        managePresetsModal.style.backdropFilter = 'blur(8px)';
        managePresetsModal.style.webkitBackdropFilter = 'blur(8px)';
        managePresetsModal.style.zIndex = 'var(--ays-z-modal)';
        managePresetsModal.style.display = 'none';
        managePresetsModal.style.transition = 'opacity var(--ays-transition-slow)';

        const presetModalContent = document.createElement('div');
        presetModalContent.style.position = 'absolute';
        presetModalContent.style.top = '50%';
        presetModalContent.style.left = '50%';
        presetModalContent.style.transform = 'translate(-50%, -50%)';
        presetModalContent.style.backgroundColor = 'var(--ays-color-white)';
        presetModalContent.style.borderRadius = 'var(--ays-radius-lg)';
        presetModalContent.style.boxShadow = 'var(--ays-shadow-lg)';
        presetModalContent.style.padding = 'var(--ays-spacing-2xl)';
        presetModalContent.style.width = '700px';
        presetModalContent.style.maxWidth = '90%';
        presetModalContent.style.fontFamily = 'var(--ays-font-family)';
        presetModalContent.style.maxHeight = '80vh';
        presetModalContent.style.overflow = 'auto';

        const presetModalTitle = document.createElement('h3');
        presetModalTitle.innerText = 'Manage Presets';
        presetModalTitle.style.marginTop = '0';
        presetModalTitle.style.marginBottom = 'var(--ays-spacing-lg)';
        presetModalTitle.style.fontSize = '20px';
        presetModalTitle.style.color = '#333';
        presetModalTitle.style.fontWeight = 'bold';

        const presetModalButtons = document.createElement('div');
        presetModalButtons.style.display = 'flex';
        presetModalButtons.style.gap = '10px';
        presetModalButtons.style.marginBottom = 'var(--ays-spacing-lg)';

        const createPresetBtn = document.createElement('button');
        createPresetBtn.type = 'button';
        createPresetBtn.id = 'aysCreatePresetBtn';
        createPresetBtn.innerHTML = '➕ Create New Preset';
        createPresetBtn.style.flex = '1';
        createPresetBtn.style.padding = '12px 16px';
        createPresetBtn.style.backgroundColor = 'var(--ays-color-primary)';
        createPresetBtn.style.color = '#fff';
        createPresetBtn.style.border = 'none';
        createPresetBtn.style.borderRadius = '6px';
        createPresetBtn.style.cursor = 'pointer';
        createPresetBtn.style.fontSize = '14px';
        createPresetBtn.style.fontWeight = 'bold';
        applyButtonStyle(createPresetBtn, 'var(--ays-color-primary)', '#0056b3');

        const refreshPresetsBtn = document.createElement('button');
        refreshPresetsBtn.type = 'button';
        refreshPresetsBtn.id = 'aysRefreshPresetsBtn';
        refreshPresetsBtn.innerHTML = '🔄 Refresh';
        refreshPresetsBtn.style.flex = '1';
        refreshPresetsBtn.style.padding = '12px 16px';
        refreshPresetsBtn.style.backgroundColor = '#6c757d';
        refreshPresetsBtn.style.color = '#fff';
        refreshPresetsBtn.style.border = 'none';
        refreshPresetsBtn.style.borderRadius = '6px';
        refreshPresetsBtn.style.cursor = 'pointer';
        refreshPresetsBtn.style.fontSize = '14px';
        refreshPresetsBtn.style.fontWeight = 'bold';
        applyButtonStyle(refreshPresetsBtn, '#6c757d', '#5a6268');

        presetModalButtons.appendChild(createPresetBtn);
        presetModalButtons.appendChild(refreshPresetsBtn);

        const presetsListContainer = document.createElement('div');
        presetsListContainer.id = 'aysPresetsList';
        presetsListContainer.style.maxHeight = '400px';
        presetsListContainer.style.overflowY = 'auto';
        presetsListContainer.style.border = '1px solid #ddd';
        presetsListContainer.style.borderRadius = '6px';
        presetsListContainer.style.padding = '10px';
        presetsListContainer.style.backgroundColor = '#f8f9fa';

        const closePresetModalBtn = document.createElement('button');
        closePresetModalBtn.type = 'button';
        closePresetModalBtn.id = 'aysClosePresetModalBtn';
        closePresetModalBtn.innerText = 'Close';
        closePresetModalBtn.style.width = '100%';
        closePresetModalBtn.style.padding = '12px';
        closePresetModalBtn.style.border = 'none';
        closePresetModalBtn.style.borderRadius = '6px';
        closePresetModalBtn.style.backgroundColor = '#666';
        closePresetModalBtn.style.color = '#fff';
        closePresetModalBtn.style.cursor = 'pointer';
        closePresetModalBtn.style.fontSize = '14px';
        closePresetModalBtn.style.fontWeight = 'bold';
        closePresetModalBtn.style.marginTop = 'var(--ays-spacing-lg)';
        applyButtonStyle(closePresetModalBtn, '#666', '#555');

        presetModalContent.appendChild(presetModalTitle);
        presetModalContent.appendChild(presetModalButtons);
        presetModalContent.appendChild(presetsListContainer);
        presetModalContent.appendChild(closePresetModalBtn);
        managePresetsModal.appendChild(presetModalContent);
        document.body.appendChild(managePresetsModal);

        // ==================================================================
        // KEYBOARD SHORTCUTS SETTINGS MODAL
        // ==================================================================

        const keyboardShortcutsModal = document.createElement('div');
        keyboardShortcutsModal.id = 'keyboardShortcutsModal';
        keyboardShortcutsModal.style.position = 'fixed';
        keyboardShortcutsModal.style.top = '0';
        keyboardShortcutsModal.style.left = '0';
        keyboardShortcutsModal.style.width = '100%';
        keyboardShortcutsModal.style.height = '100%';
        keyboardShortcutsModal.style.backgroundColor = 'var(--ays-glass-backdrop)';
        keyboardShortcutsModal.style.backdropFilter = 'blur(8px)';
        keyboardShortcutsModal.style.webkitBackdropFilter = 'blur(8px)';
        keyboardShortcutsModal.style.zIndex = 'var(--ays-z-modal)';
        keyboardShortcutsModal.style.display = 'none';
        keyboardShortcutsModal.style.transition = 'opacity var(--ays-transition-slow)';

        const shortcutsModalContent = document.createElement('div');
        shortcutsModalContent.style.position = 'absolute';
        shortcutsModalContent.style.top = '50%';
        shortcutsModalContent.style.left = '50%';
        shortcutsModalContent.style.transform = 'translate(-50%, -50%)';
        shortcutsModalContent.style.backgroundColor = 'var(--ays-color-white)';
        shortcutsModalContent.style.borderRadius = 'var(--ays-radius-lg)';
        shortcutsModalContent.style.boxShadow = 'var(--ays-shadow-lg)';
        shortcutsModalContent.style.padding = 'var(--ays-spacing-2xl)';
        shortcutsModalContent.style.width = '700px';
        shortcutsModalContent.style.maxWidth = '90%';
        shortcutsModalContent.style.maxHeight = '80vh';
        shortcutsModalContent.style.overflow = 'auto';
        shortcutsModalContent.style.fontFamily = 'var(--ays-font-family)';

        const shortcutsModalTitle = document.createElement('h3');
        shortcutsModalTitle.innerText = 'Keyboard Shortcuts Settings';
        shortcutsModalTitle.style.marginTop = '0';
        shortcutsModalTitle.style.marginBottom = 'var(--ays-spacing-lg)';
        shortcutsModalTitle.style.fontSize = '20px';
        shortcutsModalTitle.style.color = '#333';
        shortcutsModalTitle.style.fontWeight = 'bold';

        const shortcutsHelpText = document.createElement('div');
        shortcutsHelpText.style.padding = 'var(--ays-spacing-sm)';
        shortcutsHelpText.style.marginBottom = 'var(--ays-spacing-lg)';
        shortcutsHelpText.style.backgroundColor = '#f8f9fa';
        shortcutsHelpText.style.borderRadius = 'var(--ays-radius-sm)';
        shortcutsHelpText.style.border = '1px solid var(--ays-color-gray-300)';
        shortcutsHelpText.style.fontSize = '14px';
        shortcutsHelpText.style.color = '#555';
        shortcutsHelpText.innerHTML = '💡 <strong>Tip:</strong> Click on any shortcut field to capture a new keybinding. Use modifier keys (Ctrl, Alt, Shift, Cmd) to create combinations. Press Escape to cancel key capture.';

        shortcutsModalContent.appendChild(shortcutsModalTitle);
        shortcutsModalContent.appendChild(shortcutsHelpText);

        const shortcutsListContainer = document.createElement('div');
        shortcutsListContainer.id = 'keyboardShortcutsList';
        shortcutsListContainer.style.maxHeight = '400px';
        shortcutsListContainer.style.overflowY = 'auto';
        shortcutsListContainer.style.border = '1px solid #ddd';
        shortcutsListContainer.style.borderRadius = '6px';
        shortcutsListContainer.style.padding = '10px';
        shortcutsListContainer.style.backgroundColor = '#f8f9fa';
        shortcutsModalContent.appendChild(shortcutsListContainer);

        const shortcutsModalButtons = document.createElement('div');
        shortcutsModalButtons.style.display = 'flex';
        shortcutsModalButtons.style.gap = '10px';
        shortcutsModalButtons.style.marginTop = 'var(--ays-spacing-lg)';

        const resetAllShortcutsBtn = document.createElement('button');
        resetAllShortcutsBtn.type = 'button';
        resetAllShortcutsBtn.innerText = 'Reset All to Defaults';
        resetAllShortcutsBtn.style.flex = '1';
        resetAllShortcutsBtn.style.padding = '12px 16px';
        resetAllShortcutsBtn.style.backgroundColor = '#6c757d';
        resetAllShortcutsBtn.style.color = '#fff';
        resetAllShortcutsBtn.style.border = 'none';
        resetAllShortcutsBtn.style.borderRadius = '6px';
        resetAllShortcutsBtn.style.cursor = 'pointer';
        resetAllShortcutsBtn.style.fontSize = '14px';
        resetAllShortcutsBtn.style.fontWeight = 'bold';
        applyButtonStyle(resetAllShortcutsBtn, '#6c757d', '#5a6268');

        const closeShortcutsModalBtn = document.createElement('button');
        closeShortcutsModalBtn.type = 'button';
        closeShortcutsModalBtn.innerText = 'Close';
        closeShortcutsModalBtn.style.flex = '1';
        closeShortcutsModalBtn.style.padding = '12px 16px';
        closeShortcutsModalBtn.style.backgroundColor = 'var(--ays-color-primary)';
        closeShortcutsModalBtn.style.color = '#fff';
        closeShortcutsModalBtn.style.border = 'none';
        closeShortcutsModalBtn.style.borderRadius = '6px';
        closeShortcutsModalBtn.style.cursor = 'pointer';
        closeShortcutsModalBtn.style.fontSize = '14px';
        closeShortcutsModalBtn.style.fontWeight = 'bold';
        applyButtonStyle(closeShortcutsModalBtn, 'var(--ays-color-primary)', '#0056b3');

        shortcutsModalButtons.appendChild(resetAllShortcutsBtn);
        shortcutsModalButtons.appendChild(closeShortcutsModalBtn);

        shortcutsModalContent.appendChild(shortcutsModalButtons);
        keyboardShortcutsModal.appendChild(shortcutsModalContent);
        document.body.appendChild(keyboardShortcutsModal);

        let currentCaptureActionId = null;
        let isCapturingKey = false;

        function refreshShortcutsList() {
            shortcutsListContainer.innerHTML = '';
            const shortcuts = KEYBOARD_SHORTCUTS.getAllShortcuts();

            if (shortcuts.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.style.padding = 'var(--ays-spacing-xl)';
                emptyState.style.textAlign = 'center';
                emptyState.style.color = 'var(--ays-color-gray-600)';
                emptyState.innerText = 'No keyboard shortcuts configured.';
                shortcutsListContainer.appendChild(emptyState);
                return;
            }

            shortcuts.forEach(shortcut => {
                const activeCombo = KEYBOARD_SHORTCUTS.getActiveCombo(shortcut.actionId);
                const isReserved = activeCombo && KEYBOARD_SHORTCUTS.isReservedShortcut(activeCombo);
                const conflict = activeCombo ? KEYBOARD_SHORTCUTS.findConflict(activeCombo, shortcut.actionId) : null;

                const shortcutItem = document.createElement('div');
                shortcutItem.style.backgroundColor = '#fff';
                shortcutItem.style.border = '1px solid #ddd';
                shortcutItem.style.borderRadius = '6px';
                shortcutItem.style.padding = '12px';
                shortcutItem.style.marginBottom = '8px';
                shortcutItem.style.transition = 'all 0.2s ease';
                shortcutItem.style.display = 'flex';
                shortcutItem.style.justifyContent = 'space-between';
                shortcutItem.style.alignItems = 'center';

                if (isReserved) {
                    shortcutItem.style.border = '2px solid #FFA500';
                    shortcutItem.style.backgroundColor = '#fff8f0';
                } else if (conflict) {
                    shortcutItem.style.border = '2px solid #dc3545';
                    shortcutItem.style.backgroundColor = '#fff0f0';
                }

                const shortcutInfo = document.createElement('div');
                shortcutInfo.style.flex = '1';

                const shortcutName = document.createElement('div');
                shortcutName.style.fontWeight = 'bold';
                shortcutName.style.color = '#333';
                shortcutName.style.fontSize = '16px';
                shortcutName.style.marginBottom = '4px';
                shortcutName.innerText = shortcut.displayName;

                const shortcutCategory = document.createElement('div');
                shortcutCategory.style.fontSize = '12px';
                shortcutCategory.style.color = '#666';
                
                if (isReserved) {
                    shortcutCategory.innerHTML = '⚠️ Reserved browser shortcut';
                    shortcutCategory.style.color = '#FFA500';
                    shortcutCategory.style.fontWeight = 'bold';
                } else if (conflict) {
                    shortcutCategory.innerHTML = `⚠️ Conflicts with "${conflict.displayName}"`;
                    shortcutCategory.style.color = '#dc3545';
                    shortcutCategory.style.fontWeight = 'bold';
                } else if (!shortcut.isCustomizable) {
                    shortcutCategory.innerHTML = '🔒 Built-in (cannot customize)';
                    shortcutCategory.style.color = '#999';
                } else {
                    shortcutCategory.innerHTML = '✏️ Customizable';
                }

                shortcutInfo.appendChild(shortcutName);
                shortcutInfo.appendChild(shortcutCategory);

                const shortcutControls = document.createElement('div');
                shortcutControls.style.display = 'flex';
                shortcutControls.style.alignItems = 'center';
                shortcutControls.style.gap = '10px';

                const comboDisplay = document.createElement('div');
                comboDisplay.style.padding = '6px 12px';
                comboDisplay.style.border = '1px solid #ccc';
                comboDisplay.style.borderRadius = '4px';
                comboDisplay.style.fontSize = '14px';
                comboDisplay.style.fontFamily = 'monospace';
                comboDisplay.style.fontWeight = 'bold';
                comboDisplay.style.minWidth = '120px';
                comboDisplay.style.textAlign = 'center';
                comboDisplay.innerText = activeCombo ? KEYBOARD_SHORTCUTS.formatCombo(activeCombo) : 'None';

                if (isReserved) {
                    comboDisplay.style.backgroundColor = '#ffeaa7';
                    comboDisplay.style.borderColor = '#FFA500';
                    comboDisplay.style.color = '#d68910';
                } else if (conflict) {
                    comboDisplay.style.backgroundColor = '#ffebee';
                    comboDisplay.style.borderColor = '#dc3545';
                    comboDisplay.style.color = '#c62828';
                } else {
                    comboDisplay.style.backgroundColor = '#f0f0f0';
                    comboDisplay.style.borderColor = '#ccc';
                    comboDisplay.style.color = '#333';
                }

                if (shortcut.isCustomizable) {
                    comboDisplay.style.cursor = 'pointer';
                    comboDisplay.style.transition = 'all 0.2s ease';

                    comboDisplay.addEventListener('mouseenter', function() {
                        if (!isCapturingKey) {
                            comboDisplay.style.transform = 'scale(1.05)';
                            if (!isReserved && !conflict) {
                                comboDisplay.style.backgroundColor = '#e0e0e0';
                                comboDisplay.style.borderColor = '#999';
                            }
                        }
                    });

                    comboDisplay.addEventListener('mouseleave', function() {
                        if (!isCapturingKey || currentCaptureActionId !== shortcut.actionId) {
                            comboDisplay.style.transform = 'scale(1)';
                            if (isReserved) {
                                comboDisplay.style.backgroundColor = '#ffeaa7';
                                comboDisplay.style.borderColor = '#FFA500';
                            } else if (conflict) {
                                comboDisplay.style.backgroundColor = '#ffebee';
                                comboDisplay.style.borderColor = '#dc3545';
                            } else {
                                comboDisplay.style.backgroundColor = '#f0f0f0';
                                comboDisplay.style.borderColor = '#ccc';
                            }
                        }
                    });

                    comboDisplay.addEventListener('click', function() {
                        if (isCapturingKey) {
                            return;
                        }
                        startKeyCapture(shortcut.actionId, comboDisplay);
                    });

                    if (currentCaptureActionId === shortcut.actionId) {
                        comboDisplay.style.backgroundColor = '#fff3cd';
                        comboDisplay.style.borderColor = '#ffc107';
                        comboDisplay.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)';
                        comboDisplay.innerText = 'Press any key...';
                    }
                }

                shortcutControls.appendChild(comboDisplay);

                if (shortcut.isCustomizable && shortcut.userCombo) {
                    const resetBtn = document.createElement('button');
                    resetBtn.type = 'button';
                    resetBtn.innerHTML = '↺';
                    resetBtn.style.padding = '6px 12px';
                    resetBtn.style.border = 'none';
                    resetBtn.style.borderRadius = '4px';
                    resetBtn.style.cursor = 'pointer';
                    resetBtn.style.backgroundColor = '#dc3545';
                    resetBtn.style.color = 'white';
                    resetBtn.style.fontSize = '14px';
                    resetBtn.style.transition = 'transform 0.1s ease';
                    resetBtn.title = 'Reset to default';
                    applyButtonStyle(resetBtn, '#dc3545', '#c82333');

                    resetBtn.addEventListener('click', function() {
                        KEYBOARD_SHORTCUTS.resetShortcut(shortcut.actionId);
                        refreshShortcutsList();
                        showToast('Shortcut reset to default', 'success');
                    });

                    shortcutControls.appendChild(resetBtn);
                }

                shortcutItem.appendChild(shortcutInfo);
                shortcutItem.appendChild(shortcutControls);
                shortcutsListContainer.appendChild(shortcutItem);
            });

            const hasConflicts = shortcuts.some(s => {
                const combo = KEYBOARD_SHORTCUTS.getActiveCombo(s.actionId);
                return combo && (KEYBOARD_SHORTCUTS.isReservedShortcut(combo) || KEYBOARD_SHORTCUTS.hasConflict(combo, s.actionId));
            });

            if (hasConflicts && !document.getElementById('conflictWarningBanner')) {
                const conflictBanner = document.createElement('div');
                conflictBanner.id = 'conflictWarningBanner';
                conflictBanner.style.backgroundColor = '#fff3cd';
                conflictBanner.style.border = '1px solid #ffc107';
                conflictBanner.style.borderRadius = '6px';
                conflictBanner.style.padding = '10px';
                conflictBanner.style.marginBottom = '15px';
                conflictBanner.style.display = 'flex';
                conflictBanner.style.alignItems = 'center';
                conflictBanner.style.gap = '10px';
                conflictBanner.innerHTML = `
                    <span style="font-size: 18px;">⚠️</span>
                    <span style="flex: 1;">
                        <strong>Conflicts detected!</strong> Some shortcuts conflict with browser functionality or other actions. 
                        Review the highlighted items above and update them as needed.
                    </span>
                `;
                shortcutsListContainer.parentElement.insertBefore(conflictBanner, shortcutsListContainer);
            } else if (!hasConflicts) {
                const conflictBanner = document.getElementById('conflictWarningBanner');
                if (conflictBanner) {
                    conflictBanner.remove();
                }
            }
        }

        function startKeyCapture(actionId, displayElement) {
            isCapturingKey = true;
            currentCaptureActionId = actionId;
            refreshShortcutsList();
        }

        function stopKeyCapture() {
            isCapturingKey = false;
            currentCaptureActionId = null;
        }

        function handleKeyCapture(event) {
            if (!isCapturingKey || !currentCaptureActionId) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (event.key === 'Escape') {
                stopKeyCapture();
                refreshShortcutsList();
                showToast('Key capture cancelled', 'info');
                return;
            }

            const combo = KEYBOARD_SHORTCUTS.eventToCombo(event);

            const reservedDesc = KEYBOARD_SHORTCUTS.getReservedShortcutDescription(combo);
            if (reservedDesc) {
                const warningMsg = `⚠️ This shortcut (${KEYBOARD_SHORTCUTS.formatCombo(combo)}) is reserved for browser functionality: ${reservedDesc}. Using it may interfere with normal browser behavior. Do you want to continue?`;
                if (!confirm(warningMsg)) {
                    stopKeyCapture();
                    refreshShortcutsList();
                    return;
                }
            }

            const conflictingShortcut = KEYBOARD_SHORTCUTS.findConflict(combo, currentCaptureActionId);
            if (conflictingShortcut) {
                const conflictMsg = `⚠️ This shortcut (${KEYBOARD_SHORTCUTS.formatCombo(combo)}) is already used for "${conflictingShortcut.displayName}".\n\nWhat would you like to do?`;
                
                const action = prompt(
                    conflictMsg + '\n\n' +
                    'Type "1" to Auto-assign new shortcut to old action\n' +
                    'Type "2" to Override and replace old action\n' +
                    'Type "3" to Cancel',
                    '1'
                );

                if (action === '3' || action === null) {
                    stopKeyCapture();
                    refreshShortcutsList();
                    showToast('Shortcut assignment cancelled', 'info');
                    return;
                }

                if (action === '2') {
                    try {
                        KEYBOARD_SHORTCUTS.setCustomShortcut(currentCaptureActionId, combo);
                        stopKeyCapture();
                        refreshShortcutsList();
                        showToast(`Shortcut updated! ${conflictingShortcut.displayName} will no longer use this key.`, 'success', 4000);
                    } catch (error) {
                        showToast(error.message, 'error', 3000);
                        stopKeyCapture();
                        refreshShortcutsList();
                    }
                    return;
                }

                if (action === '1') {
                    const oldActionId = conflictingShortcut.actionId;
                    try {
                        KEYBOARD_SHORTCUTS.resetShortcut(oldActionId);
                        KEYBOARD_SHORTCUTS.setCustomShortcut(currentCaptureActionId, combo);
                        stopKeyCapture();
                        refreshShortcutsList();
                        showToast(`Success! ${conflictingShortcut.displayName} was reset to default shortcut.`, 'success', 4000);
                    } catch (error) {
                        showToast(error.message, 'error', 3000);
                        stopKeyCapture();
                        refreshShortcutsList();
                    }
                    return;
                }

                stopKeyCapture();
                refreshShortcutsList();
                showToast('Invalid choice. Shortcut assignment cancelled.', 'error');
                return;
            }

            try {
                KEYBOARD_SHORTCUTS.setCustomShortcut(currentCaptureActionId, combo);
                stopKeyCapture();
                refreshShortcutsList();
                showToast('Shortcut updated successfully', 'success');
            } catch (error) {
                showToast(error.message, 'error', 3000);
                stopKeyCapture();
                refreshShortcutsList();
            }
        }

        keyboardShortcutsModal.addEventListener('keydown', handleKeyCapture, { passive: false });

        keyboardShortcutsBtn.addEventListener('click', () => {
            keyboardShortcutsModal.style.display = 'block';
            animateModal(keyboardShortcutsModal, true);
            refreshShortcutsList();
        });

        closeShortcutsModalBtn.addEventListener('click', () => {
            stopKeyCapture();
            animateModal(keyboardShortcutsModal, false);
        });

        resetAllShortcutsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all keyboard shortcuts to their defaults?')) {
                KEYBOARD_SHORTCUTS.resetAllShortcuts();
                refreshShortcutsList();
                showToast('All shortcuts reset to defaults', 'success');
            }
        });

        keyboardShortcutsModal.addEventListener('click', (e) => {
            if (e.target === keyboardShortcutsModal) {
                stopKeyCapture();
                animateModal(keyboardShortcutsModal, false);
            }
        });

        // ==================================================================
        // END KEYBOARD SHORTCUTS SETTINGS MODAL
        // ==================================================================

        let currentEditPresetId = null;

        function refreshPresetsList() {
            presetsListContainer.innerHTML = '';
            const allPresets = getAllPresets();

            if (allPresets.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.style.padding = 'var(--ays-spacing-xl)';
                emptyState.style.textAlign = 'center';
                emptyState.style.color = 'var(--ays-color-gray-600)';
                emptyState.innerText = 'No presets available. Click "Create New Preset" to get started.';
                presetsListContainer.appendChild(emptyState);
                return;
            }

            // Separate built-in and custom presets
            const builtinPresets = allPresets.filter(p => !p.isCustom);
            const customPresets = allPresets.filter(p => p.isCustom);

            // Add built-in presets section
            if (builtinPresets.length > 0) {
                const builtinSection = document.createElement('div');
                builtinSection.style.marginBottom = 'var(--ays-spacing-lg)';

                const builtinHeader = document.createElement('div');
                builtinHeader.style.backgroundColor = '#e74c3c';
                builtinHeader.style.color = 'white';
                builtinHeader.style.padding = '8px 12px';
                builtinHeader.style.borderRadius = '4px';
                builtinHeader.style.marginBottom = '8px';
                builtinHeader.style.fontWeight = 'bold';
                builtinHeader.style.fontSize = '14px';
                builtinHeader.innerText = `Built-in Presets (${builtinPresets.length})`;
                builtinSection.appendChild(builtinHeader);

                builtinPresets.forEach(preset => {
                    builtinSection.appendChild(createPresetItem(preset, false));
                });

                presetsListContainer.appendChild(builtinSection);
            }

            // Add custom presets section
            if (customPresets.length > 0) {
                const customSection = document.createElement('div');
                customSection.style.marginBottom = 'var(--ays-spacing-lg)';

                const customHeader = document.createElement('div');
                customHeader.style.backgroundColor = '#28a745';
                customHeader.style.color = 'white';
                customHeader.style.padding = '8px 12px';
                customHeader.style.borderRadius = '4px';
                customHeader.style.marginBottom = '8px';
                customHeader.style.fontWeight = 'bold';
                customHeader.style.fontSize = '14px';
                customHeader.innerText = `Custom Presets (${customPresets.length})`;
                customSection.appendChild(customHeader);

                customPresets.forEach((preset, index) => {
                    customSection.appendChild(createPresetItem(preset, true, index));
                });

                presetsListContainer.appendChild(customSection);
            }
        }

        function createPresetItem(preset, isCustom, index = 0) {
            const presetItem = document.createElement('div');
            presetItem.style.backgroundColor = '#fff';
            presetItem.style.border = '1px solid #ddd';
            presetItem.style.borderRadius = '6px';
            presetItem.style.padding = '12px';
            presetItem.style.marginBottom = '8px';
            presetItem.style.transition = 'all 0.2s ease';

            if (isCustom) {
                presetItem.draggable = true;
                presetItem.style.cursor = 'move';

                presetItem.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', preset.id);
                    presetItem.style.opacity = '0.5';
                });

                presetItem.addEventListener('dragend', () => {
                    presetItem.style.opacity = '1';
                });

                presetItem.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    presetItem.style.backgroundColor = '#f0f0f0';
                    presetItem.style.borderColor = 'var(--ays-color-primary)';
                });

                presetItem.addEventListener('dragleave', () => {
                    presetItem.style.backgroundColor = '#fff';
                    presetItem.style.borderColor = '#ddd';
                });

                presetItem.addEventListener('drop', (e) => {
                    e.preventDefault();
                    presetItem.style.backgroundColor = '#fff';
                    presetItem.style.borderColor = '#ddd';

                    const draggedId = e.dataTransfer.getData('text/plain');
                    const targetId = preset.id;

                    if (draggedId !== targetId) {
                        const customPresets = getCustomPresets();
                        const draggedIndex = customPresets.findIndex(p => p.id === draggedId);
                        const targetIndex = customPresets.findIndex(p => p.id === targetId);

                        if (draggedIndex !== -1 && targetIndex !== -1) {
                            const [draggedPreset] = customPresets.splice(draggedIndex, 1);
                            customPresets.splice(targetIndex, 0, draggedPreset);
                            reorderCustomPresets(customPresets);
                            refreshPresetsList();
                            showToast('Preset reordered successfully', 'success');
                        }
                    }
                });
            }

            const presetHeader = document.createElement('div');
            presetHeader.style.display = 'flex';
            presetHeader.style.justifyContent = 'space-between';
            presetHeader.style.alignItems = 'center';
            presetHeader.style.marginBottom = '8px';

            const presetNameSection = document.createElement('div');
            presetNameSection.style.display = 'flex';
            presetNameSection.style.alignItems = 'center';
            presetNameSection.style.gap = '8px';

            const presetIcon = document.createElement('span');
            presetIcon.innerText = preset.icon || '📋';
            presetIcon.style.fontSize = '18px';

            const presetName = document.createElement('span');
            presetName.innerText = preset.name;
            presetName.style.fontWeight = 'bold';
            presetName.style.color = '#333';
            presetName.style.fontSize = '16px';

            presetNameSection.appendChild(presetIcon);
            presetNameSection.appendChild(presetName);

            const presetButtons = document.createElement('div');
            presetButtons.style.display = 'flex';
            presetButtons.style.gap = '6px';

            if (isCustom) {
                const editPresetBtn = document.createElement('button');
                editPresetBtn.type = 'button';
                editPresetBtn.innerHTML = '✏️';
                editPresetBtn.style.padding = '6px 10px';
                editPresetBtn.style.border = 'none';
                editPresetBtn.style.borderRadius = '4px';
                editPresetBtn.style.cursor = 'pointer';
                editPresetBtn.style.backgroundColor = '#FFA500';
                editPresetBtn.style.color = 'white';
                editPresetBtn.style.fontSize = '14px';
                editPresetBtn.style.transition = 'transform 0.1s ease';
                editPresetBtn.title = 'Edit preset';
                applyButtonStyle(editPresetBtn, '#FFA500', '#e69400');

                const deletePresetBtn = document.createElement('button');
                deletePresetBtn.type = 'button';
                deletePresetBtn.innerHTML = '🗑️';
                deletePresetBtn.style.padding = '6px 10px';
                deletePresetBtn.style.border = 'none';
                deletePresetBtn.style.borderRadius = '4px';
                deletePresetBtn.style.cursor = 'pointer';
                deletePresetBtn.style.backgroundColor = '#dc3545';
                deletePresetBtn.style.color = 'white';
                deletePresetBtn.style.fontSize = '14px';
                deletePresetBtn.style.transition = 'transform 0.1s ease';
                deletePresetBtn.title = 'Delete preset';
                applyButtonStyle(deletePresetBtn, '#dc3545', '#c82333');

                presetButtons.appendChild(editPresetBtn);
                presetButtons.appendChild(deletePresetBtn);
            } else {
                const builtinLabel = document.createElement('span');
                builtinLabel.innerText = 'Built-in';
                builtinLabel.style.padding = '4px 8px';
                builtinLabel.style.backgroundColor = '#e74c3c';
                builtinLabel.style.borderRadius = '4px';
                builtinLabel.style.fontSize = '12px';
                builtinLabel.style.color = 'white';
                builtinLabel.style.fontWeight = 'bold';
                presetButtons.appendChild(builtinLabel);
            }

            presetHeader.appendChild(presetNameSection);
            presetHeader.appendChild(presetButtons);

            const presetDetails = document.createElement('div');
            presetDetails.style.fontSize = '14px';
            presetDetails.style.color = '#666';
            presetDetails.style.paddingLeft = '28px';
            presetDetails.style.marginTop = '8px';

            let detailsText = preset.description;
            if (preset.category) {
                detailsText += ` • Category: ${preset.category}`;
            }
            if (preset.keyboardShortcut) {
                detailsText += ` • Shortcut: ${preset.keyboardShortcut}`;
            }

            presetDetails.innerText = detailsText;

            presetItem.appendChild(presetHeader);
            presetItem.appendChild(presetDetails);

            if (isCustom) {
                editPresetBtn.addEventListener('click', () => {
                    currentEditPresetId = preset.id;
                    openPresetEditModal(preset);
                });

                deletePresetBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete the preset "${preset.name}"?`)) {
                        deleteCustomPreset(preset.id);
                        refreshPresetsList();
                        showToast('Preset deleted successfully', 'success');
                    }
                });
            }

            return presetItem;
        }

        function openPresetEditModal(preset) {
            const newPresetName = prompt('Preset Name:', preset.name);
            if (newPresetName === null || !newPresetName.trim()) {
                showToast('Preset name is required', 'error');
                return;
            }

            const newDescription = prompt('Description:', preset.description);
            if (newDescription === null || !newDescription.trim()) {
                showToast('Description is required', 'error');
                return;
            }

            const newIcon = prompt('Icon (emoji):', preset.icon);
            if (newIcon === null) {
                return;
            }

            const updatedPreset = {
                name: newPresetName.trim(),
                description: newDescription.trim(),
                icon: newIcon.trim() || '📋'
            };

            if (updateCustomPreset(preset.id, updatedPreset)) {
                refreshPresetsList();
                showToast('Preset updated successfully', 'success');
            } else {
                showToast('Failed to update preset', 'error');
            }
        }

        function createPresetFromForm() {
            const name = prompt('Preset Name:');
            if (!name || !name.trim()) {
                showToast('Preset name is required', 'error');
                return;
            }

            const description = prompt('Description:');
            if (!description || !description.trim()) {
                showToast('Description is required', 'error');
                return;
            }

            const icon = prompt('Icon (emoji):', '📋');
            if (icon === null) {
                return;
            }

            const newPreset = {
                name: name.trim(),
                description: description.trim(),
                icon: icon?.trim() || '📋',
                category: 'Custom',
                keyboardShortcut: '',
                parameters: {
                    videoLength: document.getElementById('videoLength').value,
                    dateAfter: document.getElementById('dateAfter').value,
                    dateBefore: document.getElementById('dateBefore').value,
                    notes: 'Custom preset created from current form values'
                }
            };

            if (addCustomPreset(newPreset)) {
                refreshPresetsList();
                showToast('Preset created successfully', 'success');
            } else {
                showToast('Failed to create preset', 'error');
            }
        }

        // Event listeners for preset management
        const managePresetsBtn = document.getElementById('aysManagePresetsBtn');
        if (managePresetsBtn) {
            managePresetsBtn.addEventListener('click', () => {
                managePresetsModal.style.display = 'block';
                animateModal(managePresetsModal, true);
                refreshPresetsList();
            });
        }

        createPresetBtn.addEventListener('click', createPresetFromForm);
        refreshPresetsBtn.addEventListener('click', refreshPresetsList);
        closePresetModalBtn.addEventListener('click', () => {
            animateModal(managePresetsModal, false);
        });

        managePresetsModal.addEventListener('click', (e) => {
            if (e.target === managePresetsModal) {
                animateModal(managePresetsModal, false);
            }
        });

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const regularSearch = document.getElementById('regularSearch').value.trim();
            const exactTerm = document.getElementById('exactTerm').value.trim();
            const excludeTerms = document.getElementById('excludeTerms').value.trim();
            const titleIncludes = document.getElementById('titleIncludes').value.trim();
            const videoLength = document.getElementById('videoLength').value;
            const dateAfter = document.getElementById('dateAfter').value;
            const dateBefore = document.getElementById('dateBefore').value;

            let query = '';

            // Add regular search term
            if (regularSearch) {
                query += `${regularSearch}`;
            }

            // Add exact term
            if (exactTerm) {
                if (query.length > 0) query += ' ';
                query += `"${exactTerm}"`;
            }

            // Add exclude terms
            if (excludeTerms) {
                const excludes = excludeTerms.split(',').map(term => term.trim()).filter(term => term);
                excludes.forEach(term => {
                    query += ` -${term}`;
                });
            }

            // Add title includes
            if (titleIncludes) {
                const titles = titleIncludes.split(',').map(term => term.trim()).filter(term => term);
                titles.forEach(term => {
                    query += ` intitle:${term}`;
                });
            }

            // Add date filters
            if (dateAfter) {
                query += ` after:${dateAfter}`;
            }
            if (dateBefore) {
                query += ` before:${dateBefore}`;
            }

            // Encode the query
            const encodedQuery = encodeURIComponent(query.trim());

            // Construct the search URL
            let searchURL = `https://www.youtube.com/results?search_query=${encodedQuery}`;

            // Add video length filter if not 'any'
            if (videoLength !== 'any') {
                searchURL += `&sp=${videoLengthOptions[videoLength]}`;
            }

            // Redirect to the constructed search URL
            window.location.href = searchURL;
        });

        formContainer.appendChild(form);
        popupDiv.appendChild(formContainer);
        document.body.appendChild(popupDiv);

        // Toggle button functionality
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            if (popupDiv.style.display === 'none') {
                popupDiv.style.display = 'block';
            } else {
                popupDiv.style.display = 'none';
            }
        });

        // Prevent popup click from closing when clicking inside
        popupDiv.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Implement dragging functionality
        let isDragging = false;
        let offsetX, offsetY;

        popupHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = popupDiv.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // Ensure the popup stays within the viewport
                const popupWidth = popupDiv.offsetWidth;
                const popupHeight = popupDiv.offsetHeight;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + popupWidth > windowWidth) newLeft = windowWidth - popupWidth;
                if (newTop + popupHeight > windowHeight) newTop = windowHeight - popupHeight;

                popupDiv.style.left = `${newLeft}px`;
                popupDiv.style.top = `${newTop}px`;
                popupDiv.style.transform = 'none'; // Disable transform when dragging
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // Optional: Close popup when clicking outside of it
        document.addEventListener('click', function(event) {
            if (!popupDiv.contains(event.target) && event.target !== toggleButton) {
                popupDiv.style.display = 'none';
            }
        });

        // ==================================================================
        // KEYBOARD EVENT HANDLING SYSTEM
        // ==================================================================

        /**
         * Debounce function to prevent rapid-fire execution
         * @param {Function} func - The function to debounce
         * @param {number} wait - The debounce wait time in milliseconds
         * @returns {Function} Debounced function
         */
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        /**
         * Validate if a keyboard event should be processed
         * Checks for browser conflicts and invalid combinations
         * @param {KeyboardEvent} event - The keyboard event to validate
         * @returns {boolean} True if event should be processed, false otherwise
         */
        function shouldProcessEvent(event) {
            // Don't process if user is typing in an input field
            const activeElement = document.activeElement;
            const tag = activeElement ? activeElement.tagName.toLowerCase() : '';
            const isInputField = tag === 'input' || tag === 'textarea' || tag === 'select';

            // Allow shortcuts in input fields only if explicitly marked as global
            // Most shortcuts should not trigger when typing in form fields
            if (isInputField) {
                // Only allow certain shortcuts when focused on input
                const allowedInInput = ['escape', 'enter'];
                const key = event.key.toLowerCase();
                if (!allowedInInput.includes(key) && event.target.id !== 'regularSearch') {
                    return false;
                }
            }

            // Don't process if user is composing text (IME input)
            if (event.isComposing) {
                return false;
            }

            // Don't process if control key combinations that are browser defaults
            const browserReservedCombos = [
                { ctrl: true, key: 'w' },  // Close tab
                { ctrl: true, key: 't' },  // New tab
                { ctrl: true, key: 'l' },  // Focus address bar
                { ctrl: true, key: 'd' },  // Bookmark page
                { ctrl: true, shift: true, key: 't' },  // Reopen closed tab
                { ctrl: true, shift: true, key: 'n' },  // New incognito window
                { ctrl: true, shift: true, key: 'w' },  // Close window
            ];

            for (const combo of browserReservedCombos) {
                if (combo.ctrl && !event.ctrlKey) continue;
                if (combo.shift && !event.shiftKey) continue;
                if (combo.alt && !event.altKey) continue;
                if (combo.meta && !event.metaKey) continue;

                const keyMatches = combo.key.toLowerCase() === event.key.toLowerCase();
                const modifierMatches = (combo.ctrl === event.ctrlKey) &&
                                   (combo.shift === event.shiftKey) &&
                                   (combo.alt === event.altKey) &&
                                   (combo.meta === event.metaKey);

                if (keyMatches && modifierMatches) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Execute action based on keyboard shortcut
         * @param {string} actionId - The ID of the action to execute
         * @param {KeyboardEvent} event - The original keyboard event
         */
        function executeShortcutAction(actionId, event) {
            try {
                switch (actionId) {
                    case 'focusSearch':
                        event.preventDefault();
                        const searchInput = document.getElementById('regularSearch');
                        if (searchInput) {
                            searchInput.focus();
                            showToast('Search field focused', 'info', 1000);
                        }
                        break;

                    case 'closePopup':
                        event.preventDefault();
                        const popup = document.getElementById('advancedSearchPopup');
                        if (popup && popup.style.display !== 'none') {
                            popup.style.display = 'none';
                            showToast('Popup closed', 'info', 1000);
                        }
                        break;

                    case 'executeSearch':
                        const activeInput = document.activeElement;
                        if (activeInput && activeInput.id === 'regularSearch') {
                            // Allow normal form submission when in search field
                            return;
                        }
                        event.preventDefault();
                        const submitBtn = document.querySelector('form button[type="submit"]');
                        if (submitBtn) {
                            submitBtn.click();
                        }
                        break;

                    default:
                        // Handle saved search execution (executeSavedSearch1-9)
                        if (actionId.startsWith('executeSavedSearch')) {
                            const match = actionId.match(/executeSavedSearch(\d+)/);
                            if (match) {
                                const index = parseInt(match[1]) - 1;
                                event.preventDefault();

                                const result = getAllSearches();
                                if (result.success && index < result.data.length) {
                                    const search = result.data[index];
                                    showToast(`Executing: ${search.name}`, 'info', 1500);
                                    executeSavedSearch(search.id);
                                } else {
                                    showToast(`No saved search at position ${index + 1}`, 'error', 2000);
                                }
                            }
                        }
                        break;
                }
            } catch (error) {
                console.error('Error executing shortcut action:', error);
                showToast('Error executing shortcut', 'error', 2000);
            }
        }

        /**
         * Debounced shortcut handler
         * Prevents rapid-fire execution of the same shortcut
         */
        const debouncedShortcutHandler = debounce(function(actionId, event) {
            executeShortcutAction(actionId, event);
        }, 100);

        /**
         * Global keyboard event listener for all shortcuts
         * Handles all registered keyboard shortcuts with proper validation and debouncing
         */
        document.addEventListener('keydown', function(event) {
            // Validate if the event should be processed
            if (!shouldProcessEvent(event)) {
                return;
            }

            // Find the action associated with this keyboard event
            const action = KEYBOARD_SHORTCUTS.findActionForEvent(event);

            // If an action was found, execute it
            if (action) {
                event.preventDefault();
                debouncedShortcutHandler(action.actionId, event);
            }
        }, { passive: false });

    }

    // Initialize migrations for shortcuts and presets
    handleShortcutsMigration();
    handlePresetMigration();

    // Initialize the script by injecting the popup
    waitForElement('body', function() {
        injectAdvancedSearchPopup();
    });

})();
