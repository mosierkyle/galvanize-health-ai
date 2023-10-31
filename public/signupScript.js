const backBtn = document.querySelector('#back-btn');
const signUp = document.querySelector('#sign-up');
const signUpEmail = document.querySelector('#sign-up-email');
const continueWithEmail = document.querySelector('#sign-up-white');

const addEvents = () => {
  backBtn.addEventListener('click', () => {
    signUpEmail.style.display = 'none';
    backBtn.style.display = 'none';
    signUp.style.display = 'flex';
  });

  continueWithEmail.addEventListener('click', () => {
    signUp.style.display = 'none';
    signUpEmail.style.display = 'flex';
    backBtn.style.display = 'flex';
  });
};

addEvents();
