import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetch-countries.js';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('keydown', event => {
  debounceHandlerFunc(event);
});

let debounceHandlerFunc = debounce(event => {
  const result = fetchCountries(event.target.value.trim());
  result
    .then(response => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (response?.status === 404) {
        throw response;
      } else if (response.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (response.length === 1) {
        const block = `
                <div class="title"><img src="${response[0].flags.svg}"><span>${
          response[0].name.official
        }</span></div>
                <div class="capital"><span class="column-title">Capital: </span><span>${Object.values(
                  response[0].capital
                ).join(', ')}</span></div>
                <div class="population"><span class="column-title">Population: </span>
                <span>${response[0].population}</span></div>
                <div class="languages"><span class="column-title">Languages: </span>
                <span>${Object.values(response[0].languages).join(
                  ', '
                )} </span></div>
                `;
        countryInfo.insertAdjacentHTML('afterbegin', block);
      } else {
        response.forEach((item, index) => {
          const block = `<li><img src="${item.flags.svg}"><span>${item.name.official}</span></li>`;
          countryList.insertAdjacentHTML('afterbegin', block);
        });
      }
    })
    .catch(err =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}, DEBOUNCE_DELAY);
