const logoutForm = document.querySelector('#logout-form');
const logoutDiv = document.querySelector('#logout-div');

const addEvents = () => {
  logoutDiv.addEventListener('click', () => {
    logoutForm.submit();
  });
};

addEvents();
