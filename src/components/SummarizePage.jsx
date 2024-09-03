import React, { useState } from 'react';

function SummarizePage() {
    const [memId, setMemId] = useState('');
    const [bookIdx, setBookIdx] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        setLoading(true);
        setError('');
        setSummary('');

        try {
            const response = await fetch('http://localhost:3001/summary/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memId, bookIdx })
            });

            const data = await response.json();
            if (response.ok) {
                setSummary(data.summary); // 서버로부터 받은 한글 요약 결과를 표시
            } else {
                setError(data.error || '요약 생성에 실패했습니다.');
            }
        } catch (err) {
            console.error('Error fetching summary:', err);
            setError('요약 생성에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>텍스트 요약 생성</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="회원 ID 입력"
                    value={memId}
                    onChange={(e) => setMemId(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    placeholder="책 인덱스 입력"
                    value={bookIdx}
                    onChange={(e) => setBookIdx(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <button onClick={handleSummarize} disabled={loading}>
                    {loading ? '요약 중...' : '요약 생성'}
                </button>
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {summary && (
                <div>
                    <h2>요약 결과</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}

export default SummarizePage;
