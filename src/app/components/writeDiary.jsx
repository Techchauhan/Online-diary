'use client';
import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Modal, Input, FloatButton, Button } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const WriteDiary = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pages, setPages] = useState([
    { content: "", date: new Date() },
    { content: "", date: new Date() },
    { content: "", date: new Date() },
    { content: "", date: new Date() },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [newContent, setNewContent] = useState("");
  const bookRef = useRef(null);

  useEffect(() => {
    setDimensions({
      width: window.innerWidth - 10,
      height: window.innerHeight - 10,
    });
  }, []);

  const showModal = (index) => {
    setCurrentPage(index);
    setNewContent(pages[index].content);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const updatedPages = [...pages];
    updatedPages[currentPage].content = newContent;
    setPages(updatedPages);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const saveDiary = () => {
    const diaryContent = pages.map((page, index) => ({
      pageNumber: index + 1,
      content: page.content,
      date: page.date,
    }));
    console.log("Diary saved:", diaryContent);
    localStorage.setItem("diary", JSON.stringify(diaryContent));
    alert("Diary saved successfully!");
  };

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 px-4 sm:px-6 lg:px-8 relative">
      <HTMLFlipBook
        width={dimensions.width}
        height={dimensions.height}
        startPage={0}
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
        className="my-flipbook w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
        ref={bookRef}
        showPageCorners={false} // Disable corner page-turning
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className="demoPage flex flex-col items-center p-5 relative"
          >
            <div className="text-sm text-gray-500 mb-2">
              {page.date.toLocaleDateString()} {page.date.toLocaleTimeString()}
            </div>
            <div className="flex-grow w-full p-2 border border-gray-300 rounded bg-gray-50">
              {page.content || (
                <span className="text-gray-400 italic">
                  Click the edit button to add content.
                </span>
              )}
            </div>
          </div>
        ))}
      </HTMLFlipBook>

      {/* Left and Right Buttons */}
      <Button
        type="primary"
        shape="circle"
        onClick={prevPage}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10"
      >
        {"<"}
      </Button>
      <Button
        type="primary"
        shape="circle"
        onClick={nextPage}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 z-10"
      >
        {">"}
      </Button>

      {/* Float Button Group */}
      <FloatButton.Group
        shape="square"
        style={{ position: "fixed", bottom: 50, right: 50 }}
      >
        <FloatButton
          icon={<EditOutlined />}
          onClick={() => showModal(currentPage)}
          tooltip="Edit Current Page"
        />
        <FloatButton
          icon={<SaveOutlined />}
          onClick={saveDiary}
          tooltip="Save Diary"
        />
        <FloatButton
          icon={<QuestionCircleOutlined />}
          tooltip="Help"
          onClick={() => alert("Help is under development!")}
        />
        <FloatButton.BackTop visibilityHeight={0} tooltip="Back to Top" />
      </FloatButton.Group>

      <Modal
        title={`Edit Page ${currentPage + 1}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input.TextArea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder={`Write your diary entry here for page ${currentPage + 1}`}
          rows={6}
        />
      </Modal>
    </div>
  );
};

export default WriteDiary;
