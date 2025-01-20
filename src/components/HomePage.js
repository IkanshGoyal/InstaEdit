import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import bear from './assets/bear.png';
import life from './assets/life.webp';
import enjoy from './assets/enjoy.webp';
import snap from './assets/snap.webp';
import wow from './assets/wow.webp';

const HomePage = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".feature-card, .gallery-item")
      .forEach((element) => {
        observer.observe(element);
      });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleTryEditor = () => {
    navigate("/editor");
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{ transform: `scale(${1 - scrollPosition * 0.001})` }}
      >
        <img
          src="/mountain.png"
          alt="Mountain Background"
          className="hero-image"
        />
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div class="card" id="card1">
          Advanced Filters
        </div>
        <div class="card" id="card2">
          Smart Text Placement
        </div>
        <div class="card" id="card3">
          Quick Adjustments
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <div className="gallery-row">
          <img
            src="https://www.textbehindimage.net/_next/image?url=https%3A%2F%2Fcdn.lantaai.com%2Fuse-case%2F0c8172aa-5fe9-491e-9660-ddbfc40b0f3e.jpeg&w=750&q=75"
            className="gallery-img" alt="demo"
          />
          <img
            src={bear} 
            className="gallery-img" alt="demo"
          />
          <img
            src={life}
            className="gallery-img" alt="demo"
          />
        </div>
        <div className="gallery-row">
          <img
            src={enjoy}
            className="gallery-img" alt="demo"
          />
          <img
            src={snap}
            className="gallery-img" alt="demo"
          />
          <img
            src={wow}
            className="gallery-img" alt="demo"
          />
        </div>
      </div>

      <button className="try-editor-btn" onClick={handleTryEditor}>
        Try Editor Now
      </button>
    </div>
  );
};

export default HomePage;
