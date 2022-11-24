// imports
import { useContext, createContext, useState, useEffect } from "react";

// createcontext variable
const CompData = createContext();

// Main component, exports to index.js
export default function App() {
  // useState declaration
  const [pokemonList, setPokemonList] = useState(null);
  const [pokemonOffset, setPokemonOffset] = useState(0);

  console.log(pokemonOffset);

  // Async function with fetch api call
  async function apiCall(callback, address) {
    const fetchApi = await fetch(address);
    const data = await fetchApi.json();

    callback(data);
  }

  // stores data for 20 different pokemons in an array within a state
  function pokemons(data) {
    setPokemonList((prevList) => (prevList ? [...prevList, data] : [data]));
  }

  // Creates the offset for the api call link
  function apiOffset(param) {
    if (param === "+") setPokemonOffset((prevOffset) => (prevOffset === 1134 ? 0 : prevOffset + 10));
    if (param === "-") setPokemonOffset((prevOffset) => (prevOffset === 0 ? 1134 : prevOffset - 10));
  }

  // useEffect together with array dependency prevents infinite loop with fetch (memory leak).
  useEffect(() => {
    // calls apiCall function and gets delivered the data trough a callback function
    // createPokemonList is then called with the data
    apiCall(createPokemonList, `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pokemonOffset}`);

    // takes in pokemon list and re-calls with a different link recived from previous call
    function createPokemonList(data) {
      data.results.forEach((element) => {
        apiCall(pokemons, element.url);
      });
    }
    // useEffect will run together with the rest of the file whenever pokemonOffset has changed value
  }, [pokemonOffset]);

  return (
    <div>
      {/* buttons to change offset */}
      <button onClick={() => apiOffset("-")}>Previous page</button>
      <button onClick={() => apiOffset("+")}>Next page</button>

      {/* 
      loops trough pokemon array and creates new jsx elements every loop 
      ternary is also in place to make sure it only runs when we have received the data from the api   
      */}
      {pokemonList && pokemonList.length >= 20
        ? pokemonList.map((pokemon) => {
            return (
              // CompData.Provider is for useContext, allows us to send values to
              // deeply nested components without having to use props in each component
              <CompData.Provider value={[pokemon]}>
                <Comp2 />
              </CompData.Provider>
            );
          })
        : ""}
    </div>
  );
}

//  Component 2
function Comp2() {
  return (
    <>
      <Comp3 />
    </>
  );
}

// Component 3
function Comp3() {
  return (
    <>
      <Comp4 />
    </>
  );
}

// Component 4
// deeply nested to app trough component 2 and 3
function Comp4() {
  // takes in the data sent with usecontext and stores it in const pokemon
  const pokemonArray = useContext(CompData);
  const pokemon = pokemonArray[0];

  return (
    <section>
      <div className="pokemons">
        <h1>{pokemon.name.toUpperCase()}</h1>
        <img src={pokemon.sprites.front_default} alt="" />
        {/*
          map loop function creates new html elements for each pokemon property and puts them in a container
          */}
        {pokemon.stats.map(function (element, index) {
          return (
            <div key={index} className="pokemons__stats">
              <h3 className="pokemons__stats__name">{element.stat.name}: </h3>
              <p className="pokemons__stats__value">{element.base_stat}</p>
            </div>
          );
        })}
      </div>

      {/* more info button for the future */}
      <button className="pokemons__moreInfo">
        Click for more info
        <br />v
      </button>
    </section>
  );
}
