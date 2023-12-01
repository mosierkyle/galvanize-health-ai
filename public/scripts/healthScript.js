const health1 = document.querySelector('#health1');
const health2 = document.querySelector('health2');
const health3 = document.querySelector('health3');
const continueBtn = document.querySelector('#continue');
const backBtn = document.querySelector('#back');
const submitBtn = document.querySelector('#submit');

let currentQ = 1;

const changeQ = (direction) => {
  let oldQuestion = document.querySelector(`#health${currentQ}`);
  if (direction === 1) {
    currentQ += 1;
  } else if (direction === 0) {
    currentQ -= 1;
  }
  currentQ === 1
    ? (backBtn.style.display = 'none')
    : (backBtn.style.display = 'inline');

  if (currentQ !== 10) {
    submitBtn.style.display = 'none';
    continueBtn.style.display = 'inline';
  } else {
    submitBtn.style.display = 'inline';
    continueBtn.style.display = 'none';
  }

  let newQuestion = document.querySelector(`#health${currentQ}`);
  oldQuestion.style.display = 'none';
  newQuestion.style.display = 'flex';
};

const addEvents = () => {
  continueBtn.addEventListener('click', () => {
    changeQ(1);
  });

  backBtn.addEventListener('click', () => {
    changeQ(0);
  });
};

addEvents();
