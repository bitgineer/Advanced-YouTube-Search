---
type: documentation
title: Design System Documentation
created: 2026-01-26
tags:
  - design-system
  - css
  - styling
  - variables
related:
  - "[[Phase-01-Foundation-Visual-Redesign]]"
  - "[[visual-consistency-test-report]]"
---

# Design System Documentation

This document defines the visual design system for Advanced YouTube Search, including CSS custom properties (variables), utility classes, component patterns, and migration notes.

## Overview

The design system uses modern CSS custom properties with a `--ays-` (Advanced YouTube Search) prefix to ensure namespace safety and prevent conflicts with other stylesheets on YouTube pages.

**Design Philosophy:**
- **Modern flat design** with subtle shadows and smooth transitions
- **System-ui font stack** for native OS feel
- **4px-based spacing scale** for consistent rhythm
- **Semantic color palette** with WCAG accessibility in mind
- **Utility-first approach** for rapid development

---

## CSS Custom Properties

### Color Palette

#### Primary Colors
```css
--ays-color-primary: #FF0000
--ays-color-primary-dark: #CC0000
--ays-color-primary-light: #ff3333
```
*Usage:* Primary actions, main buttons, headers

#### Secondary Colors
```css
--ays-color-secondary: #0066cc
--ays-color-secondary-dark: #0052a3
--ays-color-secondary-light: #3385d6
```
*Usage:* Secondary actions, informational elements, management buttons

#### Semantic Colors
```css
--ays-color-success: #4CAF50
--ays-color-success-dark: #45a049
--ays-color-success-light: #66bb6a

--ays-color-danger: #dc3545
--ays-color-danger-dark: #c82333
--ays-color-danger-light: #e74c3c

--ays-color-warning: #FFA500
--ays-color-warning-dark: #e69500
--ays-color-warning-light: #ffb84d
```
*Usage:* Success states, errors/danger, warnings/alerts

#### Neutral Grays (10-step scale)
```css
--ays-color-gray-50: #f9f9f9
--ays-color-gray-100: #f0f0f0
--ays-color-gray-200: #e0e0e0
--ays-color-gray-300: #cccccc
--ays-color-gray-400: #999999
--ays-color-gray-500: #666666
--ays-color-gray-600: #555555
--ays-color-gray-700: #444444
--ays-color-gray-800: #333333
--ays-color-gray-900: #222222

--ays-color-white: #ffffff
--ays-color-black: #000000
```
*Usage:* Text, borders, backgrounds, disabled states

---

### Spacing Scale (4px Base)

```css
--ays-spacing-xs: 4px
--ays-spacing-sm: 8px
--ays-spacing-md: 12px
--ays-spacing-lg: 16px
--ays-spacing-xl: 20px
--ays-spacing-2xl: 24px
--ays-spacing-3xl: 32px
--ays-spacing-4xl: 40px
```

**Guidelines:**
- **xs (4px):** Tight spacing between related elements
- **sm (8px):** Default gap between siblings
- **md (12px):** Moderate padding for small containers
- **lg (16px):** Standard padding for most components
- **xl (20px):** Generous padding for major containers
- **2xl (24px):** Section margins
- **3xl (32px):** Large gaps between major sections
- **4xl (40px):** Maximum spacing for emphasis

---

### Typography

```css
--ays-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif
```

**Font Size Scale:**
```css
--ays-font-size-xs: 12px
--ays-font-size-sm: 14px
--ays-font-size-base: 16px
--ays-font-size-lg: 18px
--ays-font-size-xl: 20px
--ays-font-size-2xl: 24px
```

**Font Weights:**
```css
--ays-font-weight-normal: 400
--ays-font-weight-medium: 500
--ays-font-weight-bold: 700
```

**Guidelines:**
- **xs (12px):** Help text, metadata, hints
- **sm (14px):** Form labels, button text, standard body
- **base (16px):** Default readable content
- **lg (18px):** Section headings
- **xl (20px):** Subheadings
- **2xl (24px):** Main headings

---

### Border Radius

```css
--ays-radius-sm: 4px
--ays-radius-md: 6px
--ays-radius-lg: 8px
```

**Guidelines:**
- **sm (4px):** Small interactive elements, inputs
- **md (6px):** Standard buttons, card corners
- **lg (8px):** Large containers, modals, popups

---

### Shadows

