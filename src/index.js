import css from "./scss/main.scss";
import hbs_countryList from "./templates/country-list.hbs";
import hbs_countryInfo from "./templates/country-info.hbs";
import {debounce} from "lodash";
import fetchCountries from "./js/fetchCountries.js";

import {info} from "../node_modules/@pnotify/core/dist/PNotify.js";
import "../node_modules/@pnotify/core/dist/PNotify.css";
import '@pnotify/core/dist/BrightTheme.css';


const dom = {
  dataIn: document.querySelector('#data-in'),
  dataOut: document.querySelector('#data-out'),
  resetData: document.querySelector('#reset-data'),
  spinner: document.querySelector('#spinner'),
}
const API = 'https://restcountries.eu/rest/v2/name/';

window.onload = function() {
  if (window.localStorage.getItem('country')) {
    dom.dataOut.innerHTML = hbs_countryInfo(JSON.parse(window.localStorage.getItem('country')));
  }
}

dom.dataIn.addEventListener('submit', (e) => {
  e.preventDefault();
})
const debounceExpression = debounce(function(e){ 
  fetchCountries(`${API}${e.target.value}`)
    .then((data) => data.json())
    .then((json) => {
      if (json.length > 10) {
        info("Уточніть пошук. Велика кількість співпадінь...");
        dom.spinner.classList.add('d-none');
      } else if (json.length === 1) {
        let [ el1 ] = json;
        window.localStorage.setItem('country', JSON.stringify(el1));
        dom.dataOut.innerHTML = hbs_countryInfo(el1);
        dom.spinner.classList.add('d-none');
      } else if(json.length >1 && json.length<=10) {
        dom.dataOut.insertAdjacentHTML('afterbegin',hbs_countryList(json));
        dom.spinner.classList.add('d-none');
        const userChoice = function(event) {
          document.querySelector('ul[country-list]').removeEventListener('click', userChoice);
          fetchCountries(`${API}${event.target.textContent}`)
            .then((data) => data.json())
            .then((json) => {
              let [ el1 ] = json;
              window.localStorage.setItem('country', JSON.stringify(el1));
              dom.dataOut.innerHTML = hbs_countryInfo(el1);
            })
        };
        document.querySelector('ul[country-list]').addEventListener('click', userChoice);
      } 
      return json;
    })
},500);


dom.dataIn.addEventListener(
  'input', function(e) {
    if(e.target.value != '') {
      dom.spinner.classList.remove('d-none');
      debounceExpression(e);
    } else {
      dom.spinner.classList.add('d-none');
    }
  }
);
dom.resetData.addEventListener('click', function(e){
  e.preventDefault();
  dom.dataIn.value = '';
  dom.dataOut.innerHTML = '';
  window.localStorage.clear();
});