import React from 'react';
import '../styles/book_card.scss';

const BookCard = ({ books, ratingData }) => {
  
  return (
    <div>
      {books.map(book => (
        <div className='card_container' key={book.key}>
          <div className='card__item'>
            <div className="card__img">
              {book.cover_i && <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} alt="Book Cover" />}
            </div>
            <div className="card_detials">
              <h3>{book.title}</h3>
              {book.author_name && <span className='author'>Author: {book.author_name.join(', ')}</span>}
              {book.publish_date && <p>Published: {book.first_publish_year}</p>}
              {ratingData[book.key.replace('/works/', '')] && (
                <span>Average Rating: {ratingData[book.key.replace('/works/', '')].summary.average}</span>
              )}
              <button className='buy_btn'>
                <a href={`https://www.amazon.com/dp/${book.isbn && book.isbn[0]}/?tag=book04dc01-20&title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author_name)}`} target="_blank" rel="noopener noreferrer">
                  Buy from Amazon
                </a>
              </button>      
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCard;