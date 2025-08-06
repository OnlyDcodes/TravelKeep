import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const PlaceDetail = ({ user }) => {
  const { placeId } = useParams();
  const [place, setPlace] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaceDetails();
  }, [placeId]);

  const fetchPlaceDetails = async () => {
    try {
      const placeDoc = await getDoc(doc(db, 'places', placeId));
      if (placeDoc.exists()) {
        setPlace({ id: placeDoc.id, ...placeDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `places/${placeId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          url: downloadURL,
          name: file.name,
          uploadedAt: new Date()
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [...prev, ...uploadedPhotos]);
      
      // Update photo count in place document
      await updateDoc(doc(db, 'places', placeId), {
        photoCount: (place.photoCount || 0) + files.length
      });
      
      setPlace(prev => ({
        ...prev,
        photoCount: (prev.photoCount || 0) + files.length
      }));
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setUploading(false);
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
          <p className="text-white/80 drop-shadow-sm">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 glass-3d rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4 font-display drop-shadow-lg">Place not found</h2>
          <Link to="/" className="btn-3d">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 group drop-shadow-sm">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Travels
        </Link>
        <div className="glass-3d rounded-2xl shadow-soft p-8 border border-white/20">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display drop-shadow-lg">{place.name}</h1>
              <p className="text-lg text-white/80 font-medium drop-shadow-sm">{place.location}</p>
            </div>
          </div>
          {place.description && (
            <p className="text-white/70 bg-white/10 rounded-xl p-4 border-l-4 border-primary-400 drop-shadow-sm">{place.description}</p>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="glass-3d rounded-2xl shadow-soft p-8 mb-8 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white font-display drop-shadow-sm">Upload Photos</h2>
        </div>
        <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-primary-300 transition-colors duration-200">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
            disabled={uploading}
          />
          <label
            htmlFor="photo-upload"
            className={`cursor-pointer inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              uploading
                ? 'bg-white/20 cursor-not-allowed text-white'
                : 'btn-3d'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Choose Photos
              </>
            )}
          </label>
          <p className="text-sm text-white/60 mt-4 drop-shadow-sm">
            Select multiple photos to upload and preserve your memories
          </p>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="glass-3d rounded-2xl shadow-soft p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 glass rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white font-display drop-shadow-sm">
              Photos ({photos.length})
            </h2>
          </div>
        </div>
        
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 glass-3d rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <span className="text-4xl">📸</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 font-display drop-shadow-lg">No photos yet</h3>
            <p className="text-white/80 mb-6 drop-shadow-sm">Upload your first photo to start building memories!</p>
            <label
              htmlFor="photo-upload"
              className="btn-3d cursor-pointer inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Your First Photo
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 card-hover-3d">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white w-full">
                    <p className="text-sm font-medium truncate drop-shadow-sm">{photo.name}</p>
                    <p className="text-xs opacity-80 drop-shadow-sm">
                      {photo.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail; 