import React, { useState, useRef, useEffect } from 'react';

const ImageHandler = ({ onImageSelect, aspectRatio = 3/2, errorMessage }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropCoordinates, setCropCoordinates] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const cropBoxRef = useRef(null);
  const containerRef = useRef(null);
  
  // When a new image is loaded
  useEffect(() => {
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      
      // Load the image to get its dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height
        });
        
        // Start cropping when a new image is loaded
        setIsCropping(true);
        
        // Calculate default crop region based on aspect ratio
        const cropWidth = img.width;
        const cropHeight = cropWidth / aspectRatio;
        
        // If the calculated height is more than the image height,
        // recalculate based on height
        if (cropHeight > img.height) {
          const newHeight = img.height;
          const newWidth = newHeight * aspectRatio;
          setCropCoordinates({
            x: (img.width - newWidth) / 2,
            y: 0,
            width: newWidth,
            height: newHeight
          });
        } else {
          setCropCoordinates({
            x: 0,
            y: (img.height - cropHeight) / 2,
            width: cropWidth,
            height: cropHeight
          });
        }
      };
      img.src = imageUrl;
      
      // No preview yet (we'll set it after cropping)
      setPreview(null);
    } else {
      setIsCropping(false);
      setPreview(null);
    }
  }, [image, aspectRatio]);
  
  // Function to apply the crop
  const applyCrop = () => {
    if (!image || !cropCoordinates) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to the cropped size
    canvas.width = cropCoordinates.width;
    canvas.height = cropCoordinates.height;
    
    // Create an image element to draw from
    const img = new Image();
    img.onload = () => {
      // Draw the cropped region to the canvas
      ctx.drawImage(
        img,
        cropCoordinates.x, cropCoordinates.y, cropCoordinates.width, cropCoordinates.height,
        0, 0, cropCoordinates.width, cropCoordinates.height
      );
      
      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        // Create a new File object from the blob
        const croppedFile = new File([blob], image.name, {
          type: image.type,
          lastModified: Date.now()
        });
        
        // Generate preview URL
        const previewUrl = URL.createObjectURL(blob);
        setPreview(previewUrl);
        
        // Pass the cropped file to the parent component
        onImageSelect(croppedFile);
        
        // Exit cropping mode
        setIsCropping(false);
      }, image.type);
    };
    
    // Load the original image
    img.src = URL.createObjectURL(image);
  };
  
  // Function to cancel cropping
  const cancelCrop = () => {
    setIsCropping(false);
    setImage(null);
    setPreview(null);
    onImageSelect(null);
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Reset file input to allow selecting the same file again
      fileInputRef.current.value = '';
    }
  };
  
  // Handle drag over events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  // Handle drag leave events
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };
  
  // Handle click on browse button
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle mouse down on crop box
  const handleCropMouseDown = (e) => {
    if (isCropping && cropBoxRef.current && containerRef.current) {
      // Only proceed if we click inside the crop box
      const rect = cropBoxRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      
      // Determine if the mouse is inside the crop box
      const isInside = 
        mouseX >= rect.left - containerRect.left &&
        mouseX <= rect.right - containerRect.left &&
        mouseY >= rect.top - containerRect.top &&
        mouseY <= rect.bottom - containerRect.top;
      
      if (isInside) {
        setIsDraggingCrop(true);
        setDragStart({
          x: mouseX - (rect.left - containerRect.left),
          y: mouseY - (rect.top - containerRect.top)
        });
      }
    }
  };
  
  // Handle mouse move for crop box dragging
  const handleCropMouseMove = (e) => {
    if (isCropping && isDraggingCrop && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scaleX = originalDimensions.width / containerRect.width;
      const scaleY = originalDimensions.height / containerRect.height;
      
      // Get mouse position relative to container
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      
      // Calculate new position
      let newX = mouseX - dragStart.x;
      let newY = mouseY - dragStart.y;
      
      // Convert to original image coordinates
      newX = newX * scaleX;
      newY = newY * scaleY;
      
      // Constrain to image boundaries
      newX = Math.max(0, Math.min(newX, originalDimensions.width - cropCoordinates.width));
      newY = Math.max(0, Math.min(newY, originalDimensions.height - cropCoordinates.height));
      
      // Update crop coordinates
      setCropCoordinates(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    }
  };
  
  // Handle mouse up to stop dragging
  const handleCropMouseUp = () => {
    setIsDraggingCrop(false);
  };
  
  // Calculate styles for the crop box
  const getCropBoxStyle = () => {
    if (!isCropping || !containerRef.current) return {};
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate scale factors
    const scaleX = containerRect.width / originalDimensions.width;
    const scaleY = containerRect.height / originalDimensions.height;
    
    // Scale crop coordinates to display size
    const displayX = cropCoordinates.x * scaleX;
    const displayY = cropCoordinates.y * scaleY;
    const displayWidth = cropCoordinates.width * scaleX;
    const displayHeight = cropCoordinates.height * scaleY;
    
    return {
      left: `${displayX}px`,
      top: `${displayY}px`,
      width: `${displayWidth}px`,
      height: `${displayHeight}px`
    };
  };
  
  return (
    <div className="w-full">
      {/* Cropping UI */}
      {isCropping && image && (
        <div className="border rounded-lg p-4 mb-4">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2">
              Position the crop box by dragging it. When ready, click "Apply Crop".
            </p>
            
            <div 
              ref={containerRef}
              className="relative mb-3 w-full bg-gray-800 overflow-hidden flex items-center justify-center"
              style={{ 
                maxWidth: '100%', 
                height: '300px',
                cursor: isDraggingCrop ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={handleCropMouseUp}
              onMouseLeave={handleCropMouseUp}
            >
              {/* Original image */}
              <img
                ref={imageRef}
                src={URL.createObjectURL(image)}
                alt="Original"
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              
              {/* Crop box */}
              <div
                ref={cropBoxRef}
                className="absolute border-2 border-white"
                style={{
                  ...getCropBoxStyle(),
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Transparent area inside crop box */}
                <div className="absolute inset-0 bg-transparent"></div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={applyCrop}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Apply Crop
              </button>
              <button
                type="button"
                onClick={cancelCrop}
                className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Preview area (shown after cropping) */}
      {preview && !isCropping && (
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
                  setImage(null);
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
      )}
      
      {/* Upload UI (shown initially) */}
      {!preview && !isCropping && (
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