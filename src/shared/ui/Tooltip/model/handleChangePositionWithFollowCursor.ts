import throttle from 'lodash/throttle'

export const handleChangePositionWithFollowCursor = (
  tooltip: HTMLElement,
  event: MouseEvent,
  offset: number = 20,
  margin: number = 20,
) => {
  const { clientX, clientY } = event;
  
  const tooltipWidth = tooltip.offsetWidth;
  const halfTooltipWidth = tooltipWidth / 2
  const tooltipHeight = tooltip.offsetHeight;

  let x = clientX + window.scrollX - halfTooltipWidth;
  let y = clientY + window.scrollY + offset;

  if (clientY + offset + tooltipHeight > window.innerHeight) {
    y = clientY + window.scrollY - tooltipHeight - offset;
  }
  if (clientX + margin + halfTooltipWidth >= window.innerWidth) {
    x = window.innerWidth - tooltipWidth - margin + window.scrollX;
  }
  if (clientX <= halfTooltipWidth + margin) {
    x = margin + window.scrollX
  }

  tooltip.style.translate = `${x}px ${y}px`
};

export const throttleHandleChangePositionWithFollowCursor = throttle(handleChangePositionWithFollowCursor, 10)