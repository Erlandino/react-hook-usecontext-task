import { useEffect } from "react";
import { useContext, createContext, useState } from "react";

const CompData = createContext();

export default function App() {
  const [pokemon, setPokemon] = useState("");

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

      {/* <h1>{pokemon.name}</h1>
      {pokemon.stats.map(function (element) {
        console.log(element);
        return (
          <div>
            <p>{element.effort}</p>
          </div>
        );
      })} */}
    </>
  );
}
