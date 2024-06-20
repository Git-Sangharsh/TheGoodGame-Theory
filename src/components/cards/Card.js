import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Card.css";

function Card() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
        const pokemonData = response.data.results;
        const pokemonDetails = await Promise.all(
          pokemonData.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              image: details.data.sprites.back_default,
            };
          })
        );
        setPokemonList(pokemonDetails);
        setFilteredPokemonList(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    const filteredList = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemonList(filteredList);
  }, [searchTerm, pokemonList]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-container">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="card-wrapper">
        {filteredPokemonList.map((pokemon, index) => (
          <div className="cards" key={index}>
            {pokemon.image && <img src={pokemon.image} alt={pokemon.name} />}
            <h3>{pokemon.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
