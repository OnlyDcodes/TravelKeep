import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Home = ({ user }) => {
  const [places, setPlaces] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: '', description: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const q = query(
        collection(db, 'places'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const placesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlaces(placesData);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      const placeData = {
        ...newPlace,
        userId: user.uid,
        createdAt: new Date(),
        photoCount: 0
      };
      
      await addDoc(collection(db, 'places'), placeData);
      setNewPlace({ name: '', description: '', location: '' });
      setShowAddForm(false);
      fetchPlaces();
    } catch (error) {
      console.error('Error adding place:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-maroon-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white/80 drop-shadow-sm">Loading your travels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 glass-3d rounded-2xl mb-6 shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 font-display drop-shadow-lg">My Travels</h1>
        <p className="text-lg text-white/80 font-medium drop-shadow-sm">Keep your travel memories organized and beautiful</p>
      </div>

      {/* Add Place Button */}
      <div className="text-center mb-12">
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-3d inline-flex items-center group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Place
        </button>
      </div>

      {/* Add Place Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-3d rounded-2xl shadow-soft p-8 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white font-display drop-shadow-sm">Add New Place</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddPlace} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                  Place Name
                </label>
                <input
                  type="text"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                  placeholder="e.g., Paris, France"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                  Location
                </label>
                <input
                  type="text"
                  value={newPlace.location}
                  onChange={(e) => setNewPlace({ ...newPlace, location: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                  placeholder="e.g., France"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                  Description
                </label>
                <textarea
                  value={newPlace.description}
                  onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-white/50"
                  rows="3"
                  placeholder="Tell us about this amazing place..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-3d"
                >
                  Add Place
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 glass border border-white/20 text-white hover:bg-white/10 transition-all duration-200 rounded-xl px-4 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Places Grid */}
      {places.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 glass-3d rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
            <span className="text-4xl">✈️</span>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3 font-display drop-shadow-lg">No places yet</h3>
          <p className="text-white/80 mb-6 drop-shadow-sm">Start by adding your first travel destination!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-3d"
          >
            Add Your First Place
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <Link
              key={place.id}
              to={`/place/${place.id}`}
              className="group card-hover-3d"
            >
              <div className="glass-3d rounded-2xl shadow-soft border border-white/20 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-primary-300 transition-colors duration-200 font-display drop-shadow-sm">{place.name}</h3>
                    <div className="flex items-center space-x-1 glass px-3 py-1 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-white/90">{place.photoCount}</span>
                    </div>
                  </div>
                  <p className="text-white/80 mb-3 font-medium flex items-center drop-shadow-sm">
                    <svg className="w-4 h-4 mr-2 text-maroon-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {place.location}
                  </p>
                  {place.description && (
                    <p className="text-sm text-white/60 line-clamp-2 mb-4 drop-shadow-sm">{place.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-white/50">
                    <span>Added {place.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 