```css
--ays-shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.12)
--ays-shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.15)
--ays-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15)
--ays-shadow-lg: 0 6px 16px rgba(0, 0, 0, 0.2)
--ays-shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.25)
--ays-shadow-focus: 0 0 0 3px rgba(255, 0, 0, 0.1)
```

**Guidelines:**
- **xs:** Subtle elevation for inline elements
- **sm:** Default button shadows
- **md:** Hover states, dropdowns
- **lg:** Popup containers, elevated cards
- **xl:** Modals, top-level overlays
- **focus:** Accessible focus indicators (using primary color)

---

### Transitions

```css
--ays-transition-fast: 0.15s ease
--ays-transition-base: 0.2s ease
--ays-transition-slow: 0.3s ease
```

**Guidelines:**
- **fast (0.15s):** Subtle feedback (color changes)
- **base (0.2s):** Standard hover effects (default)
- **slow (0.3s):** Large animations (modals, complex transitions)

---

### Z-Index Scale

```css
--ays-z-dropdown: 1000
--ays-z-popup: 1001
--ays-z-modal: 2000
--ays-z-toast: 2001
```

**Guidelines:**
- Ensure predictable layering without magic numbers
- Toast notifications above modals (2001)
- Modals above popups (2000)
- Popups above dropdowns (1001)

---

## Utility Classes

### Flexbox Utilities
```css
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
```

### Spacing Utilities
```css
/* Margins */
.ays-m-0, .ays-mt-0, .ays-mb-0 { margin: 0 / margin-top: 0 / margin-bottom: 0; }
.ays-mt-sm, .ays-mt-md, .ays-mt-lg, .ays-mt-xl { margin-top: 8px/12px/16px/20px; }
.ays-mb-sm, .ays-mb-md, .ays-mb-lg, .ays-mb-xl { margin-bottom: 8px/12px/16px/20px; }

/* Padding */
.ays-p-0 { padding: 0; }
.ays-p-sm, .ays-p-md, .ays-p-lg, .ays-p-xl { padding: 8px/12px/16px/20px; }
.ays-px-md { padding-left: 12px; padding-right: 12px; }
.ays-py-md { padding-top: 12px; padding-bottom: 12px; }
```

### Text Utilities
```css
.ays-text-center { text-align: center; }
.ays-text-left { text-align: left; }
.ays-text-right { text-align: right; }
.ays-text-xs, .ays-text-sm, .ays-text-base, .ays-text-lg, .ays-text-xl { font-size: 12px/14px/16px/18px/20px; }
.ays-text-bold { font-weight: var(--ays-font-weight-bold); }
.ays-text-normal { font-weight: var(--ays-font-weight-normal); }
```

### Border & Shadow Utilities
```css
.ays-border-none { border: none; }
.ays-border-sm { border: 1px solid var(--ays-color-gray-300); }
.ays-rounded-sm { border-radius: var(--ays-radius-sm); }
.ays-rounded-md { border-radius: var(--ays-radius-md); }
.ays-rounded-lg { border-radius: var(--ays-radius-lg); }
.ays-shadow-sm { box-shadow: var(--ays-shadow-sm); }
.ays-shadow-md { box-shadow: var(--ays-shadow-md); }
.ays-shadow-lg { box-shadow: var(--ays-shadow-lg); }
```

### Transition Utilities
```css
.ays-transition { transition: all var(--ays-transition-base); }
.ays-transition-fast { transition: all var(--ays-transition-fast); }
.ays-transition-slow { transition: all var(--ays-transition-slow); }
```

---

## Component Patterns

### Interactive Elements Base

```css
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
```

**Usage:** Apply to any clickable element for consistent hover/active feedback.

---

### Focus States

```css
.ays-focusable:focus {
    outline: none;
    box-shadow: var(--ays-shadow-focus);
}
```

**Accessibility Note:** Always provide visible focus indicators. The system uses primary color at 10% opacity.

---

### Form Field States

#### Focus-Within (Label Highlighting)
```css
.ays-field-wrapper:focus-within label {
    color: var(--ays-color-primary);
    transition: color var(--ays-transition-fast);
}
```

**Pattern:** Wrap form fields with `.ays-field-wrapper` and include a label. The label highlights when the input has focus.

#### Error State
```css
.ays-field-error {
    border-color: var(--ays-color-danger) !important;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
}

.ays-field-wrapper.ays-error label {
    color: var(--ays-color-danger);
}
```

**Usage:** Add `.ays-field-error` class to invalid inputs.

