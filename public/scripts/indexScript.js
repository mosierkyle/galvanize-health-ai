const hamburger = document.querySelector('#mobile');
const linkList = document.querySelector('#links-list');
const x = document.querySelector('#exit');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const login = document.querySelector('#login');

const events = () => {
  for (let i = 0; i < navLinks.length; i++) {
    let li = navLinks[i];
    li.addEventListener('click', () => {
      navLinks.forEach((thing) => {
        thing.classList.remove('active');
      });
      li.classList.add('active');
      linkList.style.top = '-1000px';
    });
  }

  hamburger.addEventListener('click', () => {
    linkList.style.top = '0';
    // login.style.backgroundColor = 'black';
    // login.style.padding = '0.5rem 0';
    // login.style.listStyle = '0.5rem 0';
  });

  x.addEventListener('click', () => {
    linkList.style.top = '-1000px';
  });
};

events();
