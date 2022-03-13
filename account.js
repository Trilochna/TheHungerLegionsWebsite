'use strict';

const welcomeEl = document.querySelector('.welcome');
const btnLogout = document.querySelector('.btn-logout');
const btnEl = document.querySelector('.search-date');
const dateFromEl = document.querySelector('.date-from');
const dateToEl = document.querySelector('.date-to');
const petTypeEl = document.querySelector('.select-pettype');
const sittersParentEl = document.querySelector('.sitters-section');

// prettier-ignore
const monthNames = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sept', 10: 'Oct', 11: 'Nov', 12: 'Dec',
};

const accState = {
  sitterAccs: [
    {
      fullName: 'Aniket Kumar',
      petType: 'cat',
      img: 'https://images.unsplash.com/photo-1514278033938-06f80809a42c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      workingDays: [],
      about: 'I love pets',
    },
    {
      fullName: 'Ali Mirza',
      petType: 'dog',
      img: 'https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80',
      workingDays: [],
      about: 'I love pets even more',
    },
    {
      fullName: 'Charvi Verma',
      petType: 'hedgehog',
      img: 'https://images.unsplash.com/photo-1517677129300-07b130802f46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
      workingDays: [],
      about: 'I like pets.',
    },
    {
      fullName: 'Manan Jha',
      petType: 'rabbit',
      img: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      workingDays: [],
      about: 'I love pets more than my family',
    },
    {
      fullName: 'Siddharth Gautam',
      petType: 'bird',
      img: 'https://images.unsplash.com/photo-1567515004624-219c11d31f2e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80',
      workingDays: [],
      about: 'I love pets more than my Continentel GT',
    },
  ],
  currUser: null,
};

const updateWelcomeMsg = function () {
  welcomeEl.textContent = `Welcome ${
    accState.currUser?.firstName ?? 'Imposter'
  }`;
};

const updateAccState = function () {
  accState.currUser = JSON.parse(localStorage.getItem('currUser'));
  updateWelcomeMsg();
};
updateAccState();

const genRandomNumsArray = function () {
  const n = Math.trunc(Math.random() * 30 + 1);
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.trunc(Math.random() * 30 + 1));
  }
  const uniqueArr = [...new Set(arr)];
  return uniqueArr.sort((a, b) => a - b);
};

accState.sitterAccs.forEach(
  (user) => (user.workingDays = genRandomNumsArray())
);

////////////////////////// LOGOUT /////////////////////////////
btnLogout.addEventListener('click', function () {
  accState.currUser = null;
  localStorage.removeItem('currUser');

  window.location.replace('/pets.html');
});

////////////////////////// SEARCH /////////////////////////////
const inputValidation = function (dateFrom, dateTo, petType) {
  return dateFrom && dateTo && petType;
};

const reduceDate = function (date) {
  return date.split('/').reduce((acc, d, i) => {
    let temp = 0;
    if (i === 0) temp += +d * 100;
    if (i === 1) temp += +d;
    return acc + temp;
  }, 0);
};

const dateValidation = function (dateFrom, dateTo) {
  const from = reduceDate(dateFrom);
  const to = reduceDate(dateTo);
  return from < to;
};

const getSpecificWorkingDays = function (startDate, endDate, sitterObj) {
  return sitterObj.workingDays.filter(
    (date) => date >= startDate && date <= endDate
  );
};

const datesInShort = function (list) {
  const l = list.length;
  let start = 0,
    end = 0;
  const arr = [];
  let temp;
  while (end < l) {
    temp = list[end + 1] - list[end];
    if (end === l - 1 || temp !== 1) {
      if (start === end) {
        arr.push(list[end]);
      } else if (end - start === 1) {
        arr.push(list[start], list[end]);
      } else {
        arr.push(`${list[start]}-${list[end]}`);
      }
      start = end + 1;
    }
    end++;
  }
  return arr.join(', ');
};

const generateDaysMarkup = function (map) {
  return Array.from(map)
    .map(([key, val]) => {
      return `
      <div class="available-days">
        <span class="month-name">${key} :</span>
        <span>[${datesInShort(val)}]</span>
      </div>
    `;
    })
    .join('');
};

const generateCards = function (petType) {
  return accState.sitterAccs
    .filter((obj) => obj.specificWorkingDays && petType === obj.petType)
    .map((sitter) => {
      return `
      <div class="col-lg-4 col-sm-6">
        <div class="card">
          <img class="card-img-top" src="${sitter.img}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${sitter.fullName}</h5>
            <p class="card-text text-muted">${sitter.about}</p>
            <h6 class="card-subtitle mb-2">Available on:</h6>
            ${generateDaysMarkup(sitter.specificWorkingDays)}
            <a href="#" class="btn btn-primary contact-sitter">Contact</a>
          </div>
        </div>
      </div>
    `;
    })
    .join('');
};

const generateMarkup = function (petType) {
  return `
    <div class="row">
      ${generateCards(petType)}
    </div>
  `;
};

btnEl.addEventListener('click', function () {
  const dateFrom = dateFromEl.value.trim();
  const dateTo = dateToEl.value.trim();
  const petType = petTypeEl.value;

  if (!inputValidation(dateFrom, dateTo, petType))
    return alert('Please fill all the inputs');

  if (!dateValidation(dateFrom, dateTo))
    return alert("The 'To-date' should come after the 'from-date'");

  console.log(dateFrom, dateTo);

  const datesArr = [
    Number.parseInt(dateFrom.slice(3, 6)),
    Number.parseInt(dateTo.slice(3, 6)),
  ];
  let monthsArr = [
    Number.parseInt(dateFrom.slice(0, 2)),
    Number.parseInt(dateTo.slice(0, 2)),
  ];
  monthsArr = Array.from(
    { length: monthsArr[1] - monthsArr[0] + 1 },
    (_, i) => i + monthsArr[0]
  );
  console.log(datesArr, monthsArr);

  accState.sitterAccs.forEach((sitter) => {
    const map = new Map();
    monthsArr.forEach((mon, i, monArr) => {
      const startDate = i === 0 ? datesArr[0] : 1;
      const endDate = i === monArr.length - 1 ? datesArr[1] : 31;
      const specificDatesArr = getSpecificWorkingDays(
        startDate,
        endDate,
        sitter
      );
      if (specificDatesArr.length) map.set(monthNames[mon], specificDatesArr);
    });
    if (map.size) sitter.specificWorkingDays = map;
  });

  console.log(accState.sitterAccs);

  const markup = generateMarkup(petType);
  sittersParentEl.innerHTML = '';
  sittersParentEl.insertAdjacentHTML('afterbegin', markup);
});
