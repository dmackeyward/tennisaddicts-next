import React from "react";

// Define icon names as a type for better autocompletion
export type IconName =
  | "tennisball"
  | "home"
  | "menu"
  | "close"
  | "user"
  | "settings"
  | "dashboard"
  | "notification";

// Define the type for icon definitions
type IconDefinition = {
  viewBox: string;
  path: React.ReactNode;
  defaultFill?: string;
  useFillForColor?: boolean; // New flag to use color prop for fill instead of stroke
};

// Icon definitions
const ICONS: Record<IconName, IconDefinition> = {
  // Tennis ball icon
  tennisball: {
    viewBox: "0 0 512 512",
    defaultFill: "currentColor",
    useFillForColor: true,
    path: (
      <>
        <path
          d="M270.53,468.118c-20.387-26.737-29.981-61.49-30.024-98.106c0.026-39.603,11.328-81.828,34.762-119.712
          c23.407-37.842,59.256-71.257,107.614-91.956c26.798-11.484,44.555-23.545,56.125-35.158c8.783-8.861,14.21-17.36,17.721-26.048
          c-4.615-5.815-9.456-11.518-14.65-17.014C359.122-7.682,228.754-23.722,128.422,34.007c-3.702,5.315-7.162,10.716-10.147,16.264
          c-9.577,17.782-15.211,36.435-15.228,56.599c0.026,17.212,4.081,35.823,14.46,56.642c15.47,31.035,23.2,67.479,23.244,103.828
          c-0.026,30.973-5.668,61.956-18.059,89.401c-12.354,27.368-31.88,51.465-59.334,66.244c-0.328,0.173-0.673,0.329-1.001,0.501
          c2.451,2.821,4.935,5.625,7.524,8.37c65.891,69.73,161.652,94.207,248.526,72.447c-3.15-1.216-6.282-2.459-9.258-3.951
          C293.696,492.63,280.712,481.44,270.53,468.118z"
        />
        <path
          d="M481.784,135.264c-8.111,11.441-18.783,22.346-32.398,32.354c-13.701,10.104-30.336,19.438-50.49,28.084
          c-40.482,17.376-69.67,44.735-89.083,76.002c-19.378,31.233-28.688,66.469-28.661,98.306c-0.018,22.087,4.468,42.431,12.51,58.608
          c8.084,16.23,19.336,28.188,33.674,35.383c9.603,4.797,20.793,7.593,34.296,7.61c13.14,0,28.662-2.969,46.254-9.56
          c8.274-6.117,16.298-12.717,23.959-19.964C517.702,360.969,534.975,234.605,481.784,135.264z"
        />
        <path
          d="M100.105,267.34c0.043-30.474-6.747-61.354-18.946-85.65c-12.908-25.771-18.766-51.016-18.749-74.82
          c0-6.894,0.638-13.589,1.553-20.198c-75.046,84.985-84.442,208.725-26.142,303.4c2.113-0.923,4.271-1.803,6.272-2.873
          c12.14-6.548,22.234-15.91,30.56-27.748C91.321,335.879,100.174,302.023,100.105,267.34z"
        />
      </>
    ),
  },
  // Home icon
  home: {
    viewBox: "0 0 24 24",
    path: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />,
  },
  // Menu/hamburger icon
  menu: {
    viewBox: "0 0 24 24",
    path: <path d="M4 6h16M4 12h16M4 18h16" />,
  },
  // Close/X icon
  close: {
    viewBox: "0 0 24 24",
    path: <path d="M18 6L6 18M6 6l12 12" />,
  },
  // User/profile icon
  user: {
    viewBox: "0 0 24 24",
    path: (
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
    ),
  },
  // Settings/gear icon
  settings: {
    viewBox: "0 0 24 24",
    path: (
      <path d="M12 15c1.93 0 3.5-1.57 3.5-3.5S13.93 8 12 8s-3.5 1.57-3.5 3.5S10.07 15 12 15zm0-5c.83 0 1.5.67 1.5 1.5S12.83 13 12 13s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13z" />
    ),
  },
  // Dashboard icon
  dashboard: {
    viewBox: "0 0 24 24",
    path: (
      <path d="M3 3h7v9H3V3zm11 0h7v5h-7V3zm0 9h7v9h-7v-9zm-11 0h7v5H3v-5z" />
    ),
  },
  // Notification bell icon
  notification: {
    viewBox: "0 0 24 24",
    path: (
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
    ),
  },
};

// Define the props interface
interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  fill?: string;
}

// Icon component
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  strokeWidth = 2,
  color = "currentColor",
  className = "",
  fill,
}) => {
  const icon = ICONS[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const { viewBox, path, defaultFill, useFillForColor } = icon;

  // Handle fill vs. stroke based on the icon type
  let finalFill = "none";
  let finalStroke = color;
  let finalStrokeWidth = strokeWidth;

  if (useFillForColor) {
    // For icons like tennis balls that should use fill for coloring
    finalFill = fill || color;
    finalStroke = "none";
    finalStrokeWidth = 0;
  } else if (defaultFill) {
    // For icons with a default fill but no useFillForColor flag
    finalFill = fill !== undefined ? fill : defaultFill;
  } else if (fill) {
    // For explicitly set fill
    finalFill = fill;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill={finalFill}
      stroke={finalStroke}
      strokeWidth={finalStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {path}
    </svg>
  );
};

export default Icon;
