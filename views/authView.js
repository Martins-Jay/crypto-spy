export const loginForm = document.getElementById("login-form");
export const signupForm = document.getElementById("signup-form");
export const toggleSignupBtn = document.getElementById("toggle-signup");
export const toggleLoginBtn = document.getElementById("toggle-login");
export const textCenter = document.getElementById("dynamic-center-text");
export const loaderEl = document.getElementById("loader");
export const authSectionEl = document.getElementById("auth-section");
export const dashboardSectionEl = document.getElementById("dashboard-section");
export const usernameEl = document.getElementById("user-name");
export const userEmailEl = document.getElementById("user-email");
export const userID = document.getElementById("user-id");

export const logoutBtnEl = document.getElementById("logout-btn");

// All password input field
export const passwordInputFields = document.querySelectorAll(".password-input");
export const toggleEyeBtns = document.querySelectorAll(".toggle-password-btn");

// For login Validation (incl. error notifier)
export function loginFieldElements(fieldName) {
  return {
    input: loginForm.querySelector(`[data-name = ${fieldName}]`),
    errorContainer: loginForm.querySelector(`[data-error-box = ${fieldName}]`),
    errorText: loginForm.querySelector(`[data-error-text = ${fieldName}]`),
  };
}

export function clearLoginErrors() {
  const loginErrElements = [
    "login-email-error-container",
    "login-password-error-container",
  ];

  loginErrElements.forEach((elementID) => {
    const hiddenEl = document.getElementById(elementID);
    if (hiddenEl) hiddenEl.classList.add('hidden')
  });
} 

export function clearSignupErrors() {
  const loginErrElements = [
    "signup-name-error-container",
    "signup-email-error-container",
    "signup-password-error-container",
    "signup-confirm-error-container",
  ];

  loginErrElements.forEach((elementID) => {
    const hiddenEl = document.getElementById(elementID);
    if (hiddenEl) hiddenEl.classList.add('hidden')
  });
}

// For signup validation (incl. error notifier)
export function signupFieldElements(fieldname) {
  return {
    input: signupForm.querySelector(`[data-name = ${fieldname}]`),
    errorContainer: signupForm.querySelector(`[data-error-box = ${fieldname}]`),
    errorText: signupForm.querySelector(`[data-error-text = ${fieldname}]`),
  };
}

// Get login form data
export function getLoginFormData() {
  return {
    loginEmail: document
      .getElementById("login-email-input")
      .value.trim()
      .toLowerCase(),
    loginPassword: document
      .getElementById("login-password-input")
      .value.trim()
      .toLowerCase(),
  };
}

// Get sign-up form data
export function getSignupFormData() {
  return {
    signupName: document
      .getElementById("signup-name-input")
      .value.trim()
      .toLowerCase(),
    signupEmail: document
      .getElementById("signup-email-input")
      .value.trim()
      .toLowerCase(),
    signupPassword: document
      .getElementById("signup-password-input")
      .value.trim()
      .toLowerCase(),
  };
}
