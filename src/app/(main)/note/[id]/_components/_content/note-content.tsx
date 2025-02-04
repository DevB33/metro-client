'use client';

import { useRef, useState, useEffect } from 'react';
import { css } from '@/../styled-system/css';

const noteContentContainer = css({
  boxSizing: 'border-box',
  paddingTop: 'tiny',
  display: 'flex',
  flex: '1 0 auto',
  width: 'full',
  minHeight: 'full',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  resize: 'none',
  _placeholder: { color: 'gray' },
  fontSize: 'md',
});

const menuContainer = css({
  position: 'absolute',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  zIndex: 10,
});

const menuItem = css({
  padding: '10px',
  cursor: 'pointer',
  _hover: { backgroundColor: 'gray.100' },
});

const options = ['text', 'heading 1', 'heading 2', 'heading 3', 'list', 'quote', 'code'];

// 커서 위치를 반환하는 함수
const getCursorPosition = (textarea: HTMLTextAreaElement) => {
  const { selectionStart } = textarea;

  const textBeforeCursor = textarea.value.slice(0, selectionStart);

  const lines = textBeforeCursor.split('\n');
  const row = lines.length - 1; // 현재 커서가 위치한 줄 번호
  const col = lines[row]?.length || 0; // 현재 줄에서 커서 위치한 열 번호

  return { row, col };
};

// 커서 위치를 화면 기준으로 변환하는 함수
const getDropdownPosition = (textarea: HTMLTextAreaElement) => {
  const { row, col } = getCursorPosition(textarea);

  const lineHeight = 20; // 텍스트 줄 높이 (px, 보통 fontsize의 1.5배)
  const charWidth = 8; // 한 문자 폭 (px, 보통 fontsize의 0.5배)

  const textareaRect = textarea.getBoundingClientRect();

  console.log(row, col);
  console.log(window.scrollY, window.scrollX);
  const top = textareaRect.top + window.scrollY + row * lineHeight + lineHeight * 2; // 커서 바로 밑 위치
  const left = textareaRect.left + window.scrollX + col * charWidth; // 커서 열 위치

  return { top, left };
};

const NoteContent = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (!textAreaRef.current) return;

    const value = textAreaRef.current.value;
    const cursorPosition = textAreaRef.current.selectionStart;
    setInputValue(value);

    // 텍스트 영역 높이 자동 조절
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }

    const match = /(?:^|\s)\/(\w*)$/.exec(value.slice(0, cursorPosition));

    if (match) {
      const keyword = match[1];
      const { top, left } = getDropdownPosition(textAreaRef.current);
      setDropdownPosition({ top, left });
      setFilteredOptions(
        options.filter(option => option.toLowerCase().includes(keyword.toLowerCase())),
      );
      setIsMenuVisible(true);
    } else {
      setIsMenuVisible(false);
    }

    // if (textAreaRef.current) {
    //   const cursorPosition = textAreaRef.current.selectionStart;
    //   const textareaRect = textAreaRef.current.getBoundingClientRect();

    //   // 현재 커서 주변 텍스트를 추출
    //   const beforeCursor = value.slice(0, cursorPosition);
    //   console.log(beforeCursor);
    //   const match = /(?:^|\s)\/(\w*)$/.exec(beforeCursor); // `/`로 시작하는 단어 찾기

    //   if (match) {
    //     const keyword = match[1];
    //     const lineHeight = 16; // 줄 높이
    //     const row = beforeCursor.split('\n').length - 1;
    //     const col = beforeCursor[row]?.length || 0;

    //     const top = textareaRect.top + window.scrollY + row * lineHeight + 32;
    //     const left = textareaRect.left + col * 8; // 문자 너비 기반 계산

    //     setMenuPosition({ top, left });
    //     setFilteredOptions(
    //       options.filter(option => option.toLowerCase().includes(keyword.toLowerCase())),
    //     );
    //     setIsMenuVisible(true);
    //   } else {
    //     setIsMenuVisible(false);
    //   }
    // }
  };

  const handleOptionSelect = (option: string) => {
    console.log(`Selected: ${option}`);
    setSelectedOption(option);
    setInputValue(prev => prev.replace('/', '') + option);
    setIsMenuVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (options.length === 0) return;

    if (!isMenuVisible) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prevIndex => (prevIndex + 1) % options.length); // 아래로 이동
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prevIndex => (prevIndex === 0 ? options.length - 1 : prevIndex - 1)); // 위로 이동
        break;

      case 'Enter':
        e.preventDefault();
        handleOptionSelect(options[focusedIndex]); // 현재 포커스된 항목 선택
        break;

      case 'Escape':
        e.preventDefault();
        handleOptionSelect(''); // 드롭다운 닫기 (선택 취소)
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    // 드롭다운이 뜨면 포커스 설정
    if (dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, []);

  return (
    <>
      <textarea
        ref={textAreaRef}
        className={noteContentContainer}
        onInput={handleInput}
        value={inputValue}
        onKeyDown={handleKeyDown}
        placeholder="글을 작성하거나 AI를 사용하려면 '스페이스' 키를, 명령어를 사용하려면 '/' 키를 누르세요."
      />
      {isMenuVisible && (
        <div
          className={menuContainer}
          ref={dropdownRef}
          tabIndex={-1}
          style={{
            top: dropdownPosition?.top,
            left: dropdownPosition?.left,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                style={{
                  padding: '8px',
                  backgroundColor: focusedIndex === index ? '#e0e0e0' : 'white', // 포커스된 항목 강조
                  cursor: 'pointer',
                }}
                className={menuItem}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className={menuItem}>No results</div>
          )}
        </div>
      )}
    </>
  );
};

export default NoteContent;
