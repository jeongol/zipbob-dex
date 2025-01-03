"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface CustomToastProps {
  message: string;
  onMove: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, onMove }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(onMove, 3000);
    return () => clearTimeout(timer);
  }, [onMove]);

  const handleRedirect = () => {
    onMove();
    router.push("/scraps");
  };

  return (
    <div className="fixed bottom-14 left-1/2 z-30 flex h-11 w-1/2 min-w-[350px] -translate-x-1/2 items-center justify-between space-x-4 rounded-xl bg-[#454443] p-4 text-body-14 text-white">
      <p>{message}</p>
      <button onClick={handleRedirect} className="text-body-14 text-Primary-300">
        스크랩 이동
      </button>
    </div>
  );
};

export default CustomToast;
