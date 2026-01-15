// ==UserScript==
// @name         Advanced YouTube Search
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enhance YouTube search with advanced parameters: exact terms, exclusions, title filters, video length, date range, sort options, and content type filtering.
// @author       bitgineer https://github.com/bitgineer
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const STORAGE_KEY = 'advancedYTSearch_settings';
    const KEYBOARD_SHORTCUT = { ctrl: true, shift: true, key: 's' };

    // Updated filter parameters (base64 protobuf encoded)
    const videoLengthOptions = {
        "any": "",
        "short": "EgIYBA%3D%3D",    // Under 3 minutes
        "medium": "EgIYBQ%3D%3D",   // 3-20 minutes
        "long": "EgIYAg%3D%3D"      // Over 20 minutes
    };

    const sortOptions = {
        "relevance": "",
        "date": "CAI%3D",
        "views": "CAM%3D",
        "rating": "CAE%3D"
    };

    const typeOptions = {
        "all": "",
        "video": "EgIQAQ%3D%3D",
        "channel": "EgIQAg%3D%3D",
        "playlist": "EgIQAw%3D%3D"
    };

    const qualityOptions = {
        "any": "",
        "hd": "EgIwAQ%3D%3D",
        "4k": "EgI4AQ%3D%3D"
    };

    // ===== STYLES =====
    const styles = `
        .ays-toggle-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            padding: 12px 20px;
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
            color: #fff;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4);
            font-size: 14px;
            font-weight: 600;
            font-family: 'Roboto', 'YouTube Sans', sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ays-toggle-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 6px 28px rgba(255, 0, 0, 0.5);
        }
        .ays-toggle-btn:active {
            transform: translateY(0) scale(0.98);
        }
        .ays-toggle-btn svg {
            width: 18px;
            height: 18px;
        }

        .ays-popup {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 480px;
            max-width: calc(100vw - 40px);
            max-height: calc(100vh - 120px);
            background: rgba(24, 24, 24, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
            z-index: 10000;
            display: none;
            overflow: hidden;
            font-family: 'Roboto', 'YouTube Sans', sans-serif;
            animation: ays-slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes ays-slideIn {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        .ays-popup.ays-visible {
            display: block;
        }

        .ays-header {
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
            color: #fff;
            padding: 16px 20px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .ays-header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .ays-header-actions {
            display: flex;
            gap: 8px;
        }
        .ays-header-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: #fff;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .ays-header-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .ays-header-btn svg {
            width: 16px;
            height: 16px;
        }

        .ays-body {
            padding: 20px;
            overflow-y: auto;
            max-height: calc(100vh - 240px);
        }
        .ays-body::-webkit-scrollbar {
            width: 8px;
        }
        .ays-body::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }
        .ays-body::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }

        .ays-section {
            margin-bottom: 24px;
        }
        .ays-section:last-child {
            margin-bottom: 0;
        }
        .ays-section-title {
            color: #aaa;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ays-section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
        }

        .ays-field {
            margin-bottom: 16px;
        }
        .ays-field:last-child {
            margin-bottom: 0;
        }
        .ays-label {
            display: block;
            color: #e0e0e0;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 8px;
        }
        .ays-input, .ays-select {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s;
            box-sizing: border-box;
        }
        .ays-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }
        .ays-input:focus, .ays-select:focus {
            outline: none;
            border-color: #ff0000;
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.2);
        }
        .ays-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            padding-right: 40px;
        }
        .ays-select option {
            background: #1a1a1a;
            color: #fff;
        }

        .ays-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .ays-btn-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        .ays-btn {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s;
        }
        .ays-btn-primary {
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
            color: #fff;
        }
        .ays-btn-primary:hover {
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4);
            transform: translateY(-1px);
        }
        .ays-btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        .ays-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .ays-shortcut-hint {
            text-align: center;
            color: rgba(255, 255, 255, 0.4);
            font-size: 11px;
            margin-top: 16px;
        }
        .ays-shortcut-hint kbd {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
    `;

    // ===== HELPER FUNCTIONS =====
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function saveSettings(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('AYS: Failed to save settings', e);
        }
    }

    function loadSettings() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    function combineFilters(...filters) {
        // Combine multiple filter parameters
        // YouTube uses base64-encoded protobufs, we just use the first non-empty one
        // For more complex combinations, proper protobuf merging would be needed
        return filters.find(f => f && f !== '') || '';
    }

    // ===== MAIN UI =====
    function createAdvancedSearchUI() {
        // Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'ays-toggle-btn';
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            Advanced Search
        `;
        toggleBtn.title = 'Advanced YouTube Search (Ctrl+Shift+S)';
        document.body.appendChild(toggleBtn);

        // Popup Container
        const popup = document.createElement('div');
        popup.className = 'ays-popup';
        popup.id = 'aysPopup';

        const savedSettings = loadSettings();

        popup.innerHTML = `
            <div class="ays-header">
                <h2>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    Advanced Search
                </h2>
                <div class="ays-header-actions">
                    <button class="ays-header-btn" id="aysResetBtn" title="Reset form">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                    </button>
                    <button class="ays-header-btn" id="aysCloseBtn" title="Close">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="ays-body">
                <form id="aysForm">
                    <div class="ays-section">
                        <div class="ays-section-title">Search Query</div>
                        <div class="ays-field">
                            <label class="ays-label" for="aysSearch">Keywords</label>
                            <input type="text" id="aysSearch" class="ays-input" placeholder="Enter search terms..." value="${savedSettings.search || ''}">
                        </div>
                        <div class="ays-row">
                            <div class="ays-field">
                                <label class="ays-label" for="aysExact">Exact Phrase</label>
                                <input type="text" id="aysExact" class="ays-input" placeholder='"exact match"' value="${savedSettings.exact || ''}">
                            </div>
                            <div class="ays-field">
                                <label class="ays-label" for="aysExclude">Exclude</label>
                                <input type="text" id="aysExclude" class="ays-input" placeholder="spam, ads" value="${savedSettings.exclude || ''}">
                            </div>
                        </div>
                        <div class="ays-field">
                            <label class="ays-label" for="aysTitle">Title Contains</label>
                            <input type="text" id="aysTitle" class="ays-input" placeholder="tutorial, review" value="${savedSettings.title || ''}">
                        </div>
                    </div>

                    <div class="ays-section">
                        <div class="ays-section-title">Filters</div>
                        <div class="ays-row">
                            <div class="ays-field">
                                <label class="ays-label" for="aysLength">Duration</label>
                                <select id="aysLength" class="ays-select">
                                    <option value="any" ${savedSettings.length === 'any' ? 'selected' : ''}>Any length</option>
                                    <option value="short" ${savedSettings.length === 'short' ? 'selected' : ''}>Under 3 min</option>
                                    <option value="medium" ${savedSettings.length === 'medium' ? 'selected' : ''}>3-20 min</option>
                                    <option value="long" ${savedSettings.length === 'long' ? 'selected' : ''}>Over 20 min</option>
                                </select>
                            </div>
                            <div class="ays-field">
                                <label class="ays-label" for="aysType">Content Type</label>
                                <select id="aysType" class="ays-select">
                                    <option value="all" ${savedSettings.type === 'all' ? 'selected' : ''}>All</option>
                                    <option value="video" ${savedSettings.type === 'video' ? 'selected' : ''}>Videos</option>
                                    <option value="channel" ${savedSettings.type === 'channel' ? 'selected' : ''}>Channels</option>
                                    <option value="playlist" ${savedSettings.type === 'playlist' ? 'selected' : ''}>Playlists</option>
                                </select>
                            </div>
                        </div>
                        <div class="ays-row">
                            <div class="ays-field">
                                <label class="ays-label" for="aysSort">Sort By</label>
                                <select id="aysSort" class="ays-select">
                                    <option value="relevance" ${savedSettings.sort === 'relevance' ? 'selected' : ''}>Relevance</option>
                                    <option value="date" ${savedSettings.sort === 'date' ? 'selected' : ''}>Upload date</option>
                                    <option value="views" ${savedSettings.sort === 'views' ? 'selected' : ''}>View count</option>
                                    <option value="rating" ${savedSettings.sort === 'rating' ? 'selected' : ''}>Rating</option>
                                </select>
                            </div>
                            <div class="ays-field">
                                <label class="ays-label" for="aysQuality">Quality</label>
                                <select id="aysQuality" class="ays-select">
                                    <option value="any" ${savedSettings.quality === 'any' ? 'selected' : ''}>Any quality</option>
                                    <option value="hd" ${savedSettings.quality === 'hd' ? 'selected' : ''}>HD (720p+)</option>
                                    <option value="4k" ${savedSettings.quality === '4k' ? 'selected' : ''}>4K</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="ays-section">
                        <div class="ays-section-title">Date Range</div>
                        <div class="ays-row">
                            <div class="ays-field">
                                <label class="ays-label" for="aysAfter">After</label>
                                <input type="date" id="aysAfter" class="ays-input" value="${savedSettings.after || ''}">
                            </div>
                            <div class="ays-field">
                                <label class="ays-label" for="aysBefore">Before</label>
                                <input type="date" id="aysBefore" class="ays-input" value="${savedSettings.before || ''}">
                            </div>
                        </div>
                    </div>

                    <div class="ays-btn-group">
                        <button type="button" class="ays-btn ays-btn-secondary" id="aysClearBtn">Clear</button>
                        <button type="submit" class="ays-btn ays-btn-primary">Search</button>
                    </div>
                </form>
                <div class="ays-shortcut-hint">
                    Toggle with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // ===== EVENT HANDLERS =====
        const header = popup.querySelector('.ays-header');
        const closeBtn = popup.querySelector('#aysCloseBtn');
        const resetBtn = popup.querySelector('#aysResetBtn');
        const clearBtn = popup.querySelector('#aysClearBtn');
        const form = popup.querySelector('#aysForm');

        // Toggle popup visibility
        function togglePopup() {
            popup.classList.toggle('ays-visible');
            if (popup.classList.contains('ays-visible')) {
                popup.querySelector('#aysSearch').focus();
            }
        }

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePopup();
        });

        closeBtn.addEventListener('click', () => {
            popup.classList.remove('ays-visible');
        });

        // Reset form to saved settings
        resetBtn.addEventListener('click', () => {
            const saved = loadSettings();
            form.querySelector('#aysSearch').value = saved.search || '';
            form.querySelector('#aysExact').value = saved.exact || '';
            form.querySelector('#aysExclude').value = saved.exclude || '';
            form.querySelector('#aysTitle').value = saved.title || '';
            form.querySelector('#aysLength').value = saved.length || 'any';
            form.querySelector('#aysType').value = saved.type || 'all';
            form.querySelector('#aysSort').value = saved.sort || 'relevance';
            form.querySelector('#aysQuality').value = saved.quality || 'any';
            form.querySelector('#aysAfter').value = saved.after || '';
            form.querySelector('#aysBefore').value = saved.before || '';
        });

        // Clear all fields
        clearBtn.addEventListener('click', () => {
            form.querySelector('#aysSearch').value = '';
            form.querySelector('#aysExact').value = '';
            form.querySelector('#aysExclude').value = '';
            form.querySelector('#aysTitle').value = '';
            form.querySelector('#aysLength').value = 'any';
            form.querySelector('#aysType').value = 'all';
            form.querySelector('#aysSort').value = 'relevance';
            form.querySelector('#aysQuality').value = 'any';
            form.querySelector('#aysAfter').value = '';
            form.querySelector('#aysBefore').value = '';
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const search = form.querySelector('#aysSearch').value.trim();
            const exact = form.querySelector('#aysExact').value.trim();
            const exclude = form.querySelector('#aysExclude').value.trim();
            const title = form.querySelector('#aysTitle').value.trim();
            const length = form.querySelector('#aysLength').value;
            const type = form.querySelector('#aysType').value;
            const sort = form.querySelector('#aysSort').value;
            const quality = form.querySelector('#aysQuality').value;
            const after = form.querySelector('#aysAfter').value;
            const before = form.querySelector('#aysBefore').value;

            // Save settings
            saveSettings({ search, exact, exclude, title, length, type, sort, quality, after, before });

            // Build query
            let query = '';

            if (search) query += search;

            if (exact) {
                if (query) query += ' ';
                query += `"${exact}"`;
            }

            if (exclude) {
                const terms = exclude.split(',').map(t => t.trim()).filter(t => t);
                terms.forEach(term => {
                    query += ` -${term}`;
                });
            }

            if (title) {
                const terms = title.split(',').map(t => t.trim()).filter(t => t);
                terms.forEach(term => {
                    query += ` intitle:${term}`;
                });
            }

            if (after) query += ` after:${after}`;
            if (before) query += ` before:${before}`;

            if (!query.trim()) {
                alert('Please enter at least one search term or filter.');
                return;
            }

            // Build URL
            const encodedQuery = encodeURIComponent(query.trim());
            let searchURL = `https://www.youtube.com/results?search_query=${encodedQuery}`;

            // Add sp parameter for filters
            // Priority: sort > length > type > quality (YouTube only supports one sp at a time for simple cases)
            const spParam = sortOptions[sort] || videoLengthOptions[length] || typeOptions[type] || qualityOptions[quality];
            if (spParam) {
                searchURL += `&sp=${spParam}`;
            }

            window.location.href = searchURL;
        });

        // Dragging functionality
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.ays-header-btn')) return;
            isDragging = true;
            const rect = popup.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            popup.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let newLeft = e.clientX - dragOffsetX;
            let newTop = e.clientY - dragOffsetY;

            // Keep within viewport
            const popupWidth = popup.offsetWidth;
            const popupHeight = popup.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - popupWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - popupHeight));

            popup.style.left = `${newLeft}px`;
            popup.style.top = `${newTop}px`;
            popup.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                popup.style.transition = '';
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (popup.classList.contains('ays-visible') &&
                !popup.contains(e.target) &&
                !toggleBtn.contains(e.target)) {
                popup.classList.remove('ays-visible');
            }
        });

        // Prevent popup clicks from bubbling
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey === KEYBOARD_SHORTCUT.ctrl &&
                e.shiftKey === KEYBOARD_SHORTCUT.shift &&
                e.key.toLowerCase() === KEYBOARD_SHORTCUT.key) {
                e.preventDefault();
                togglePopup();
            }
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        // Wait for body to be ready
        if (!document.body) {
            const observer = new MutationObserver((mutations, me) => {
                if (document.body) {
                    me.disconnect();
                    initUI();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        } else {
            initUI();
        }
    }

    function initUI() {
        injectStyles();
        createAdvancedSearchUI();
    }

    init();

})();
