let defaultFontSize;

const resizeAsciiArt = () => {
  const asciiElements = document.querySelectorAll('.page .ascii-art');
  let minWidth = Infinity;

  asciiElements.forEach((element) => {
    const parentWidth = element.parentElement.clientWidth;
    let width;

    if (!defaultFontSize) {
      defaultFontSize = parseInt(window.getComputedStyle(element).fontSize, 10);
    } else {
        width = defaultFontSize;
    }

    element.style.fontSize = `${width}px`;

    while (element.scrollWidth > parentWidth && width > 2) {
        console.log(`Resizing ASCII art from ${width}px`);
      width -= 1;
      element.style.fontSize = `${width}px`;
    }
    if (width < minWidth) {
        minWidth = width;
    }
  });

asciiElements.forEach((element) => {
    element.style.fontSize = `${minWidth}px`;
});
}

window.addEventListener('resize', resizeAsciiArt);
window.addEventListener('load', resizeAsciiArt);