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
const userPasswordForm = document.querySelector('.form-user-password');
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
    updateSettings({ name, email }, 'data');
  });
}
if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('success', 'Settings saved successfully');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn-save-password').textContent = 'updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn-save-password').textContent = 'save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    //As a security precaution we clear all the password fields after the update is complete. Remember: This is done after the updateSettings function is executed, given that it is an async operation, we must await it so that the clearing of the password fields is done at the right time.
  });
}
