import React, { useState, useRef, useEffect } from 'react';

const ImageHandler = ({ onImageSelect, aspectRatio = 3/2, errorMessage }) => {
  const [preview, setPreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const cropAreaRef = useRef(null);
  const cropFrameRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    aspectRatio: aspectRatio
  });
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState(null);

  useEffect(() => {
    if (isCropping && originalImage) {
      const img = new Image();
      img.src = originalImage;
      img.onload = () => {
        const containerWidth = cropAreaRef.current.clientWidth;
        const containerHeight = cropAreaRef.current.clientHeight;
        
        // Calculate displayed image size while maintaining aspect ratio
        let displayWidth, displayHeight;
        
        if (img.width / img.height > containerWidth / containerHeight) {
          // Image is wider than container
          displayWidth = containerWidth;
          displayHeight = (img.height / img.width) * containerWidth;
        } else {
          // Image is taller than container
          displayHeight = containerHeight;
          displayWidth = (img.width / img.height) * containerHeight;
        }
        
        setImageSize({ width: displayWidth, height: displayHeight });
        
        // Initialize crop box
        const cropWidth = Math.min(displayWidth, displayHeight * aspectRatio);
        const cropHeight = cropWidth / aspectRatio;
        
        setCropBox({
          x: (displayWidth - cropWidth) / 2,
          y: (displayHeight - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight,
          aspectRatio
        });
      };
    }
  }, [isCropping, originalImage, aspectRatio]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleCropMouseDown = (e) => {
    if (!isCropping) return;
    
    e.preventDefault();
    
    const cropFrame = cropFrameRef.current;
    if (!cropFrame) return;
    
    const cropRect = cropFrame.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // Detect if we're on an edge for resizing (with some margin for easier grabbing)
    const edgeSize = 10;
    const isOnLeftEdge = Math.abs(clientX - cropRect.left) <= edgeSize;
    const isOnRightEdge = Math.abs(clientX - cropRect.right) <= edgeSize;
    const isOnTopEdge = Math.abs(clientY - cropRect.top) <= edgeSize;
    const isOnBottomEdge = Math.abs(clientY - cropRect.bottom) <= edgeSize;
    
    if (isOnRightEdge && isOnBottomEdge) {
      setResizeHandle('se');
    } else if (isOnRightEdge && isOnTopEdge) {
      setResizeHandle('ne');
    } else if (isOnLeftEdge && isOnBottomEdge) {
      setResizeHandle('sw');
    } else if (isOnLeftEdge && isOnTopEdge) {
      setResizeHandle('nw');
    } else if (isOnRightEdge) {
      setResizeHandle('e');
    } else if (isOnLeftEdge) {
      setResizeHandle('w');
    } else if (isOnBottomEdge) {
      setResizeHandle('s');
    } else if (isOnTopEdge) {
      setResizeHandle('n');
    } else {
      setResizeHandle('move');
    }
    
    setDragStart({
      x: clientX,
      y: clientY,
      cropBox: { ...cropBox }
    });
  };

  const handleCropMouseMove = (e) => {
    if (!dragStart || !isCropping) return;
    
    e.preventDefault();
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const containerWidth = cropAreaRef.current.clientWidth;
    const containerHeight = cropAreaRef.current.clientHeight;
    
    let newCropBox = { ...cropBox };
    
    if (resizeHandle === 'move') {
      // Move the crop box
      newCropBox.x = Math.max(0, Math.min(imageSize.width - cropBox.width, dragStart.cropBox.x + dx));
      newCropBox.y = Math.max(0, Math.min(imageSize.height - cropBox.height, dragStart.cropBox.y + dy));
    } else {
      // Resize the crop box
      const minSize = 50; // Minimum crop box size
      
      if (resizeHandle.includes('e')) {
        // Resize from right edge
        let newWidth = Math.max(minSize, dragStart.cropBox.width + dx);
        newWidth = Math.min(newWidth, imageSize.width - newCropBox.x);
        newCropBox.width = newWidth;
        newCropBox.height = newWidth / aspectRatio;
      }
      
      if (resizeHandle.includes('w')) {
        // Resize from left edge
        let newWidth = Math.max(minSize, dragStart.cropBox.width - dx);
        let newX = dragStart.cropBox.x + (dragStart.cropBox.width - newWidth);
        
        // Ensure we don't go out of bounds
        if (newX >= 0) {
          newCropBox.x = newX;
          newCropBox.width = newWidth;
          newCropBox.height = newWidth / aspectRatio;
        }
      }
      
      if (resizeHandle.includes('s')) {
        // Resize from bottom edge
        let newHeight = Math.max(minSize, dragStart.cropBox.height + dy);
        newHeight = Math.min(newHeight, imageSize.height - newCropBox.y);
        newCropBox.height = newHeight;
        newCropBox.width = newHeight * aspectRatio;
      }
      
      if (resizeHandle.includes('n')) {
        // Resize from top edge
        let newHeight = Math.max(minSize, dragStart.cropBox.height - dy);
        let newY = dragStart.cropBox.y + (dragStart.cropBox.height - newHeight);
        
        // Ensure we don't go out of bounds
        if (newY >= 0) {
          newCropBox.y = newY;
          newCropBox.height = newHeight;
          newCropBox.width = newHeight * aspectRatio;
        }
      }
      
      // Make sure crop box doesn't exceed image bounds
      if (newCropBox.x + newCropBox.width > imageSize.width) {
        newCropBox.width = imageSize.width - newCropBox.x;
        newCropBox.height = newCropBox.width / aspectRatio;
      }
      
      if (newCropBox.y + newCropBox.height > imageSize.height) {
        newCropBox.height = imageSize.height - newCropBox.y;
        newCropBox.width = newCropBox.height * aspectRatio;
      }
    }
    
    setCropBox(newCropBox);
  };

  const handleCropMouseUp = () => {
    setDragStart(null);
    setResizeHandle(null);
  };

  const handleApplyCrop = () => {
    if (!originalImage) return;
    
    const img = new Image();
    img.src = originalImage;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const displayedImg = imageRef.current;
      
      // Calculate scale factor between original image and displayed image
      const scaleX = img.width / imageSize.width;
      const scaleY = img.height / imageSize.height;
      
      // Set canvas size to the crop dimensions
      canvas.width = cropBox.width * scaleX;
      canvas.height = cropBox.height * scaleY;
      
      const ctx = canvas.getContext('2d');
      
      // Draw the cropped portion to the canvas
      ctx.drawImage(
        img,
        cropBox.x * scaleX, cropBox.y * scaleY, // Source x, y
        cropBox.width * scaleX, cropBox.height * scaleY, // Source width, height
        0, 0, // Destination x, y
        canvas.width, canvas.height // Destination width, height
      );
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        // Create a new file from the blob
        const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
        
        // Update preview and notify parent component
        setPreview(canvas.toDataURL('image/jpeg'));
        setIsCropping(false);
        onImageSelect(croppedFile);
      }, 'image/jpeg');
    };
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setPreview(null);
    setOriginalImage(null);
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      {isCropping ? (
        <div className="border rounded-lg p-4">
          <h3 className="text-center font-medium mb-3">Crop Image</h3>
          <p className="text-sm text-gray-500 text-center mb-3">
            Drag to adjust the crop area or resize from the edges
          </p>
          
          <div 
            ref={cropAreaRef}
            className="relative mx-auto mb-4 overflow-hidden bg-gray-200"
            style={{ 
              width: '100%', 
              maxWidth: '500px',
              height: '350px'
            }}
            onMouseDown={handleCropMouseDown}
            onMouseMove={handleCropMouseMove}
            onMouseUp={handleCropMouseUp}
            onMouseLeave={handleCropMouseUp}
          >
            {originalImage && (
              <>
                <img
                  ref={imageRef}
                  src={originalImage}
                  alt="Original"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: imageSize.width,
                    height: imageSize.height
                  }}
                />
                
                {/* Semi-transparent overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                
                {/* Crop selection box */}
                <div
                  ref={cropFrameRef}
                  className="absolute border-2 border-white"
                  style={{
                    left: cropBox.x,
                    top: cropBox.y,
                    width: cropBox.width,
                    height: cropBox.height,
                    cursor: resizeHandle ? 
                      (resizeHandle === 'move' ? 'move' : 
                       resizeHandle === 'n' || resizeHandle === 's' ? 'ns-resize' :
                       resizeHandle === 'e' || resizeHandle === 'w' ? 'ew-resize' :
                       resizeHandle === 'ne' || resizeHandle === 'sw' ? 'nesw-resize' :
                       'nwse-resize') : 'default'
                  }}
                >
                  {/* Clear the overlay inside the crop box */}
                  <div className="absolute inset-0 bg-transparent"></div>
                  
                  {/* Resize handles */}
                  <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2 cursor-nesw-resize"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2 cursor-nesw-resize"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full transform translate-x-1/2 translate-y-1/2 cursor-nwse-resize"></div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={handleCancelCrop}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Apply Crop
            </button>
          </div>
        </div>
      ) : preview ? (
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
                  setPreview(null);
                  setOriginalImage(null);
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