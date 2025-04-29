import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gray-500"></div>
    </div>
  );
};
