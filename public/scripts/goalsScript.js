const goals1 = document.querySelector('#goals1');
const goals2 = document.querySelector('goals2');
const goals3 = document.querySelector('goals3');
const continueBtn = document.querySelector('#continue');
const backBtn = document.querySelector('#back');
const submitBtn = document.querySelector('#submit');

let currentQ = 1;

const changeQ = (direction) => {
  let oldQuestion = document.querySelector(`#goals${currentQ}`);
  if (direction === 1) {
    currentQ += 1;
  } else if (direction === 0) {
    currentQ -= 1;
  }
  currentQ === 1
    ? (backBtn.style.display = 'none')
    : (backBtn.style.display = 'inline');

  if (currentQ === 4) {
    submitBtn.style.display = 'inline';
    continueBtn.style.display = 'none';
  } else {
    submitBtn.style.display = 'none';
  }
  console.log(currentQ);
  let newQuestion = document.querySelector(`#goals${currentQ}`);
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
