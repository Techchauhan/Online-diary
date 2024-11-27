'use client';
import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Modal, Button, FloatButton } from "antd";
import { EditOutlined, SaveOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css"; // Import Draft.js styles

const WriteDiary = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pages, setPages] = useState([
    { content: EditorState.createEmpty(), date: new Date() },
    { content: EditorState.createEmpty(), date: new Date() },
    { content: EditorState.createEmpty(), date: new Date() },
    { content: EditorState.createEmpty(), date: new Date() },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [editorFocus, setEditorFocus] = useState(false);
  const bookRef = useRef(null);

  useEffect(() => {
    setDimensions({
      width: window.innerWidth - 10,
      height: window.innerHeight - 10,
    });
  }, []);

  const showModal = (index) => {
    setCurrentPage(index);
    setIsModalOpen(true);
  };

  const handleEditorChange = (editorState) => {
    const updatedPages = [...pages];
    updatedPages[currentPage].content = editorState;
    setPages(updatedPages);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const saveDiary = () => {
    const diaryContent = pages.map((page, index) => ({
      pageNumber: index + 1,
      content: pages[index].content.getCurrentContent().getPlainText(),
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

  // Define the custom style map for font color and background color
  const styleMap = {
    BOLD: {
      fontWeight: 'bold',
    },
    COLOR: {
      color: 'red', // Default font color, you can change this dynamically
    },
    BG_COLOR: {
      backgroundColor: 'yellow', // Default background color, you can change this dynamically
    },
  };

  const toggleInlineStyle = (style) => {
    const updatedPages = [...pages];
    const currentEditorState = pages[currentPage].content;
    updatedPages[currentPage].content = RichUtils.toggleInlineStyle(currentEditorState, style);
    setPages(updatedPages);
  };

  const handleKeyCommand = (command) => {
    const updatedPages = [...pages];
    const currentEditorState = pages[currentPage].content;
    const newState = RichUtils.handleKeyCommand(currentEditorState, command);
    if (newState) {
      updatedPages[currentPage].content = newState;
      setPages(updatedPages);
      return "handled";
    }
    return "not-handled";
  };

  const handleFocus = () => {
    setEditorFocus(true);
  };

  const handleBlur = () => {
    setEditorFocus(false);
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
        showPageCorners={false}
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
              <Editor
                editorState={page.content}
                readOnly={false}
                handleKeyCommand={handleKeyCommand}
                customStyleMap={styleMap} // Pass the customStyleMap to the editor
                onChange={handleEditorChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={editorFocus ? "" : "Write here..."} // Hint when not focused
              />
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
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div>
          <div className="flex space-x-2 mb-3">
            <Button onClick={() => toggleInlineStyle("BOLD")}>Bold</Button>
            <Button onClick={() => toggleInlineStyle("COLOR")}>Font Color</Button>
            <Button onClick={() => toggleInlineStyle("BG_COLOR")}>
              Background Color
            </Button>
          </div>
          <Editor
            editorState={pages[currentPage].content}
            onChange={handleEditorChange}
            handleKeyCommand={handleKeyCommand} // Handle key commands like backspace
            customStyleMap={styleMap} // Pass the customStyleMap to the editor
          />
        </div>
      </Modal>
    </div>
  );
};

export default WriteDiary;
