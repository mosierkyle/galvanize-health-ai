const logoutForm = document.querySelector('#logout-form');
const logoutDiv = document.querySelector('#logout-div');

const submitLogoutForm = () => {
  logoutForm.submit();
};

const addEvents = () => {
  logoutDiv.addEventListener('click', () => {
    submitLogoutForm();
  });
};

addEvents();
