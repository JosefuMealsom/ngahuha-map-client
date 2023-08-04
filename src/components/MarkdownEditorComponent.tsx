import { useState } from 'react';
import { parse } from 'marked';
import purify from 'dompurify';

export function MarkDownEditorComponent(props: {
  value?: string;
  onSaveHandler: (text: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>(props.value || '');

  function onInputChange(event: React.FormEvent<HTMLDivElement>) {
    const div = event.target as HTMLDivElement;
    setInputValue(div.innerText);
  }

  function togglePreview() {
    setIsEditing(!isEditing);
  }

  function parseMarkdown() {
    const markdown = parse(inputValue, { headerIds: false, mangle: false });

    return purify.sanitize(markdown);
  }

  function renderSaveButton() {
    if (!isEditing) return;

    return (
      <button
        className="border-solid  border px-6 py-2 bg-sky-600
        font-semibold tracking-wide text-white hover:bg-gray-300 cursor-pointer inline-block ml-2 rounded-md"
        onClick={() => props.onSaveHandler(inputValue)}
        data-cy="markdown-save-button"
      >
        Save
      </button>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <div className={isEditing ? 'hidden' : ''}>
          <article
            className="prose"
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(),
            }}
          ></article>
        </div>
        <div className={isEditing ? '' : 'hidden'}>
          <div
            className="w-full p-2 border border-gray-400 rounded-md resize-none"
            onInput={onInputChange}
            contentEditable
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
