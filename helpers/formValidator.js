// Validate if inputed email is valid
export function isValidEmail(userEmail) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(userEmail);
}

// Validate if inputed name is valid
export function isValidName(userName) {
  const nameRegex = /^[A-Za-z]{2,}(?: [A-Za-z]{2,})?$/;
  return nameRegex.test(userName);
}

// Validate if inputed password is valid
export function isValidPassword(userPassword) {
  const passwordRegex = /^[a-zA-Z0-9]{4,}$/;
  return passwordRegex.test(userPassword);
}

export function validateInputField(
  inputEl,
  isValidFnc,
  errorBoxEl,
  errorTextEl,
  errorMsg
) {
  const inputValue = inputEl.value.trim();

  if (inputValue === '') {
    errorBoxEl.classList.remove('hidden');
    errorTextEl.textContent = errorMsg;
    return false;
  } else if (!isValidFnc(inputValue)) {
    errorBoxEl.classList.remove('hidden');
    errorTextEl.textContent = errorMsg;
    return false;
  } else {
    errorBoxEl.classList.add('hidden');
    errorTextEl.textContent = '';
    return true;
  }
}
