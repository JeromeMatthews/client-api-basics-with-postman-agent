import '@babel/polyfill';
// Used to fill in some of the functionality needed to make the code work in older browsers that don't support some of the features used, Example ES6 specific features. - Happens at the bundling process stage.

import { login } from './login';
import { logout } from './login';

// DOM elements
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
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
