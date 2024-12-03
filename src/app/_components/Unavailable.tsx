"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import SadFaceIcon from "@/app/_components/icon/SadFaceIcon";

interface UnavailableProps {
  buttonText: string;
  routePath: string;
  children: React.ReactNode;
}

const Unavailable: React.FC<UnavailableProps> = ({ buttonText, routePath, children }) => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-[40vh] text-center">
      <div>
        <div className="text-gray-500 mx-auto">
          <SadFaceIcon />
        </div>
        {children}
        <Button color="primary" onPress={() => router.push(routePath)}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default Unavailable;
