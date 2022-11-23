// imports
import { useContext, createContext, useState, useEffect } from "react";

// createcontext variable
const CompData = createContext();

// Main component, exports to index.js
export default function App() {
  // useState declaration
  const [pokemon, setPokemon] = useState(null);

  // Api call, useEffect together with array dependency prevents infinite loop with fetch (memory leak).
  useEffect(() => {
    async function apiCall(callback) {
      const fetchApi = await fetch("https://pokeapi.co/api/v2/pokemon/9/");
      const data = await fetchApi.json();

      callback(data);
    }

    apiCall(setPokemon);
  }, []);

  return (
    // CompData.Provider is for useContext, allows us to send values to
    // deeply nested components without having to use props in each component
    <CompData.Provider value={pokemon}>
      <Comp2 />
    </CompData.Provider>
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
  const pokemon = useContext(CompData);

  return (
    <section>
      <div className="pokemons">
        {/* only displays when pokemon is true/not empty */}
        <h1>{pokemon && pokemon.name.toUpperCase()}</h1>
        <img src={pokemon && pokemon.sprites.front_default} alt="" />

        {/* 
        Only loops trough pokemon with map when pokemon is "true"/not empty 
        map loop function creates new html elements for each pokemon property and puts them in a container
      */}
        {pokemon &&
          pokemon.stats.map(function (element, index) {
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
