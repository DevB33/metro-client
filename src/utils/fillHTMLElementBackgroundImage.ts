const fillHTMLElementBackgroundImage = (element: HTMLElement, left: number, right: number) => {
  element.style.backgroundImage = `linear-gradient(to right,
        transparent ${left}px,
        lightblue ${left}px,
        lightblue ${right}px,
        transparent ${right}px)`;
};

export default fillHTMLElementBackgroundImage;
