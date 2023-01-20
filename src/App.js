import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const mounted = useRef(false);
  const [newImages, setNewImages] = useState(false);
  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);

      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImages]);

  const event = () => { //When Scroll is at bottom, newImages is set to true, which triggers previous useeffect where page is changed(+1 to page) which triggers useEffect of page dependency
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
    //window.innerHeight gives the window height. window.scrollY gives the no of pixels scrolled in Y axis.   
    // document.body.scrollHeight gives the total scrollable height of the document body
    //-2 is added to the logic to ensure that it is true, 2 pixels before the scroll end is reached
    
    setNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchImages();
    }
    setPage(1);
  };
  return (
    <main>
      <div className="photos-center">
        <h1>Infinite Scroll</h1>
      </div>
      <section className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='form-input'
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className='photos'>
        <div className='photos-center'>
          {photos.map((image, index) => {
            return <Photo key={index} {...image} />;
          })}
        </div>
        {loading && <h2 className='loading'>Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
