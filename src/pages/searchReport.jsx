import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/searchreport.css';
import { BiSearchAlt } from "react-icons/bi";
import axios from 'axios';

const SearchReport = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query');
    const [books, setBooks] = useState([]);  // 검색 결과를 저장할 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState(null);  // 에러 상태

    useEffect(() => {
        if (searchQuery) {
            axios.get(`http://localhost:3001/api/search?query=${searchQuery}`)
                .then(response => {
                    setBooks(response.data);
                    setLoading(false);  // 로딩 상태 해제
                })
                .catch(error => {
                    console.log('Error fetching data:', error);  // 에러 로그 추가
                    setError('데이터를 불러오는 중 오류가 발생했습니다.');
                    setLoading(false);  // 로딩 상태 해제
                });
        } else {
            setLoading(false);  // 검색어가 없을 경우에도 로딩 상태 해제
        }
    }, [searchQuery]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    console.log(books);

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
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <div key={index} className="book-card">
                                <img src={book.book_cover} alt={book.book_name} className="search-book-cover" />
                                
                                <div className="book-info">
                                    <p className="search-book-title">&lt;{book.book_name}&gt;</p>
                                    <p className="book-author">{book.book_writer} 저자</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>검색 결과가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchReport;