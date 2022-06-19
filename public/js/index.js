import '@babel/polyfill';
// Used to fill in some of the functionality needed to make the code work in older browsers that don't support some of the features used, Example ES6 specific features. - Happens at the bundling process stage.

import { login } from './login';
import { logout } from './login';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';

// DOM elements
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const saveSettingsBtn = document.querySelector('.btn--save-settings');

//VALUES:

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings(name, email);
  });
}
if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('success', 'Settings saved successfully');
  });
}
