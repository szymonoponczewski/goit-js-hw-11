import Notiflix from "notiflix";

const countryEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");
const API_URL = "https://restcountries.com/v3.1/name/";
const API_FILTER = "?fields=name,capital,population,flags,languages";

const clearFn = () => {
  countryEl.innerHTML = "";
  countryInfoEl.innerHTML = "";
};

const tooManyResults = () => {
  Notiflix.Notify.info(
    "Too many matches found. Please enter a more specific name."
  );
};

const fewResults = (countries) => {
  clearFn();

  const fewCountries = countries
    .map((country) => {
      return `<li><img src="${country.flags.png}" alt="${country.flags.alt}" width="25" height="auto"><p> ${country.name.common}</p></li>`;
    })
    .join(" ");

  countryEl.innerHTML = fewCountries;
};

const oneResult = (countries) => {
  clearFn();

  const singleCountry = countries
    .map((country) => {
      return `
       <h2 style="font-size: 35px"><img src="${country.flags.png}" alt="${
        country.flags.alt
      } width="25" height="25"> ${country.name.common}</h2>
        <p><span style="font-weight: bold">Capital:</span> ${
          country.capital
        }</p>
        <p><span style="font-weight: bold">Population:</span> ${
          country.population
        }</p>
        <p><span style="font-weight: bold">Languages:</span> ${Object.values(
          country.languages
        ).join(", ")}</p>`;
    })
    .join(" ");

  countryInfoEl.innerHTML = singleCountry;
};

export const fetchCountries = (name) => {
  name = name.trim(); //remove white spaces
  fetch(API_URL + name + API_FILTER)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      return res.json();
    })
    .then((countries) => {
      if (countries.length > 10) {
        tooManyResults();
      } else if (countries.length >= 2 && countries.length <= 10) {
        fewResults(countries);
      } else if ((countries.length = 1)) {
        oneResult(countries);
      }
    })
    .catch(() => {
      Notiflix.Notify.failure("Oops, there is no country with that name");
      clearFn();
    });
};
