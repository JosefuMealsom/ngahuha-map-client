import { parse } from 'marked';
import purify from 'dompurify';

export const parseMarkdown = (text: string) => {
  const markdownToHtml = parse(text, {
    headerIds: false,
    mangle: false,
  });
  return purify.sanitize(markdownToHtml);
};
