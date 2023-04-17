import React, { useState, useEffect } from 'react';

function TestTrends() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://trends.google.com/trends/explore', {
        method: 'POST',
        body: JSON.stringify({ 'comparisonItem': [{ 'keyword': 'dogs', 'geo': 'US', 'time': 'today 12-m' }], 'category': 0, 'property': '' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      setData(json);
    };
    fetchData();
  }, []);

  return (
    <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default TestTrends;