#### Success State
```css
.ays-field-success {
    border-color: var(--ays-color-success) !important;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
}

.ays-field-wrapper.ays-success label {
    color: var(--ays-color-success);
}
```

**Usage:** Add `.ays-field-success` class to successfully validated inputs.

#### Disabled State
```css
.ays-field-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--ays-color-gray-100);
}
```

**Usage:** Add `.ays-field-disabled` class to disabled inputs.

#### Loading State (Pulse Animation)
```css
@keyframes ays-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.ays-field-loading {
    animation: ays-pulse 1.5s ease-in-out infinite;
    border-color: var(--ays-color-primary) !important;
}
```

**Usage:** Add `.ays-field-loading` class to inputs with pending operations.

---

## Button Pattern

### Standard Button Structure

```javascript
function createButton(text, baseColor, hoverColor) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.padding = 'var(--ays-spacing-md) var(--ays-spacing-xl)';
    button.style.backgroundColor = baseColor;
    button.style.color = 'var(--ays-color-white)';
    button.style.border = 'none';
    button.style.borderRadius = 'var(--ays-radius-sm)';
    button.style.cursor = 'pointer';
    button.style.fontSize = 'var(--ays-font-size-sm)';
    button.style.fontWeight = 'var(--ays-font-weight-bold)';
    button.style.fontFamily = 'var(--ays-font-family)';
    button.style.transition = 'all var(--ays-transition-base)';

    // Hover effect
    button.addEventListener('mouseenter', function() {
        button.style.backgroundColor = hoverColor;
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = 'var(--ays-shadow-md)';
    });

    button.addEventListener('mouseleave', function() {
        button.style.backgroundColor = baseColor;
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'var(--ays-shadow-sm)';
    });

    button.addEventListener('mousedown', function() {
        button.style.transform = 'scale(0.98)';
        button.style.boxShadow = 'var(--ays-shadow-xs)';
    });

    button.addEventListener('mouseup', function() {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = 'var(--ays-shadow-md)';
    });

    return button;
}
```

**Color Variations:**
- **Primary:** `--ays-color-primary` / `--ays-color-primary-dark`
- **Success:** `--ays-color-success` / `--ays-color-success-dark`
- **Danger:** `--ays-color-danger` / `--ays-color-danger-dark`
- **Secondary:** `--ays-color-secondary` / `--ays-color-secondary-dark`

---

## Input Pattern

### Standard Input Structure

```javascript
function createInput(labelText, inputType, inputId, placeholder = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'ays-field-wrapper';
    wrapper.style.marginBottom = 'var(--ays-spacing-md)';

    const label = document.createElement('label');
    label.innerText = labelText;
    label.htmlFor = inputId;
    label.style.display = 'block';
    label.style.marginBottom = '6px';
    label.style.fontWeight = 'var(--ays-font-weight-bold)';
    label.style.fontSize = 'var(--ays-font-size-sm)';
    label.style.color = 'var(--ays-color-gray-700)';

    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputId;
    input.style.width = '100%';
    input.style.padding = 'var(--ays-spacing-sm)';
    input.style.boxSizing = 'border-box';
    input.style.border = '1px solid var(--ays-color-gray-300)';
    input.style.borderRadius = 'var(--ays-radius-sm)';
    input.style.transition = 'all var(--ays-transition-base)';
    input.style.outline = 'none';
    input.style.fontSize = 'var(--ays-font-size-sm)';
    input.style.backgroundColor = 'var(--ays-color-white)';

    // Focus effects
    input.addEventListener('focus', function() {
        input.style.borderColor = 'var(--ays-color-primary)';
        input.style.boxShadow = 'var(--ays-shadow-focus)';
    });

    input.addEventListener('blur', function() {
        input.style.borderColor = 'var(--ays-color-gray-300)';
        input.style.boxShadow = 'none';
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
}
```

---

## Modal Pattern

### Standard Modal Structure

