import React from "react";

interface PageInfoProps {
  title: string;
  description: string;
}

const PageInfo: React.FC<PageInfoProps> = ({ title, description }) => {
  return (
    <div className="m-2 py-6 px-2">
      <h1 className="font-extrabold text-4xl m-2">{title}</h1>
      <p className="font-medium text-sm mx-2">{description}</p>
    </div>
  );
};

export default PageInfo;
