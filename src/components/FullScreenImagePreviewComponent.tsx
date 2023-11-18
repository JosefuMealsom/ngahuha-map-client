import { useEffect, useRef } from 'react';

export function FullScreenImagePreviewComponent(props: {
  src: string;
  onClose: () => any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // For some reason on some pages this is needed, for instance the
    // plant site form page
    setTimeout(() => {
      node.style.transform = 'translateY(0)';
    }, 0);
    return () => {
      node.style.transform = 'translateY(100%)';
    };
  }, []);

  function onClose() {
    const node = containerRef.current;
    if (node) {
      node.style.transform = 'translateY(100%)';
      setTimeout(() => props.onClose(), 500);
    } else {
      props.onClose();
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-screen h-screen object-contain z-20
       duration-[400ms] ease-in-out translate-y-full"
    >
      <div className="bg-black absolute top-0 left-0 w-full h-full -z-10"></div>
      <img
        src={props.src}
        className="w-full h-full object-contain cursor-pointer"
        onClick={() => onClose()}
      />
    </div>
  );
}
