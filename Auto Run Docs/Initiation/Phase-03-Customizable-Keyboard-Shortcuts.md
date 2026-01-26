# Phase 03: Customizable Keyboard Shortcuts

This phase implements a comprehensive keyboard shortcuts system with a settings UI that allows users to rebind keys to any action. The system provides default shortcuts while allowing full customization, improving power-user efficiency and accessibility.

## Tasks

- [ ] Design keyboard shortcuts data structure and registry:
  - Create shortcuts registry mapping actions to key combinations
  - Define default shortcuts: Alt+1-9 for saved searches, Ctrl+K focus search, Escape close popup, Enter execute search
  - Structure each shortcut entry: actionId, displayName, defaultCombo, userCombo, isCustomizable
  - Implement modifier key support (Ctrl, Alt, Shift, Meta/Command)
  - Add conflict detection between shortcut assignments

- [ ] Implement keyboard event handling system:
  - Create global event listener for keyboard shortcuts
  - Add key binding detection that captures modifier + key combinations
  - Implement shortcut validation (prevent browser conflicts, detect invalid combos)
  - Add debounce to prevent rapid-fire execution
  - Support different keyboard layouts (handle KeyCode vs code vs key)

- [ ] Build keyboard shortcuts settings modal:
  - Create settings modal with list of all customizable actions
  - Implement key capture interface (press any key to bind)
  - Display current keybinding for each action
  - Add reset to default button per action and globally
  - Show visual feedback for active key capture mode
  - Include help text explaining modifier key usage

- [ ] Add shortcut conflict detection and resolution:
  - Validate new keybinding doesn't conflict with existing shortcuts
  - Check against reserved browser shortcuts (prevent breaking native functionality)
  - Show warning when conflict detected with existing custom shortcut
  - Provide option to auto-reassign conflicting shortcut
  - Highlight conflicts in settings modal UI

- [ ] Implement shortcut persistence and loading:
  - Add 'customShortcuts' object to localStorage structure
  - Save user-modified shortcuts separately from defaults
  - Load and merge custom shortcuts with defaults on initialization
  - Handle migration when default shortcuts change in future updates
  - Validate shortcut data integrity on load

- [ ] Add keyboard shortcuts help and documentation:
  - Create shortcuts help dialog accessible via button in popup
  - Display all active shortcuts in organized categories
  - Show default vs custom shortcuts with visual indicator
  - Add search/filter for shortcuts list
  - Include visual keyboard guide showing modifier keys

- [ ] Test keyboard shortcuts system:
  - Verify all default shortcuts work correctly
  - Test rebinding each shortcut to different combinations
  - Validate conflict detection and prevention
  - Check shortcut persistence across browser sessions
  - Ensure shortcuts don't interfere with YouTube's native shortcuts
  - Test with different keyboard modifiers (Ctrl vs Command on Mac)
