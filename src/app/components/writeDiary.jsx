'use client';
import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";

const WriteDiary = () => {
  // State to store the width and height
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update the dimensions when the component mounts
  useEffect(() => {
    setDimensions({
      width: window.innerWidth - 10, // Adjust width based on screen size and padding
      height: window.innerHeight - 10, // Adjust height based on screen size and padding
    });
  }, []); // Empty dependency array ensures this effect runs once after mount

  return (
    <div className="flex justify-center items-center mt-10 px-4 sm:px-6 lg:px-8">
      <HTMLFlipBook
        width={dimensions.width} // Use state for dynamic width
        height={dimensions.height} // Use state for dynamic height
        startPage={0} // Optional, set the start page if needed
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
        className="my-flipbook w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
      >
        {/* Sample pages for demonstration */}
        <div className="demoPage">Page 1</div>
        <div className="demoPage">Page 2</div>
        <div className="demoPage">Page 3</div>
        <div className="demoPage">Page 4</div>
      </HTMLFlipBook>
    </div>
  );
};

export default WriteDiary;
