// ImageHandler.jsx - A consolidated component for image upload, cropping and preview
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export function ImageHandler({
    onImageSelect,
    initialImage = null,
    aspectRatio = 3 / 2,
    errorMessage = null
}) {
    const [imgSrc, setImgSrc] = useState('');
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 100,
        height: 100 / aspectRatio,
        x: 0,
        y: 0
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialImage);
    const [originalFile, setOriginalFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);

    // Effect to initialize image preview from initialImage prop
    useEffect(() => {
        if (initialImage) {
            setImagePreview(initialImage);
        }
    }, [initialImage]);

    // Handle file input change
    const handleFileChange = (file) => {
        if (file) {
            setOriginalFile(file);

            // Create URL for image preview
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                // Get the result directly from the event
                const imageData = event.target.result;
                
                // Set the image source for the cropper
                setImgSrc(imageData);
                console.log(imgSrc)
                
                // Show the cropper immediately after loading the image
                setShowCropper(true);
            });
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (imgSrc) {
            console.log("Updated imgSrc:", imgSrc.substring(0, 50) + "...");
        }
    }, [imgSrc]);

    // Handle file input change from input element
    const handleImageChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };

    // Handle image load in cropper
    const onImageLoad = useCallback((img) => {
        // Store the image reference for cropping
        imgRef.current = img;

        // Set initial crop to maintain aspect ratio
        const width = img.width;
        const height = width / aspectRatio;

        setCrop({
            unit: 'px',
            width,
            height,
            x: 0,
            y: (img.height - height) / 2
        });
    }, [aspectRatio]);

    // Direct file to preview (skipping cropper for testing)
    const createDirectPreview = (file) => {
        const previewUrl = URL.createObjectURL(file);

        // Create image data object with file and preview URL
        const imageData = {
            file: file,
            url: previewUrl,
            name: file.name
        };

        // Set the preview image
        setImagePreview(imageData);
        onImageSelect(file);
    };

    const generateCroppedImage = useCallback(() => {
        if (!completedCrop || !imgRef.current || !previewCanvasRef.current || !originalFile) {
            console.error("Missing required elements for crop:", {
                completedCrop: !!completedCrop,
                imgRef: !!imgRef.current,
                canvas: !!previewCanvasRef.current,
                originalFile: !!originalFile
            });
            
            // If we can't crop, at least show the original image
            createDirectPreview(originalFile);
            return;
        }
    
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;
    
        // Calculate scaling factors
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
    
        // Set the canvas dimensions to match the crop
        canvas.width = crop.width;
        canvas.height = crop.height;
    
        const ctx = canvas.getContext('2d');
    
        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Draw the cropped image onto the canvas
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    
        // Convert canvas to blob for preview
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    console.error("Failed to create blob from canvas");
                    // Fallback to direct preview if blob creation fails
                    createDirectPreview(originalFile);
                    return;
                }
    
                try {
                    // Create URL for preview
                    const previewUrl = URL.createObjectURL(blob);
                    console.log("Created blob URL:", previewUrl);
    
                    // Create a new File object from the cropped blob
                    const croppedFile = new File([blob], originalFile.name, {
                        type: originalFile.type || 'image/jpeg'
                    });
    
                    // Set image preview with the cropped image data
                    const imageData = {
                        file: croppedFile,
                        url: previewUrl,
                        name: originalFile.name
                    };
    
                    // First hide the cropper to force re-render
                    setShowCropper(false);
                    
                    // Then update the preview
                    setImagePreview(imageData);
                    
                    // Notify parent component
                    onImageSelect(croppedFile);
                    
                    console.log("Preview set with URL:", previewUrl);
                } catch (error) {
                    console.error("Error creating preview:", error);
                    // Fallback to direct preview
                    createDirectPreview(originalFile);
                }
            },
            originalFile.type || 'image/jpeg',
            0.95
        );
    }, [completedCrop, originalFile, onImageSelect]);

    // Cancel cropping
    const handleCropCancel = () => {
        setShowCropper(false);
        setImgSrc('');
        setOriginalFile(null);
    };

    // Remove selected image
    const handleImageRemove = () => {
        if (imagePreview && imagePreview.url) {
            // Revoke the object URL to prevent memory leaks
            URL.revokeObjectURL(imagePreview.url);
        }
        setImagePreview(null);
        onImageSelect(null);
    };

    // Clean up any object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.url) {
                URL.revokeObjectURL(imagePreview.url);
            }
        };
    }, [imagePreview]);

    // Drag and drop handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    // Set up drag and drop event listeners
    useEffect(() => {
        const dropZone = dropZoneRef.current;

        if (dropZone) {
            dropZone.addEventListener('dragenter', handleDragEnter);
            dropZone.addEventListener('dragleave', handleDragLeave);
            dropZone.addEventListener('dragover', handleDragOver);
            dropZone.addEventListener('drop', handleDrop);

            return () => {
                dropZone.removeEventListener('dragenter', handleDragEnter);
                dropZone.removeEventListener('dragleave', handleDragLeave);
                dropZone.removeEventListener('dragover', handleDragOver);
                dropZone.removeEventListener('drop', handleDrop);
            };
        }
    }, []);

    return (
        <div>
            {showCropper ? (
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Crop Image (3:2 Ratio)</h3>
                    <div className="mb-4">
                        {imgSrc && (
                            <ReactCrop
                                src={imgSrc}
                                onImageLoad={onImageLoad}
                                crop={crop}
                                onChange={setCrop}
                                onComplete={setCompletedCrop}
                                aspect={aspectRatio}
                                className="max-h-96 mx-auto"
                            />
                        )}
                    </div>

                    {/* Canvas for generating the cropped image - hidden from view */}
                    <canvas
                        ref={previewCanvasRef}
                        className="hidden"
                    />

                    <div className="flex justify-between space-x-4 mt-4">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            onClick={() => createDirectPreview(originalFile)}
                        >
                            Skip Cropping
                        </button>

                        <div className="flex space-x-2">
                            <button
                                type="button"
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={handleCropCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                onClick={generateCroppedImage}
                            >
                                Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {imagePreview && imagePreview.url ? (
                        <div className="mb-2">
                            {imagePreview.url}
                            <div className="relative">
                                {/* Display the selected/cropped image preview */}
                                <img
                                    src={imagePreview.url}
                                    alt="Preview"
                                    className="w-full h-64 object-contain rounded border border-gray-300"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    onClick={handleImageRemove}
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Image selected: {imagePreview.name}
                            </p>
                        </div>
                    ) : (
                        <div
                            ref={dropZoneRef}
                            className={`flex items-center justify-center w-full ${isDragging ? 'bg-blue-50' : 'bg-gray-50'}`}
                        >
                            <label
                                className={`flex flex-col items-center justify-center w-full h-64 border-2 ${isDragging ? 'border-blue-300' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer hover:bg-gray-100`}
                                htmlFor="file-upload"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">Image will be cropped to 3:2 ratio</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    id="file-upload"
                                    type="file"
                                    name="itemImage"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    )}

                    {errorMessage && (
                        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                    )}
                </div>
            )}
        </div>
    );
}