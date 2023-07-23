import React, { useState, useEffect  } from 'react'
import { createClient } from 'pexels'
import riseupp from './img/ico.webp'
import './App.css'

const API_KEY = 'q4EQa1ke8pgUUkBoc5r2pGnVLdBMFhMMzLJ09kKHkU6FZxL3JzuwgS7S'
const client = createClient(API_KEY)
const IMG_PER_PAGE =8
const MAX_VISIBLE_PAGES = 10

const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hoveredImage, setHoveredImage] = useState(null)


  useEffect(() => {
    handleSearch()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const handleSearch = async () => {
    
    setLoading(true)
    try {
      const response = await client.photos.search({
        query: searchQuery,
        per_page: IMG_PER_PAGE,
        page: currentPage,
      });
      setImages(response.photos)
      setTotalPages(Math.ceil(response.total_results / IMG_PER_PAGE))
    } catch (error) {
      console.error('Error fetching images:', error)
      setImages([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }


  const handleFormSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    handleSearch()
  }


  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const getVisiblePageNumbers = () => {
    const maxPages = Math.min(MAX_VISIBLE_PAGES, totalPages)
    const halfMaxPages = Math.floor(maxPages / 2)
    let startPage = Math.max(currentPage - halfMaxPages, 1)
    const endPage = Math.min(startPage + maxPages - 1, totalPages)
    if (totalPages - endPage < halfMaxPages) {
      startPage = Math.max(endPage - maxPages + 1, 1)
    }
    return Array.from({ length: maxPages }, (_, index) => startPage + index)
  }

  const handleJumpToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleImageMouseEnter = (image) => {
    setHoveredImage(image)
  }

  const handleImageMouseLeave = () => {
    setHoveredImage(null)
  }


  return (
    <div>
      
      <div className="ico">
   <img src={riseupp} alt="riseupp" />
    </div>
    <form onSubmit={handleFormSubmit} className="search-bar">
       <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Images"
        />
        <button onClick={handleSearch}>Search</button>
      </form>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {
            <div className="image-list">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="image-container"
                  onMouseEnter={() => handleImageMouseEnter(image)}
                  onMouseLeave={handleImageMouseLeave}
                >
                  <a href={image.src.original} target="_blank" rel="noopener noreferrer">
                    <img src={image.src.medium} alt={image.photographer} />
                  </a>
                  {hoveredImage && hoveredImage.id === image.id && (
                    <div className="image-tooltip">
                      <h4>{hoveredImage.alt}</h4>
                    </div>
                  )}
                </div>
              ))}
            </div>
         }
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} className="arrow">
                &larr;
              </button>
              {getVisiblePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handleJumpToPage(page)}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              <button onClick={handleNextPage} className="arrow">
                &rarr;
              </button>
            </div>
          )}
          
        </>
      )}
    </div>
  )
}

export default App