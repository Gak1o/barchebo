// Add this to your existing main.js file or create a new script file

document.addEventListener('DOMContentLoaded', function() {
    const updateProfileForm = document.getElementById('updateProfileForm');
    const usernameInput = document.getElementById('usernameInput');
    const userGreeting = document.getElementById('userGreeting');
  
    updateProfileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const newUsername = usernameInput.value.trim();
      
      if (newUsername) {
        // Update the greeting in the dashboard
        userGreeting.textContent = newUsername;
        
        // Here you would typically send an AJAX request to update the username on the server
        // For this example, we'll just show an alert
        alert('Username updated successfully!');
        
        // Clear the input field
        usernameInput.value = '';
      } else {
        alert('Please enter a valid username.');
      }
    });
  });