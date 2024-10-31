import { useEffect, useState } from "react";
import { updateUserRank } from "@/utils/updateUserRank"; // 레벨 랭킹 계산 함수
import { fetchUserProfile } from "@/serverActions/profileAction"; // 유저 정보 받아오기

interface UserRankProps {
  userId: string;
}

const levelEmojis: { [key: number]: string } = {
  0: "🌱",
  1: "🪺",
  2: "🥚",
  3: "🐣",
  4: "🐥",
  5: "🐓"
};

const UserRank: React.FC<UserRankProps> = ({ userId }) => {
  const [userExp, setUserExp] = useState(0);
  const [userRank, setUserRank] = useState(0);

  useEffect(() => {
    const loadRankData = async () => {
      await updateUserRank(userId);
      const updatedProfile = await fetchUserProfile();
      if (updatedProfile) {
        setUserExp(updatedProfile.user_exp);
        setUserRank(updatedProfile.user_rank);
      }
    };
    loadRankData();
  }, [userId]);

  const levelEmoji: string = levelEmojis[userRank] || "🧑🏻‍🍳";
  const progressPercent: number = userExp % 100;

  return (
    <div className="text-center w-full">
      <p className="text-lg">{levelEmoji}</p>
      <div className="w-full bg-orange-300 rounded-full h-2 mt-2">
        <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <p className="mt-2">{progressPercent}/100 경험치</p>
    </div>
  );
};

export default UserRank;
