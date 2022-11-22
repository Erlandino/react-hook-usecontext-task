import { useEffect } from "react";
import { useContext, createContext, useState } from "react";

const CompData = createContext();

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  useEffect(() => {
    async function apiCall(callback) {
      const fetchApi = await fetch("https://pokeapi.co/api/v2/pokemon/9/");
      const data = await fetchApi.json();

      callback(data);
    }

    apiCall(setPokemon);
  }, []);

  return (
    <CompData.Provider value={pokemon}>
      <Comp1 />
    </CompData.Provider>
  );
}

function Comp1() {
  return (
    <>
      <p>comp1</p>
      <Comp2 />
    </>
  );
}
function Comp2() {
  return (
    <>
      <p>comp2</p>
      <Comp3 />
    </>
  );
}
function Comp3() {
  const pokemon = useContext(CompData);
  console.log(pokemon);
  return (
    <>
      <p>comp3</p>

      <h1>{pokemon && pokemon.name}</h1>

      {pokemon &&
        pokemon.stats.map(function (element, index) {
          return (
            <div key={index}>
              <h3>{element.stat.name}</h3>
              <p>stat: {element.base_stat}</p>
              <p>effort: {element.effort}</p>
            </div>
          );
        })}
    </>
  );
}
