import React, { useState, useRef } from "react";
import "./ImageEditor.css";

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [text, setText] = useState("");
  const [filters, setFilters] = useState({
    brightness: 100,
    saturation: 100,
    contrast: 100,
  });
  const [cropMode, setCropMode] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          setImage(img);
          drawImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.filter = `brightness(${filters.brightness}%) saturate(${filters.saturation}%) contrast(${filters.contrast}%)`;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (text) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.font = "48px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      ctx.putImageData(imageData, 0, 0);
    }

    setEditedImage(canvas.toDataURL());
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    if (image) {
      drawImage(image);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (image) {
      drawImage(image);
    }
  };

  const toggleCropMode = () => {
    setCropMode(!cropMode);
    // Implement crop functionality here
  };

  const handleSave = () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = editedImage;
    link.click();
  };

  return (
    <div className="editor-container">
      <div className="header">
        <h2 className="title">InstaEdit</h2>
        <div className="options">
          <button
            className="upload-button"
            onClick={() => fileInputRef.current.click()}
          >
            {" "}
            Upload Image{" "}
          </button>
          <button onClick={handleSave} className="action-button">
            Save Image
          </button>
        </div>
      </div>
      <div className="editor-card">
        {/* Image Upload */}
        <div className="upload-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden-input"
          />
        </div>

        {/* Canvas */}
        <div className="canvas-container">
          <canvas ref={canvasRef} className="editor-canvas" />
        </div>

        {/* Controls */}
        <div className="controls-section">
          {/* Text Input */}
          <div className="control-group">
            <label className="control-label">Background Text</label>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text to place behind subject"
              className="text-input"
            />
          </div>

          {/* Filters */}
          <div className="control-group">
            <label className="control-label">Filters</label>
            {Object.entries(filters).map(([filter, value]) => (
              <div key={filter} className="filter-control">
                <label className="filter-label">{filter}</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={value}
                  onChange={(e) => handleFilterChange(filter, e.target.value)}
                  className="slider-input"
                />
                <span className="filter-value">{value}%</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button onClick={toggleCropMode} className="action-button">
              {cropMode ? "Cancel Crop" : "Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
