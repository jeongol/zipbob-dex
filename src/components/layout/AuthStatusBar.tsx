"use client";

import { fetchUserProfile } from "@/serverActions/profileAction";
import Image from "next/image";
import { useEffect, useState } from "react";
import DivideIcon from "@images/divide.svg";
import Link from "next/link";
import { useStore } from "zustand";
import { useDropboxStore } from "@/store/dropboxStore";
import { useAuthStore } from "@/store/authStore";
import DefaultProfile from "@images/default-profile.svg";

const AuthStatusBar = () => {
  const [userProfile, setUserProfile] = useState("");
  const { isOpen, setIsOpen } = useStore(useDropboxStore);
  const { isLoggedIn } = useStore(useAuthStore);

  useEffect(() => {
    const getUserProfile = async () => {
      const profileUrl = await fetchUserProfile();
      setUserProfile(profileUrl?.user_img || DefaultProfile);
    };
    getUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div
          className="relative h-[3rem] w-[3rem] cursor-pointer overflow-hidden rounded-full bg-[#d9d9d9]"
          onClick={() => !isOpen && setIsOpen(true)}
        >
          {userProfile && (
            <Image src={userProfile} alt="유저 프로필" fill sizes="3rem" className="rounded-full object-cover" />
          )}
        </div>
      ) : (
        <div className="flex">
          <Link href="/sign-up" className="px-4 py-3 text-body-16 text-Gray-600">
            회원가입
          </Link>
          <div>
            <Image src={DivideIcon} alt="구분선" />
          </div>
          <Link href="/login" className="px-4 py-3 text-body-16 text-Gray-600">
            로그인
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthStatusBar;
