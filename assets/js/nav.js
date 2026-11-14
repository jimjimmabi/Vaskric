// =========================================================
// Vaskric Archive - Navigation Helper
// Highlights the current page in the site-nav
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('.site-nav a');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    // Check if the link's href matches the current URL
    const linkPath = new URL(link.href).pathname;
    
    if (currentPath === linkPath || 
       (currentPath.endsWith('/') && linkPath === currentPath + 'index.html') ||
       (linkPath.endsWith('/index.html') && linkPath.replace('index.html', '') === currentPath)) {
      
      // Add an active class if you want to style it differently
      link.style.color = 'var(--oxblood)';
      link.style.borderBottom = '1px solid var(--oxblood)';
    }
  });
});