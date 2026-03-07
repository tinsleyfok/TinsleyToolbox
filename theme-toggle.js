// Dark/Light mode toggle for phone-container
document.addEventListener('DOMContentLoaded', function() {
  const lightOption = document.getElementById('lightOption');
  const darkOption = document.getElementById('darkOption');
  const phoneContainer = document.getElementById('phoneContainer');
  
  // Check for saved theme preference or default to light
  const currentTheme = localStorage.getItem('phoneTheme') || 'light';
  
  // Apply initial theme
  function setTheme(theme) {
    phoneContainer.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      phoneContainer.style.background = '#000';
      darkOption.classList.add('active');
      lightOption.classList.remove('active');
      localStorage.setItem('phoneTheme', 'dark');
    } else {
      phoneContainer.style.background = '#fff';
      lightOption.classList.add('active');
      darkOption.classList.remove('active');
      localStorage.setItem('phoneTheme', 'light');
    }
  }
  
  // Set initial theme
  setTheme(currentTheme);
  
  // Light option click
  lightOption.addEventListener('click', function() {
    setTheme('light');
  });
  
  // Dark option click
  darkOption.addEventListener('click', function() {
    setTheme('dark');
  });
});
