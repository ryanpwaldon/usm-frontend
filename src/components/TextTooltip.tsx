import type { FC, ReactNode } from "react";
import { useState } from "react";
import { BaseText } from "./Texts";

const Text = ({ children }: { children: ReactNode }) => (
  <BaseText font="font-roboto" color="text-slateus-300" size="text-xs">
    {children}
  </BaseText>
);

const HoverTooltip: FC<{
  align?: "right" | "left";
  customAlign?: string;
  position?: "top" | "bottom";
  children: ReactNode;
  text: string | undefined;
}> = ({
  align = "right",
  children,
  customAlign,
  position = "bottom",
  text,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (text === undefined) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative"
      onMouseOver={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          absolute right-0 z-20 w-72
          overflow-visible
          rounded-lg border
          border-slateus-400 bg-slateus-700
          p-3 leading-4
          ${
            customAlign !== undefined
              ? customAlign
              : align === "right"
              ? "right-0"
              : "left-0"
          }
          ${position === "top" ? "bottom-8" : "top-8"}
          ${showTooltip ? "visible" : "hidden"}
        `}
      >
        <Text>{text}</Text>
      </div>
      {children}
    </div>
  );
};

export default HoverTooltip;
