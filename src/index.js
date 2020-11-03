import css from "./scss/main.scss";
import hbs_countryList from "./templates/country-list.hbs";
import hbs_countryInfo from "./templates/country-info.hbs";
import {debounce} from 'lodash';
// import * as pnotify from '@pnotify/core';
// import '@pnotify/core/dist/BrightTheme.css';



const dom = {
  dataIn: document.querySelector('#data-in'),
  dataOut: document.querySelector('#data-out')
}

dom.dataIn.addEventListener('submit', (e) => {
  e.preventDefault();
})
dom.dataIn.addEventListener(
  'input', 
   debounce((e)=> { 
    fetch(`https://restcountries.eu/rest/v2/name/${e.target.value}`)
      .then((data) => data.json())
      .then((json) => {
        if (json.length === 1) {
          let [ el1 ] = json;
          dom.dataOut.innerHTML = hbs_countryInfo(el1);
        } else if(json.length >1 && json.length<=10) {
          dom.dataOut.innerHTML = hbs_countryList(json);
        } 
        return json;
      })
   },500)
);