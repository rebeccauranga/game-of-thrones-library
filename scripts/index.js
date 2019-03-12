let allCharactersArray = [];

function urlForPage(pageNumber = 0) {
  return `http://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters/?page=${pageNumber}&pageSize=50`;
}

function accumulateCharacters(theActualData) {
  allCharactersArray = [...allCharactersArray, ...theActualData];
  storeCharacters(allCharactersArray);
}

const storageKey = "game-of-thrones";

function storeCharacters(arrayOfCharacters) {
  // convert the array to a JSON string
  const jsonCharacters = JSON.stringify(arrayOfCharacters);
  console.log(`saving ${arrayOfCharacters.length} characters`);
  // store that string in localStorage
  localStorage.setItem(storageKey, jsonCharacters);
}

function loadCharacters() {
  // get the JSON string from localStorage
  const jsonCharacters = localStorage.getItem(storageKey);
  // convert it back to an array
  const arrayOfCharacters = JSON.parse(jsonCharacters);
  console.log(` loaded ${arrayOfCharacters.length} characters`);
  // return it
  return arrayOfCharacters;
}

function retrievePageOfCharacters(pageNumber){
    fetch(urlForPage(pageNumber))
      .then(function(response) {
        return response.json();
      })
      .then(accumulateCharacters)
      .then(function() {
        console.log(`Done with page ${pageNumber}`);
      });
}

for (let pageNumber = 0; pageNumber < 43; pageNumber++) {
    let delay  = pageNumber * 500;
    setTimeout(function () {
        retrievePageOfCharacters(pageNumber);
    }, delay);
}
