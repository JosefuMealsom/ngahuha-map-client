import { useEffect, useRef, useState } from 'react';
import { parseMarkdown } from '../utils/markdown-parser.util';

export function MarkDownEditorComponent(props: {
  value?: string;
  className?: string;
  onChangeHandler: (text: string) => void;
}) {
  const textAreaInputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [inputValue, setInputValue] = useState<string>(props.value || '');

  function onInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value);
    props.onChangeHandler(inputValue);
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
      <div
        className="border inline-block py-1.5 text-sm px-4 font-bold cursor-pointer
        rounded-full mb-2 bg-[#002D04] text-white border-[#002D04]"
        onClick={togglePreview}
        data-cy="markdown-toggle-edit"
      >
        {isEditing ? 'Preview' : 'Edit'}
      </div>
    </div>
  );
}
