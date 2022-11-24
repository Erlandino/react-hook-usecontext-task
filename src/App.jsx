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

  // Api call
  async function apiCall(callback, address) {
    const fetchApi = await fetch(address);
    const data = await fetchApi.json();

    callback(data);
  }

  function pokemons(data) {
    setPokemonList((prevList) => (prevList ? [...prevList, data] : [data]));
  }
  console.log(pokemonList);

  function pokemonLinksCreator(param) {
    if (param === "+") setPokemonOffset((prevOffset) => (prevOffset === 1134 ? 0 : prevOffset + 10));
    if (param === "-") setPokemonOffset((prevOffset) => (prevOffset === 0 ? 1134 : prevOffset - 10));
  }

  // useEffect together with array dependency prevents infinite loop with fetch (memory leak).
  useEffect(() => {
    apiCall(pokemonList, `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pokemonOffset}`);

    function pokemonList(data) {
      data.results.forEach((element) => {
        apiCall(pokemons, element.url);
      });
    }
  }, [pokemonOffset]);

  return (
    <div>
      <button onClick={() => pokemonLinksCreator("-")}>Previous page</button>
      <button onClick={() => pokemonLinksCreator("+")}>Next page</button>

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
// <Comp2 />
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
  const pokemonArray = useContext(CompData);
  const pokemon = pokemonArray[0];

  return (
    <section>
      <div className="pokemons">
        {/* only displays when pokemon is true/not empty */}
        <h1>{pokemon.name.toUpperCase()}</h1>
        <img src={pokemon.sprites.front_default} alt="" />
        {/*
    Only loops trough pokemon with map when pokemon is "true"/not empty
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

      <button className="pokemons__moreInfo">
        Click for more info
        <br />v
      </button>
    </section>
  );
}
