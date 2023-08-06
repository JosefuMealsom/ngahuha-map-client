import { useEffect, useRef, useState } from 'react';
import { parseMarkdown } from '../utils/markdown-parser.util';

export function MarkDownEditorComponent(props: {
  value?: string;
  className?: string;
  onSaveHandler: (text: string) => void;
}) {
  const textAreaInputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>(props.value || '');

  function onInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value);
  }

  function resizeTextArea() {
    if (textAreaInputRef.current) {
      const scrollY = containerRef.current?.scrollTop;

      textAreaInputRef.current.style.height = 'auto';
      textAreaInputRef.current.style.height = `${textAreaInputRef.current?.scrollHeight}px`;

      // Scroll position gets lost when we calculate the height
      // of the text area above; so store the scroll position and then scroll
      containerRef.current?.scroll({
        top: scrollY,
      });
    }
  }

  useEffect(() => {
    resizeTextArea();
  }, [inputValue, isEditing]);

  function togglePreview() {
    setIsEditing(!isEditing);
  }

  function onSave() {
    props.onSaveHandler(inputValue);
    setIsEditing(false);
  }

  function renderSaveButton() {
    if (!isEditing) return;

    return (
      <button
        className="border-solid  border px-6 py-2 bg-sky-600
        font-semibold tracking-wide text-white hover:bg-gray-300 cursor-pointer inline-block ml-2 rounded-md"
        onClick={onSave}
        data-cy="markdown-save-button"
      >
        Save
      </button>
    );
  }

  return (
    <div className={props.className} ref={containerRef}>
      <div className="mb-3">
        <div className={isEditing ? 'hidden' : ''}>
          <article
            className="prose max-width-character"
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(inputValue),
            }}
          ></article>
        </div>
        <div className={isEditing ? '' : 'hidden'}>
          <textarea
            ref={textAreaInputRef}
            className="w-full p-2 border border-gray-400 rounded-md resize-none overflow-hidden"
            onChange={onInputChange}
            value={inputValue}
            data-cy="markdown-content-input"
          />
        </div>
      </div>
      <button
        className="border-solid border-black bg-white border p-2 hover:bg-gray-300 cursor-pointer mb-2 rounded-md inline-block"
        onClick={togglePreview}
        data-cy="markdown-toggle-edit"
      >
        {isEditing ? 'Preview' : 'Edit'}
      </button>
      {renderSaveButton()}
    </div>
  );
}
