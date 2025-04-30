console.log('darkmode.js loaded');
// Dark mode toggle logic
(function() {
  var darkModeKey = 'darkMode';
  function setDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    localStorage.setItem(darkModeKey, on ? '1' : '0');
    var iconSpan = document.getElementById('dark-mode-icon');
    if (iconSpan) {
      iconSpan.innerHTML = on ? `
        <svg width="1.125em" height="1.125em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill="white"/>
          <g stroke="white" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
          </g>
        </svg>
      ` : `
        <svg width="1.125em" height="1.125em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="black"/>
        </svg>
      `;
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    var darkModeToggle = document.getElementById('dark-mode-toggle');
    // Always forcibly set the emoji and clear any text/whitespace
    if (darkModeToggle) {
      setDarkMode(document.body.classList.contains('dark-mode'));
      darkModeToggle.onclick = function() {
        setDarkMode(!document.body.classList.contains('dark-mode'));
      };
    }
    if (localStorage.getItem(darkModeKey) === '1' ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
  });
})();
