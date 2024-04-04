import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCards from './book_card';
import debounce from 'lodash.debounce';
import Loader from './loading';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ratingData, setRatingData] = useState({});

  const fetchRatingData = async (workId) => {
    try {
      const response = await axios.get(`https://openlibrary.org/works/${workId}/ratings.json`);
      setRatingData(prevState => ({
        ...prevState,
        [workId]: response.data
      }));
    } catch (error) {
      console.error(error);
    }
  };



  const fetchBooks = async (query) => {
    setLoading(true);
    setError(null);

    try {
      if (query.length < 4) {
        setError('You should write more than 3 letters.');
        setBooks([]);
        setLoading(false);
      } else {
        const response = await axios.get(`https://openlibrary.org/search.json?title=${query}`);
        if (response.data.docs.length === 0) {
          setError("Can't find the book.");
        } else {
          setBooks(response.data.docs);
          setError(null);
          response.data.docs.forEach(book => {
            fetchRatingData(book.key.replace('/works/', ''));
          });
        }
      }
    } catch (error) {
      setError('Error. You must write 4 or more characters. If this happens again, please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query) => fetchBooks(query), 300);

  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      debouncedSearch(searchQuery);
    } else {
      const fetchJamesBondBooks = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get('https://openlibrary.org/search.json?title=james%20bond');
          setBooks(response.data.docs);
          response.data.docs.forEach(book => {
            fetchRatingData(book.key.replace('/works/', ''));
          });
        } catch (error) {
          setError('Error. You must write 4 or more characters. If this happens again, please check your internet connection.');
        } finally {
          setLoading(false);
        }
      };

      fetchJamesBondBooks();
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <section className='hero_section'>
        <div className='hero_container'>
          <h2>Books searcher</h2>
          <h4>a library powered by openlibrary.org</h4>
          <div className="search_container">
            <input
              className='search_box'
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search for books (min. 3 characters)..."
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </section>
      <div className="result_container">
        {error && <p>{error}</p>}
        {loading && !error && <Loader />}
        <BookCards books={books} ratingData={ratingData} />
      </div>
    </div>
  );
};

export default Home;