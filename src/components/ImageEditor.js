import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [activeControl, setActiveControl] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [text, setText] = useState("");
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    exposure: 100,
    shadows: 100,
    highlights: 100,
    hue: 0,
    saturation: 100,
    warmth: 100,
    vibrance: 100,
    sharpness: 100,
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
          drawOriginalImage(img); // Draw the original image without filters
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw the original image without filters or transformations
  const drawOriginalImage = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the original image
    ctx.drawImage(img, 0, 0);

    // Save the original image data
    setEditedImage(canvas.toDataURL());
  };

  // Apply brightness to pixel data
  const applyBrightness = (data, brightness) => {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (brightness / 100); // Red
      data[i + 1] = data[i + 1] * (brightness / 100); // Green
      data[i + 2] = data[i + 2] * (brightness / 100); // Blue
    }
  };

  // Apply contrast to pixel data
  const applyContrast = (data, contrast) => {
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128; // Red
      data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
      data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }
  };

  // Apply exposure to pixel data
  const applyExposure = (data, exposure) => {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (exposure / 100); // Red
      data[i + 1] = data[i + 1] * (exposure / 100); // Green
      data[i + 2] = data[i + 2] * (exposure / 100); // Blue
    }
  };

  // Apply shadows to pixel data
  const applyShadows = (data, shadows) => {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 128) data[i] = data[i] * (shadows / 100); // Red
      if (data[i + 1] < 128) data[i + 1] = data[i + 1] * (shadows / 100); // Green
      if (data[i + 2] < 128) data[i + 2] = data[i + 2] * (shadows / 100); // Blue
    }
  };

  // Apply highlights to pixel data
  const applyHighlights = (data, highlights) => {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] >= 128) data[i] = data[i] * (highlights / 100); // Red
      if (data[i + 1] >= 128) data[i + 1] = data[i + 1] * (highlights / 100); // Green
      if (data[i + 2] >= 128) data[i + 2] = data[i + 2] * (highlights / 100); // Blue
    }
  };

  // Apply saturation to pixel data
  const applySaturation = (data, saturation) => {
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray + (data[i] - gray) * (saturation / 100); // Red
      data[i + 1] = gray + (data[i + 1] - gray) * (saturation / 100); // Green
      data[i + 2] = gray + (data[i + 2] - gray) * (saturation / 100); // Blue
    }
  };

  // Apply hue rotation to pixel data
  const applyHue = (data, hue) => {
    const cos = Math.cos((hue * Math.PI) / 180);
    const sin = Math.sin((hue * Math.PI) / 180);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = r * (cos + (1 - cos) / 3) + g * ((1 - cos) / 3 - Math.sqrt(3) / 3 * sin) + b * ((1 - cos) / 3 + Math.sqrt(3) / 3 * sin);
      data[i + 1] = r * ((1 - cos) / 3 + Math.sqrt(3) / 3 * sin) + g * (cos + (1 - cos) / 3) + b * ((1 - cos) / 3 - Math.sqrt(3) / 3 * sin);
      data[i + 2] = r * ((1 - cos) / 3 - Math.sqrt(3) / 3 * sin) + g * ((1 - cos) / 3 + Math.sqrt(3) / 3 * sin) + b * (cos + (1 - cos) / 3);
    }
  };

  // Apply warmth (sepia) to pixel data
  const applyWarmth = (data, warmth) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = r * (1 - warmth / 100) + (r * 0.393 + g * 0.769 + b * 0.189) * (warmth / 100); // Red
      data[i + 1] = g * (1 - warmth / 100) + (r * 0.349 + g * 0.686 + b * 0.168) * (warmth / 100); // Green
      data[i + 2] = b * (1 - warmth / 100) + (r * 0.272 + g * 0.534 + b * 0.131) * (warmth / 100); // Blue
    }
  };

  // Apply vibrance to pixel data
  const applyVibrance = (data, vibrance) => {
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      data[i] = data[i] + (max - data[i]) * (vibrance / 100); // Red
      data[i + 1] = data[i + 1] + (max - data[i + 1]) * (vibrance / 100); // Green
      data[i + 2] = data[i + 2] + (max - data[i + 2]) * (vibrance / 100); // Blue
    }
  };

  // Apply sharpness to pixel data (simple edge detection)
  const applySharpness = (data, width, height, sharpness) => {
    const kernel = [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ];
    const tempData = new Uint8ClampedArray(data);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += tempData[idx] * kernel[ky + 1][kx + 1];
            }
          }
          const idx = (y * width + x) * 4 + c;
          data[idx] = Math.min(255, Math.max(0, data[idx] + sum * (sharpness / 100)));
        }
      }
    }
  };

  // Apply all filters to the image
  const applyFilters = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    applyBrightness(data, filters.brightness);
    applyContrast(data, filters.contrast);
    applyExposure(data, filters.exposure);
    applyShadows(data, filters.shadows);
    applyHighlights(data, filters.highlights);
    applySaturation(data, filters.saturation);
    applyHue(data, filters.hue);
    applyWarmth(data, filters.warmth);
    applyVibrance(data, filters.vibrance);
    applySharpness(data, width, height, filters.sharpness);

    ctx.putImageData(imageData, 0, 0);
  };

  // Draw the image with filters and transformations
  const drawImageWithFilters = useCallback(() => {
    if (!image) return; // Avoid drawing if no image is loaded.

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Calculate new dimensions to accommodate rotation
    const absCos = Math.abs(Math.cos((rotation * Math.PI) / 180));
    const absSin = Math.abs(Math.sin((rotation * Math.PI) / 180));
    const rotatedWidth = image.width * absCos + image.height * absSin;
    const rotatedHeight = image.width * absSin + image.height * absCos;

    // Update canvas size
    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2); // Center the image
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw the image
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    // Apply filters
    applyFilters(ctx, canvas.width, canvas.height);

    ctx.restore();

    // Add text overlay
    if (text) {
      ctx.font = "48px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    // Update editedImage for saving
    setEditedImage(canvas.toDataURL());
  }, [image, rotation, filters, text]);

  useEffect(() => {
    if (image) {
      drawImageWithFilters();
    }
  }, [image, drawImageWithFilters]);

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = editedImage;
    link.click();
  };

  // Preset filters
  const applyPresetFilter = (preset) => {
    switch (preset) {
      case "warm":
        setFilters({
          brightness: 100,
          contrast: 100,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 0,
          saturation: 120,
          warmth: 120,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      case "vivid":
        setFilters({
          brightness: 100,
          contrast: 120,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 0,
          saturation: 150,
          warmth: 100,
          vibrance: 150,
          sharpness: 100,
        });
        break;
      case "cool":
        setFilters({
          brightness: 100,
          contrast: 100,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 200,
          saturation: 100,
          warmth: 80,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      case "grayscale":
        setFilters({
          brightness: 100,
          contrast: 100,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 0,
          saturation: 0,
          warmth: 100,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      case "sepia":
        setFilters({
          brightness: 100,
          contrast: 100,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 0,
          saturation: 100,
          warmth: 150,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      case "high-contrast":
        setFilters({
          brightness: 100,
          contrast: 150,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 0,
          saturation: 100,
          warmth: 100,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      case "low-contrast":
        setFilters({
          brightness: 100,
          contrast: 80,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 0,
          saturation: 100,
          warmth: 100,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      case "vintage":
        setFilters({
          brightness: 90,
          contrast: 90,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 30,
          saturation: 80,
          warmth: 120,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      case "dreamy":
        setFilters({
          brightness: 110,
          contrast: 90,
          exposure: 100,
          shadows: 100,
          highlights: 100,
          hue: 0,
          saturation: 120,
          warmth: 100,
          vibrance: 120,
          sharpness: 80,
        });
        break;
      case "dramatic":
        setFilters({
          brightness: 90,
          contrast: 120,
          exposure: 100,
          shadows: 120,
          highlights: 80,
          hue: 0,
          saturation: 100,
          warmth: 100,
          vibrance: 100,
          sharpness: 100,
        });
        break;
      default:
        break;
    }
  };

  const renderAdjustSettings = () => (
    <div className="control-group">
      <h3>Adjust Settings</h3>
      {Object.entries(filters).map(([filter, value]) => (
        <div key={filter} className="filter-control">
          <label className="filter-label">{filter.charAt(0).toUpperCase() + filter.slice(1)}</label>
          <input
            type="range"
            min={filter === "hue" ? "-180" : "0"}
            max={filter === "hue" ? "180" : "200"}
            value={value}
            onChange={(e) => handleFilterChange(filter, e.target.value)}
            className="slider-input"
          />
          <span className="filter-value">{value}{filter === "hue" ? "°" : "%"}</span>
        </div>
      ))}
    </div>
  );

  const renderControlSection = () => {
    if (activeControl === "reset" || activeControl === "crop" || activeControl === "rotate") {
      return null; // Hide controls section
    }

    switch (activeControl) {
      case "filters":
        return (
          <div className="control-group">
            <h3>Preset Filters</h3>
            <div className="preset-filters">
              <button onClick={() => applyPresetFilter("warm")}>Warm</button>
              <button onClick={() => applyPresetFilter("vivid")}>Vivid</button>
              <button onClick={() => applyPresetFilter("cool")}>Cool</button>
              <button onClick={() => applyPresetFilter("grayscale")}>Grayscale</button>
              <button onClick={() => applyPresetFilter("sepia")}>Sepia</button>
              <button onClick={() => applyPresetFilter("high-contrast")}>High Contrast</button>
              <button onClick={() => applyPresetFilter("low-contrast")}>Low Contrast</button>
              <button onClick={() => applyPresetFilter("vintage")}>Vintage</button>
              <button onClick={() => applyPresetFilter("dreamy")}>Dreamy</button>
              <button onClick={() => applyPresetFilter("dramatic")}>Dramatic</button>
            </div>
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
      case "settings":
        return renderAdjustSettings();
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
            onClick={() => {
              setActiveControl("rotate");
              handleRotate();
            }}
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
              setFilters({
                brightness: 100,
                contrast: 100,
                exposure: 100,
                shadows: 100,
                highlights: 100,
                hue: 0,
                saturation: 100,
                warmth: 100,
                vibrance: 100,
                sharpness: 100,
              });
              setText("");
              setActiveControl("reset");
              setRotation(0);
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