```javascript
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.backdropFilter = 'blur(8px)';
    modal.style.webkitBackdropFilter = 'blur(8px)';
    modal.style.zIndex = 'var(--ays-z-modal)';
    modal.style.display = 'none';
    modal.style.transition = 'opacity var(--ays-transition-slow)';

    const modalContent = document.createElement('div');
    modalContent.style.position = 'absolute';
    modalContent.style.top = '50%';
    modalContent.style.left = '50%';
    modalContent.style.transform = 'translate(-50%, -50%)';
    modalContent.style.backgroundColor = 'var(--ays-color-white)';
    modalContent.style.borderRadius = 'var(--ays-radius-lg)';
    modalContent.style.boxShadow = 'var(--ays-shadow-lg)';
    modalContent.style.padding = 'var(--ays-spacing-2xl)';
    modalContent.style.width = '400px';
    modalContent.style.maxWidth = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflow = 'auto';

    // Title
    const modalTitle = document.createElement('h3');
    modalTitle.innerText = title;
    modalTitle.style.marginTop = '0';
    modalTitle.style.marginBottom = 'var(--ays-spacing-lg)';
    modalTitle.style.fontSize = 'var(--ays-font-size-xl)';
    modalTitle.style.color = 'var(--ays-color-gray-800)';
    modalTitle.style.fontWeight = 'var(--ays-font-weight-bold)';

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(content);
    modal.appendChild(modalContent);

    return { modal, modalContent };
}
```

---

## Breaking Changes

### From Legacy Styles

**Current Status:** This design system was introduced as part of Phase 1 - Foundation & Visual Redesign. The backup file (AdvancedYouTubeSearch.user.js.backup) contains the same design system, indicating no legacy migration is required for the current version.

### Migration Notes

**For New Features:**
- Use CSS custom properties instead of hardcoded values
- Leverage utility classes where applicable
- Follow the component patterns defined above
- Maintain 4px-based spacing consistency
- Use semantic colors instead of arbitrary values

**For Legacy Code Updates:**
- Replace hardcoded colors with semantic variables
- Convert inline styles to use design system variables
- Apply `.ays-field-wrapper` to form elements for label highlighting
- Add focus states with `.ays-focusable` or custom focus handling
- Implement consistent hover effects with `.ays-interactive` or scale transforms

---

## Browser Compatibility

### Supported Browsers

The design system uses CSS custom properties (variables), which are supported in:

✅ **Full Support:**
- Chrome 49+ (2016)
- Firefox 31+ (2014)
- Safari 9.1+ (2016)
- Edge 15+ (2017)
- Opera 36+ (2016)

### Fallback Considerations

**No Fallback Required:**
- YouTube's minimum browser requirements (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) fully support CSS custom properties.
- Tampermonkey requires modern browsers, so variable support is guaranteed.

**Potential Issues:**
- `backdrop-filter` (glassmorphism effect): Not supported in Firefox < 103 (June 2022), Safari < 9.1
  - **Fallback:** Elements will still display but without blur effect
  - **Recommendation:** Accept degraded experience for older browsers (very small user base)

### CSS Features Used

| Feature | Support | Fallback |
|----------|----------|-----------|
| CSS Custom Properties (`var()`) | ✅ All modern browsers | None needed |
| CSS Transitions | ✅ All modern browsers | None needed |
| CSS Transforms (`scale`, `translate`) | ✅ All modern browsers | None needed |
| CSS Animations (`@keyframes`) | ✅ All modern browsers | None needed |
| `backdrop-filter` | ⚠️ Firefox 103+, Safari 9.1+ | Graceful degradation |
| `:focus-within` pseudo-class | ✅ Firefox 52+, Chrome 60+, Safari 10.1+ | None needed |

---

## Accessibility Considerations

### Color Contrast

**Current Issue:** The primary red color (`#FF0000`) has a contrast ratio of 3.99:1 on white backgrounds, which fails WCAG AA standards (requires 4.5:1 for normal text).

**Recommended Fix (from visual-consistency-test-report):**
```css
--ays-color-primary: #D32F2F;  /* 6.2:1 contrast ratio - passes WCAG AA */
--ays-color-primary-dark: #B71C1C;
--ays-color-primary-light: #E57373;
```

### Focus Indicators

All interactive elements have visible focus states:
- Primary color ring at 10% opacity (`--ays-shadow-focus`)
- 3px offset for clear visibility
- Preserves on keyboard navigation and mouse users

### Touch Targets

Buttons have minimum touch targets:
- Padding: `var(--ays-spacing-md) var(--ays-spacing-xl)` (12px 20px minimum)
- Sufficient size for mobile touch (44px recommended minimum)

### Screen Readers

Semantic HTML structure:
- Labels properly associated with inputs via `htmlFor` attribute
- Button elements used for actions (not `<div>` with click handlers)
- Headings (`h1`-`h6`) provide document structure

---

## Known Limitations

