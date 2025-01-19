import React, { useState, useRef } from "react";
import "./ImageEditor.css";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FilterIcon from "@mui/icons-material/Filter";
import TuneIcon from "@mui/icons-material/Tune";
import CropIcon from "@mui/icons-material/Crop";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ResizeIcon from "@mui/icons-material/AspectRatio";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";

const ImageEditor = () => {
  const [activeControl, setActiveControl] = useState(null); // Default: no tab selected
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [text, setText] = useState("");
  const [filters, setFilters] = useState({
    brightness: 100,
    saturation: 100,
    contrast: 100,
  });
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
      ctx.font = "48px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
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

  const handleSave = () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = editedImage;
    link.click();
  };

  const renderControlSection = () => {
    if (activeControl === "reset" || activeControl === "crop" || activeControl === "rotate") {
      return null; // Hide controls section
    }

    switch (activeControl) {
      case "filters":
        return (
          <div className="control-group">
            <h3>Filters</h3>
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
        );
      case "text":
        return (
          <div className="control-group">
            <h3>Add Text</h3>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text"
              className="text-input"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="header">
        <h2 className="title">InstaEdit</h2>
        <div className="options">
          <button
            className="upload-button"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Image
          </button>
          <button onClick={handleSave} className="action-button">
            Save Image
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <Tooltip title="Add Text">
          <button
            className={`control-tab add-text ${activeControl === "text" ? "active" : ""}`}
            onClick={() => setActiveControl("text")}
          >
            <TextFieldsIcon />
          </button>
        </Tooltip>
        <Tooltip title="Apply Filters">
          <button
            className={`control-tab apply-filters ${activeControl === "filters" ? "active" : ""}`}
            onClick={() => setActiveControl("filters")}
          >
            <FilterIcon />
          </button>
        </Tooltip>
        <Tooltip title="Adjust Settings">
          <button
            className={`control-tab adjust ${activeControl === "settings" ? "active" : ""}`}
            onClick={() => setActiveControl("settings")}
          >
            <TuneIcon />
          </button>
        </Tooltip>
        <Tooltip title="Crop Image">
          <button
            className={`control-tab crop ${activeControl === "crop" ? "active" : ""}`}
            onClick={() => setActiveControl("crop")}
          >
            <CropIcon />
          </button>
        </Tooltip>
        <Tooltip title="Rotate Image">
          <button
            className={`control-tab rotate ${activeControl === "rotate" ? "active" : ""}`}
            onClick={() => setActiveControl("rotate")}
          >
            <RotateRightIcon />
          </button>
        </Tooltip>
        <Tooltip title="Resize Image">
          <button
            className={`control-tab resize ${activeControl === "resize" ? "active" : ""}`}
            onClick={() => setActiveControl("resize")}
          >
            <ResizeIcon />
          </button>
        </Tooltip>
        <Tooltip title="Reset Changes">
          <button
            className="control-tab"
            onClick={() => {
              setFilters({ brightness: 100, saturation: 100, contrast: 100 });
              setText("");
              setActiveControl("reset");
            }}
          >
            <RefreshIcon />
          </button>
        </Tooltip>
      </div>

      {/* Editor Layout */}
      <div className="editor-layout">
        {/* Left: Canvas */}
        <div className="canvas-container">
          <canvas ref={canvasRef} className="editor-canvas" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden-input"
          />
        </div>

        {/* Right: Controls */}
        <div
          className="controls-section"
          style={{ display: activeControl === "reset" || activeControl === "crop" || activeControl === "rotate" || activeControl === null ? "none" : "block" }}
        >
          {renderControlSection()}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
