// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm, 
  fetchPokemon, 
  PokemonInfoFallback, 
  PokemonDataView
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state
  let isIdle = status === 'idle'
  let isPending = status === 'pending'
  let isResolved = status === 'resolved' 
  let isRejected = status === 'rejected'

  React.useEffect(() => {
    if (!pokemonName) { 
      return 
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({status: 'resolved', pokemon})
      })
      .catch(error => {
        setState({status: 'rejected', error})
      })
  },[pokemonName])
  
  console.log(state)

  if (isRejected) {
    throw error
  } else if (isIdle) {
    return 'Submit a pokemon'
  } else if (isPending) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (isResolved) {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function FallbackComponent({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}


function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName("")
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary 
          FallbackComponent={FallbackComponent}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
