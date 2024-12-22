type StartPosition = "top" | "bottom" | "left" | "right";

export const handleChangePosition = (
  tooltip: HTMLElement,
  parent: HTMLElement,
  startPosition: StartPosition,
  margin: number = 10
) => {
  const reservePixel = 5;

  const parentRect = parent.getBoundingClientRect();
  const parentHeight = parentRect.height;
  const parentWidth = parentRect.width;
  const parentLeft = parentRect.left;
  const parentRight = parentRect.right;
  const parentBottom = parentRect.bottom;
  const parentTop = parentRect.top;

  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  const spaceBottom = window.innerHeight - parentBottom;
  const spaceTop = parentTop;
  const spaceRight = window.innerWidth - parentRight;
  const spaceLeft = parentLeft;

  let x = 0;
  let y = 0;

  switch (startPosition) {
    case "left":
    case "right":
      const differenceHeight = tooltipHeight - parentHeight;
      // Bottom
      if (
        differenceHeight / 2 + reservePixel > spaceTop &&
        spaceBottom > spaceTop
      ) {
        y = parentTop - margin + window.scrollY;
        break;
      }
      // Top
      if (
        differenceHeight / 2 + reservePixel > spaceBottom &&
        spaceTop > spaceBottom
      ) {
        y = parentTop - differenceHeight + margin + window.scrollY;
        break;
      }
      // Center
      y = parentTop - differenceHeight / 2 + window.scrollY;
      break;
    case "top":
    case "bottom":
      const differenceWidth = tooltipWidth - parentWidth;
      // Left
      if (
        differenceWidth / 2 + reservePixel > spaceRight &&
        spaceLeft > spaceRight
      ) {
        x = parentLeft - differenceWidth + margin + window.scrollX;
        break;
      }
      // Right
      if (
        differenceWidth / 2 + reservePixel > spaceLeft &&
        spaceRight > spaceLeft
      ) {
        x = parentLeft - margin + window.scrollX;
        break;
      }
      // Center
      x = parentLeft - differenceWidth / 2 + window.scrollX;
      break;
  }

  switch (startPosition) {
    case "top":
      if (tooltipHeight + reservePixel < spaceTop) {
        y = parentTop - tooltipHeight + window.scrollY;
      } else {
        y = parentBottom + window.scrollY;
      }
      break;
    case "bottom":
      if (tooltipHeight + reservePixel < spaceBottom) {
        y = parentBottom + window.scrollY;
      } else {
        y = parentTop - tooltipHeight + window.scrollY;
      }
      break;
    case "left":
      if (tooltipWidth + reservePixel < spaceLeft) {
        x = parentLeft - tooltipWidth + window.scrollX;
      } else {
        x = parentRight + window.scrollX;
      }
      break;
    case "right":
      if (tooltipWidth + reservePixel < spaceRight) {
        x = parentRight + window.scrollX;
      } else {
        x = parentLeft - tooltipWidth + window.scrollX;
      }
      break;
  }
  tooltip.style.translate = `${x}px ${y}px`;
};
