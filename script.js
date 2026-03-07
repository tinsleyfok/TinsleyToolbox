// JavaScript for folder interactions

document.addEventListener('DOMContentLoaded', function() {
  const folders = document.querySelectorAll('.folder-item');
  
  folders.forEach(folder => {
    // Prevent single click navigation if it's a link
    if (folder.tagName === 'A') {
      folder.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
    
    // Handle double-click to open folder
    folder.addEventListener('dblclick', function(e) {
      const href = folder.getAttribute('data-href') || folder.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    });
  });
});
