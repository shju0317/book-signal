import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/searchreport.css';
import { BiSearchAlt } from "react-icons/bi";

const SearchReport = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query');

    // 예시 데이터를 사용하여 검색 결과를 시뮬레이션
    const books = [
        { id: 1, title: '나의 눈부신 친구', author: '홍길동', rating: 4.5, cover: 'path/to/book-cover1.jpg' },
        { id: 2, title: '별의 계단', author: '홍길동', rating: 4.5, cover: 'path/to/book-cover2.jpg' },
        { id: 3, title: '늑대의 파수꾼', author: '홍길동', rating: 4.5, cover: 'path/to/book-cover3.jpg' },
        // 더 많은 책 데이터...
    ];

    return (
        <div className="search-report-container">
            <h1>검색 결과</h1>
            <hr />
            <br />
            {searchQuery && (
                <div className="search-summary">
                    <BiSearchAlt size={24} />
                    <p>{searchQuery}</p>
                </div>
            )}
            <hr />

            <div className="book-results">
                <h2>도서</h2>
                <div className="books-grid">
                    {books.map((book) => (
                        <div key={book.id} className="book-card">
                            <img src={book.cover} alt={book.title} className="book-cover" />
                            <div className="book-info">
                                <p className="book-title">&lt;{book.title}&gt;</p>
                                <p className="book-author">{book.author} 저자 | 평점: {book.rating}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchReport;
