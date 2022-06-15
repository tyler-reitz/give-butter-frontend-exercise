import { useEffect, useState } from "react";
import { fetchAllPokemon, fetchPokemonDetailsByName, fetchEvolutionChainById  } from "./api";

function App() {
    const [pokemonIndex, setPokemonIndex] = useState([])
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState()
    const [evolutionChain, setEvolutionChain] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()

            setPokemon(pokemonList)
            setPokemonIndex(pokemonList)
        }

        fetchPokemon().then(() => {
            /** noop **/
          if (searchValue) {
            setPokemon(
              pokemonIndex.filter(monster => monster.name.includes(searchValue))
            )
          }
        })
    }, [searchValue])

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        setPokemon(
            pokemonIndex.filter(monster => monster.name.includes(value))
        )
    }

    const onGetDetails = (name) => async () => {
        /** code here **/
        const details = await fetchPokemonDetailsByName(name)
        setPokemonDetails(details)
        const { chain } = await fetchEvolutionChainById(details.id)
        setEvolutionChain(chain)
    }

    const flattenEvolutionChain = ({ evolves_to, species }) => {
      if (evolves_to.length) {
        return [species.name, ...flattenEvolutionChain(evolves_to[0])]
      }

      return [species.name]
    }

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
            </div>
            <div className={'pokedex__content'}>
                {pokemon.length > 0 ? (
                    <div className={'pokedex__search-results'}>
                        {
                            pokemon.map(monster => {
                                return (
                                    <div className={'pokedex__list-item'} key={monster.name}>
                                        <div>
                                            {monster.name}
                                        </div>
                                        <button onClick={onGetDetails(monster.name)}>Get Details</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : 'no results found'}
                {
                    pokemonDetails && (
                        <div className={'pokedex__details'}>
                            {/*  code here  */}
                            <strong className={'pokedex__details-title'}>
                              {pokemonDetails.name}
                            </strong>
                            <div className={'pokedex__details-list'}>
                              <strong className={'pokedex__details-list-title'}>
                                Types
                              </strong>
                              <ul>
                                {pokemonDetails.types.map(({type}) => (
                                  <li>{type.name}</li>
                                ))}
                              </ul>
                            </div>
                            <div className={'pokedex__details-list'}>
                              <strong className={'pokedex__details-list-title'}>
                                Moves
                              </strong>
                              <ul>
                                {pokemonDetails.moves.map(({move}) => (
                                  <li>{move.name}</li>
                                ))}
                              </ul>
                            </div>
                            <strong className={'pokedex__details-title'}>
                              Evolutions
                            </strong>
                            <div className={'pokedex__details-chain'}>
                              {evolutionChain && flattenEvolutionChain(evolutionChain)
                                .map(name => (
                                  <em className={'pokedex__details-chain-item'}>
                                    {name}
                                  </em>
                              ))}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;
