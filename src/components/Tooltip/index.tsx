import { useState, useRef } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  children: React.ReactNode;
  content: string;
  delay?: number;
};

const Tooltip = ({ children, content, delay = 200 }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={(e) => e.key === "Escape" && hideTooltip()}
      aria-describedby={tooltipId}
      tabIndex={0}
    >
      {children}
      {visible &&
        createPortal(
          <div id={tooltipId} role="tooltip">
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
