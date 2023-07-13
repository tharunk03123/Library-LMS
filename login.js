function validateForm() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  if (username == "") {
    alert("Please enter a username.");
    return false;
  }
  if (password == "") {
    alert("Please enter a password.");
    return false;
  }
  return true;
}
document.getElementById("login").addEventListener("click", function() {
  if (validateForm()) {
    // Submit the form data to the server.
  }
});