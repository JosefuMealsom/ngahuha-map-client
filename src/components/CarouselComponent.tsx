import { ReactNode, useState } from 'react';

export function CarouselComponent(props: { elements: ReactNode[] }) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const elementsWithUniqueKey = props.elements.map((element) => ({
    key: crypto.randomUUID(),
    element: element,
  }));

  function nextItem() {
    let nextIndex = carouselIndex + 1;

    if (nextIndex === elementsWithUniqueKey.length) {
      nextIndex = 0;
    }
    setCarouselIndex(nextIndex);
  }

  function previousItem() {
    let previousItem = carouselIndex - 1;

    if (previousItem === -1) {
      previousItem = elementsWithUniqueKey.length - 1;
    }
    setCarouselIndex(previousItem);
  }

  function renderSelectedDots() {
    if (elementsWithUniqueKey.length === 1) return;

    return (
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        {elementsWithUniqueKey.map((_element, index) => (
          <div
            className={`${
              carouselIndex !== index ? 'opacity-50' : ''
            } h-2 w-2 rounded-full bottom-5 left-1/2 bg-white inline-block mx-1`}
            key={index}
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {elementsWithUniqueKey[carouselIndex].element}
      <div className="absolute top-0 left-0 w-full h-full">
        {renderSelectedDots()}
      </div>
      <div
        className="absolute top-0 left-0 w-32 h-full"
        onClick={previousItem}
        data-cy="previous-item"
      ></div>
      <div
        className="absolute top-0 right-0 w-32 h-full"
        onClick={nextItem}
        data-cy="next-item"
      ></div>
    </div>
  );
}
