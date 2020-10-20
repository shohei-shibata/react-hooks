// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function useLocalStorageState(
    key, 
    defaultValue = "", 
    {serialize = JSON.stringify, deserialize = JSON.parse} = {}
  ) {

  console.log(key)

  const [value, setValue] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    console.log(valueInLocalStorage)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return defaultValue
  })
  
  React.useEffect(() => {
    console.log('use effect')
    window.localStorage.setItem(key, serialize(value)) 
  }, [key, value, serialize])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name')
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return (
      <Greeting />
  )
}

export default App
