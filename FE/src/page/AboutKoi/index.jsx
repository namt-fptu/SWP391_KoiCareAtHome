import React, { useEffect, useState } from 'react';

export default function List() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('koiF.json'); // Thay đổi đường dẫn đến tệp JSON của bạn
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPeople(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <article className="bg-black p-5">
          <h1 className="text-white text-3xl font-bold mb-8">KoiF Manager</h1>
          <p className="text-white">Loading...</p>
        </article>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <article className="bg-black p-5">
          <h1 className="text-white text-3xl font-bold mb-8">KoiF Manager</h1>
          <p className="text-red-500">{error}</p>
        </article>
      </div>
    );
  }

  if (!people || people.length === 0) {
    return (
      <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
        <article className="bg-black p-5">
          <h1 className="text-white text-3xl font-bold mb-8">KoiF Manager</h1>
          <p className="text-white">No data available.</p>
        </article>
      </div>
    );
  }

  const listItems = people.map((person) => (
    <li key={person.id} className="list-none mx-5">
      <p className="text-white">
        <b>{person.name}:</b>
        {' ' + person.coder + ' '}
      </p>
    </li>
  ));

  return (
    <div className="flex-1 h-full p-5 bg-gray-900 min-h-screen">
      <article className="bg-black p-5">
        <h1 className="text-white text-3xl font-bold mb-8">KoiF Manager</h1>
        <ul className="flex flex-wrap justify-center p-0">{listItems}</ul>
      </article>
    </div>
  );
}
