function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=capital,name,population,flags,languages`
  ).then(response => response.json());
}

export { fetchCountries };
