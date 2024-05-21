// ==UserScript==
// @name        Gemini Dark Mode Sync
// @namespace   gemini-dark-mode-sync
// @match       https://gemini.google.com/*
// @grant       none
// @version     5.5
// @author      Jeff Byers <jeff@jeffbyers.com.
// @description Synchronizes Google Gemini's dark mode with your system's preference.
// ==/UserScript==

(function () {
  'use strict';

  const getPreferredScheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const toggleGeminiDarkMode = (enable) => {
    // Click the settings cog to reveal the menu
    const settingsButton = document.querySelector(
      'button[aria-label="Settings"]'
    );
    if (settingsButton) {
      settingsButton.click();
    }

    const button = document.querySelector(
      '[data-test-id="bard-dark-theme-toggle"] mat-slide-toggle'
    );
    if (!button) {
      setTimeout(() => toggleGeminiDarkMode(enable), 2000); // Retry after 2 seconds if button isn't loaded
      return;
    }

    const isChecked = button.classList.contains('mat-mdc-slide-toggle-checked');
    if ((enable && !isChecked) || (!enable && isChecked)) {
      button.click();
      settingsButton.click();
    }
  };

  const init = () => {
    // Get current system preference and pass it to the toggle function
    const preferredScheme = getPreferredScheme();
    toggleGeminiDarkMode(preferredScheme === 'dark');
  };

  const checkModeChange = () => {
    // Observe for changes to system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => toggleGeminiDarkMode(e.matches));
  };

  // Initial setup and continuous check
  init();
  checkModeChange(); // Start observing for changes immediately
})();
