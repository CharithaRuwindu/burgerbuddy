import React, { useState, useRef, useEffect } from 'react';

const ImageHandler = ({ onImageSelect, aspectRatio = 3/2, errorMessage }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cloudinaryWidget = useRef(null);
  const cloudName = 'disgrv2zx'; // Your Cloudinary cloud name
  
  // This effect ensures the preview image is refreshed when it changes
  useEffect(() => {
    if (preview) {
      console.log("Preview URL updated:", preview);
    }
  }, [preview]);
  
  useEffect(() => {
    // Initialize Cloudinary widget when component mounts
    if (typeof window !== 'undefined' && window.cloudinary) {
      initCloudinaryWidget();
    } else {
      // Load Cloudinary script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = initCloudinaryWidget;
      document.body.appendChild(script);
      
      return () => {
        // Clean up script tag when component unmounts, if it exists
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    
    // Cleanup function for the widget
    return () => {
      if (cloudinaryWidget.current && typeof cloudinaryWidget.current.close === 'function') {
        cloudinaryWidget.current.close();
      }
    };
  }, [aspectRatio]);
  
  const initCloudinaryWidget = () => {
    cloudinaryWidget.current = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: 'burgerbuddy',
        cropping: true,
        croppingAspectRatio: aspectRatio,
        croppingShowDimensions: true,
        croppingValidateDimensions: true,
        croppingDefaultSelectionRatio: aspectRatio,
        showSkipCropButton: false,
        showPoweredBy: false,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxImageFileSize: 10000000, // 10MB max file size
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
        styles: {
          palette: {
            window: '#FFFFFF',
            sourceBg: '#F4F4F5',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            inactiveTabIcon: '#69778A',
            menuIcons: '#0078FF',
            link: '#0078FF',
            action: '#0078FF',
            inProgress: '#0078FF',
            complete: '#20B832',
            error: '#EA2727',
            textDark: '#000000',
            textLight: '#FFFFFF'
          }
        }
      },
      (error, result) => {
        if (error) {
          console.error('Error with Cloudinary widget:', error);
          return;
        }
        
        // For debugging - Log all events
        console.log('Cloudinary widget event:', result.event, result);
        
        if (result.event === 'success') {
          // Extract information about the uploaded image
          const { secure_url } = result.info;
          
          // Force a unique URL with timestamp to prevent caching
          const timestamp = new Date().getTime();
          const imageUrl = `${secure_url}?t=${timestamp}`;
          
          console.log('Final image URL:', imageUrl);
          
          // Set the preview immediately to show something
          setPreview(imageUrl);
          
          // Add a small delay to ensure Cloudinary has processed the crop
          setTimeout(() => {
            // Refresh the preview with a new timestamp
            const refreshedUrl = `${secure_url}?t=${new Date().getTime()}`;
            setPreview(refreshedUrl);
            
            // Create a File object from the URL
            fetchImageAsFile(refreshedUrl)
              .then(file => {
                onImageSelect(file);
              })
              .catch(err => {
                console.error("Error creating File from URL:", err);
              });
          }, 1000); // 1 second delay
        }
      }
    );
  };

  // Helper function to fetch an image as a File object
  const fetchImageAsFile = async (url) => {
    try {
      // Add cache-busting parameter to prevent browser caching
      const cacheBuster = `?cb=${Date.now()}`;
      const fetchUrl = url.includes('?') ? `${url}&cb=${Date.now()}` : `${url}${cacheBuster}`;
      
      const response = await fetch(fetchUrl, { 
        method: 'GET',
        cache: 'no-cache', // Ensure we don't use cached version
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0]; // Remove query params
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && cloudinaryWidget.current) {
      // Reset file input value to allow selecting the same file again
      fileInputRef.current.value = '';
      // Open the widget with the selected file
      cloudinaryWidget.current.open(null, { files: [file] });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && cloudinaryWidget.current) {
      // Open the widget with the dropped file
      cloudinaryWidget.current.open(null, { files: [e.dataTransfer.files[0]] });
    }
  };

  const handleBrowseClick = () => {
    // Simply trigger the hidden file input
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="border rounded-lg p-4">
          <div className="flex flex-col items-center">
            <div 
              className="mb-3 w-full bg-gray-100 overflow-hidden flex items-center justify-center"
              style={{ maxWidth: '400px', aspectRatio: aspectRatio }}
            >
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                key={preview} // Add a key to force re-render when preview changes
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  // Try to reload the image if it fails
                  e.target.src = `${preview}&retry=${Date.now()}`;
                }}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBrowseClick}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  onImageSelect(null);
                }}
                className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${errorMessage ? 'border-red-500' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ minHeight: '150px' }}
        >
          <div className="flex flex-col items-center justify-center py-6">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Drag and drop</span> your image here or
            </p>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Browse Files
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default ImageHandler;