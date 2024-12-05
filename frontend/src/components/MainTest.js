import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [equipment, setEquipment] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user's books on component mount
        const fetchEquipment = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/equipment`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setLoading(false);
            } catch (err) {
                setError('Failed to load books');
                setLoading(false);
                console.error('Error fetching books:', err);
            }
        };

        fetchBooks();
    }, []);

    const handleAdd = () => {
        // Redirect to the book upload page
        navigate('/addEquipment');
    };

  const handleQueue = () => {
    // Queue for equipment
    //TODO
  };

  const handleRenege = () => {
    // Renege on equipment
    //TODO
  };

  const handleFavorite = () => {
    // Favorite equipment
    //TODO
  };

    return(
        <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4x1 font-bold text-black mb-6">Current Equipment</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between items-center mb-4">
              
            </div>
              
            <h2 className="text-4x1 font-bold text-black mb-6">Queued Equipment</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between items-center mb-4">
              
            </div>
              
            <h2 className="text-4xl font-bold text-black mb-6">All Equipment</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleAdd}
                    className="bg-purple-100 text-purple-700 font-bold py-2 px-4 rounded-md mb-6 hover:bg-purple-300 transition duration-300 ease-in-out"
                >
                    Add New Equipment
                </button>
            </div>
            <div>
              {loading ? (
                  <p className="text-center text-white bg-gray-400 p-4 rounded">Loading equipment...</p>
              ) : equipments.length > 0 ? (
                <ul className = "space-y-4">
                    {equipments.map((equipment) => (
                        <li key={book._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                            <span className="text-lg font-semibold text-purple-600">{book.title}</span>
                            <button
                                onClick={() => handleQueue()}
                                className="bg-[purple-400 text-blue-800 font-semibold py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300 ease-in-out"
                            >
                                Add to Queue
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-purple-600 font-bold text-center bg-gray-300 p-4 rounded">No equipment available.</p>
            )}
        </div>
        </div>
        </div>
    );
};

export default MainPage;
