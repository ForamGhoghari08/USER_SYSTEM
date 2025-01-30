
document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

 
  const passwordInput = document.querySelector('input[type="password"]');
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const password = this.value;
      let strength = 0;

      if (password.match(/[a-z]/)) strength++;
      if (password.match(/[A-Z]/)) strength++;
      if (password.match(/[0-9]/)) strength++;
      if (password.match(/[^a-zA-Z0-9]/)) strength++;

      const strengthIndicator = document.getElementById("password-strength");
      if (strengthIndicator) {
        strengthIndicator.className = "progress-bar";
        if (strength < 2) strengthIndicator.classList.add("bg-danger");
        else if (strength < 3) strengthIndicator.classList.add("bg-warning");
        else strengthIndicator.classList.add("bg-success");
        strengthIndicator.style.width = strength * 25 + "%";
      }
    });
  }
});
