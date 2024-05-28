import React, { useState, useEffect } from 'react';

const imagePaths = [
  'images/1.jpg',
  'images/2.jpg',
  'images/3.jpg',
  'images/4.jpg',
  'images/5.jpg',
  'images/6.jpg',
  'images/7.jpg',
];

function Dashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % imagePaths.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="slideshow-container">
        {imagePaths.map((image, index) => (
          <div
            className="slide"
            style={{
              display: currentIndex === index ? 'block' : 'none',
            }}
            key={index}
          >
            <img src={image} alt={`Slide ${index + 1}`} style={{ width: '100%' }} />
          </div>
        ))}
        <button className="prev" onClick={() => setCurrentIndex((currentIndex - 1 + imagePaths.length) % imagePaths.length)}>&#10094;</button>
        <button className="next" onClick={() => setCurrentIndex((currentIndex + 1) % imagePaths.length)}>&#10095;</button>
      </div>

      <style jsx>{`
        .slideshow-container {
          position: relative;
          max-width: 60%;
          margin: auto;
        }
        .slide {
          display: none;
        }
        .prev, .next {
          cursor: pointer;
          position: absolute;
          top: 50%;
          padding: 16px;
          color: white;
          font-weight: bold;
          font-size: 18px;
          transition: 0.6s ease;
          user-select: none;
          background: none;
          border: none;
        }
        .next {
          right: 0;
          border-radius: 3px 0 0 3px;
        }
        .prev {
          left: 0;
          border-radius: 0 3px 3px 0;
        }
        .prev:hover, .next:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
