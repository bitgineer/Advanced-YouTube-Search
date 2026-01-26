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
    `;
    
    // Inject the style tag into the document head
    (document.head || document.documentElement).appendChild(style);
    
    // ==================================================================
    // END CSS DESIGN SYSTEM
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

    // Storage key for saved searches in localStorage
    const STORAGE_KEY = 'advancedYoutubeSearches';

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
        popupHeader.innerText = 'Advanced YouTube Search';

        popupDiv.appendChild(popupHeader);

        // Create the form container
        const formContainer = document.createElement('div');
        formContainer.style.padding = 'var(--ays-spacing-xl)';
        popupDiv.appendChild(formContainer);

        // Create form element
        const form = document.createElement('form');

        // Helper function to create form fields
        function createField(labelText, inputType, inputName, placeholder='', options=[]) {
            const div = document.createElement('div');
            div.style.marginBottom = 'var(--ays-spacing-md)';

            const label = document.createElement('label');
            label.innerText = labelText;
            label.htmlFor = inputName;
            label.style.display = 'block';
            label.style.marginBottom = '6px';
            label.style.fontWeight = 'var(--ays-font-weight-bold)';
            label.style.fontSize = 'var(--ays-font-size-sm)';
            label.style.color = 'var(--ays-color-gray-700)';
            label.style.fontFamily = 'var(--ays-font-family)';

            let input;
            if (inputType === 'select') {
                input = document.createElement('select');
                input.name = inputName;
                input.id = inputName;
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
            } else {
                input = document.createElement('input');
                input.type = inputType;
                input.name = inputName;
                input.id = inputName;
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

            // Add focus effect with design system
            input.addEventListener('focus', function() {
                input.style.borderColor = 'var(--ays-color-primary)';
                input.style.boxShadow = 'var(--ays-shadow-focus)';
            });

            input.addEventListener('blur', function() {
                input.style.borderColor = 'var(--ays-color-gray-300)';
                input.style.boxShadow = 'none';
            });

            div.appendChild(label);
            div.appendChild(input);
            return div;
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

        // Keyboard shortcuts for saved searches (Alt+1-9)
        document.addEventListener('keydown', function(event) {
            // Check if Alt key is pressed and a number key (1-9) is pressed
            if (event.altKey && event.key >= '1' && event.key <= '9') {
                event.preventDefault();

                // Get the index (0-8) from the key (1-9)
                const index = parseInt(event.key) - 1;

                // Get all saved searches
                const result = getAllSearches();

                if (result.success && index < result.data.length) {
                    const search = result.data[index];

                    // Show visual feedback
                    showToast(`Executing: ${search.name}`, 'info', 1500);

                    // Execute the saved search directly
                    executeSavedSearch(search.id);
                }
            }
        });

    }

    // Initialize the script by injecting the popup
    waitForElement('body', function() {
        injectAdvancedSearchPopup();
    });

})();