### Dark Mode

**Status:** Not yet implemented.

**Implementation Path:**
```css
:root {
    /* Light theme (current) */
    --ays-color-background: #ffffff;
    --ays-color-text: #333333;
}

[data-theme="dark"] {
    /* Dark theme variables */
    --ays-color-background: #1a1a1a;
    --ays-color-text: #e0e0e0;
}
```

**Recommendation from visual-consistency-test-report:**
- Implement `[data-theme="dark"]` variables
- Add system preference detection:
  ```javascript
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
  }
  ```

### Mobile Responsiveness

**Status:** Not yet implemented.

**Current Issue:** Fixed width popup (`450px`) will overflow on screens < 490px.

**Implementation Path:**
```css
.popup {
    width: 450px;
    max-width: calc(100vw - 40px); /* Current implementation */
}

@media (max-width: 600px) {
    .popup {
        width: 100%;
        max-width: 100%;
        left: 0;
        right: 0;
        top: 0;
        transform: none;
        border-radius: 0;
    }
}
```

**Recommendation from visual-consistency-test-report:**
- Add media queries for mobile (< 600px)
- Implement full-screen layout on mobile devices
- Adjust spacing and font sizes for smaller screens

---

## Best Practices

### 1. Use Semantic Variables

❌ **Avoid:**
```css
element.style.color = '#FF0000';
```

✅ **Use:**
```css
element.style.color = 'var(--ays-color-primary)';
```

### 2. Maintain Spacing Consistency

❌ **Avoid:**
```css
element.style.padding = '13px'; /* Breaks 4px grid */
```

✅ **Use:**
```css
element.style.padding = 'var(--ays-spacing-md)'; /* 12px - on grid */
element.style.padding = 'var(--ays-spacing-lg)'; /* 16px - on grid */
```

### 3. Apply Transitions Consistently

❌ **Avoid:**
```css
element.style.transition = '0.2s ease';
```

✅ **Use:**
```css
element.style.transition = 'all var(--ays-transition-base)';
```

### 4. Use Utility Classes

When possible, leverage existing utility classes instead of inline styles:

❌ **Avoid:**
```javascript
wrapper.style.display = 'flex';
wrapper.style.alignItems = 'center';
wrapper.style.justifyContent = 'space-between';
```

✅ **Use:**
```javascript
wrapper.classList.add('ays-flex', 'ays-items-center', 'ays-justify-between');
```

### 5. Always Provide Focus States

All interactive elements must have visible focus indicators:

✅ **Implementation:**
```javascript
element.addEventListener('focus', function() {
    element.style.boxShadow = 'var(--ays-shadow-focus)';
});

element.addEventListener('blur', function() {
    element.style.boxShadow = 'none';
});
```

---

## Quick Reference

### Common Variable Combinations

**Primary Button:**
```javascript
style.backgroundColor = 'var(--ays-color-primary)';
style.padding = 'var(--ays-spacing-md) var(--ays-spacing-xl)';
style.borderRadius = 'var(--ays-radius-sm)';
style.boxShadow = 'var(--ays-shadow-sm)';
```

**Input Field:**
```javascript
style.border = '1px solid var(--ays-color-gray-300)';
style.padding = 'var(--ays-spacing-sm)';
style.borderRadius = 'var(--ays-radius-sm)';
style.fontSize = 'var(--ays-font-size-sm)';
```

**Popup Container:**
```javascript
style.backgroundColor = 'var(--ays-color-white)';
style.borderRadius = 'var(--ays-radius-lg)';
style.boxShadow = 'var(--ays-shadow-lg)';
style.padding = 'var(--ays-spacing-xl)';
```

**Modal Backdrop:**
```javascript
style.backdropFilter = 'blur(8px)';
style.webkitBackdropFilter = 'blur(8px)';
style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
style.zIndex = 'var(--ays-z-modal)';
```

---

## Resources

### Related Documentation
- [[Phase-01-Foundation-Visual-Redesign]] - Implementation plan and test results
- [[visual-consistency-test-report]] - Visual consistency analysis and recommendations

### External References
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [system-ui font family - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#system-ui)
- [prefers-color-scheme - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

## Changelog

### 2026-01-26
- Initial design system documentation
- Documented all CSS custom properties
- Defined component patterns for buttons, inputs, and modals
- Added utility class reference
- Documented browser compatibility and accessibility considerations
- Noted known limitations (dark mode, mobile responsiveness)
