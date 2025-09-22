import { useState, useEffect } from "react"
import { Search } from "./components/Search"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchMovies = async () => {
    setIsLoading(true)
    setErrorMessage("")
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error("Failed to fetch movies")
      }
      const data = await response.json()
      
      setMovies(data.results || [])
    } catch (error) {
      console.log(`Something went wrong: ${error.message}`)
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

    return (
    <main>
      <div className="pattern" /> 
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero banner"/>
          <h1>
            Find <span className="text-gradient">
              Movies
            </span>
            You'll Enjoy Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            movies.map((movie) => (
              <p 
              className="text-white"
              key={movie.id}>
                {movie.title}
              </p>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
export default App