"use client";
import Image from "next/image";
import Comments from "../comments/Comments";
import Likebutton from "../common/button/LikeButton";
import ModifyDeletePost from "./ModifyDeletePost";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeWithUserInfo } from "./fetchRecipeWithUserInfo";
import GrayLine from "@images/myrecipe/grayLine.svg";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import ScrapButton from "../common/button/ScrapButton";
import DefaultProfile from "@images/default-profile.svg";
import UserLevelEmoji from "../mypage/level/UserLevelEmoji";
import DefaultImg from "@images/myrecipe/imageFile.svg";
import { RecipeForm } from "@/types/RecipeWriteFormType";
import RecommendRecipe from "./RecommendRecipe";
import { useStore } from "zustand";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "../common/LoadingSpinner";

interface RecipeDetailViewProps {
  postId: string;
}

const RecipeDetailView = ({ postId }: RecipeDetailViewProps) => {
  const {
    data,
    isPending: isPostPending,
    isError: isPostError
  } = useQuery({
    queryKey: ["recipeWithUser", postId],
    queryFn: () => fetchRecipeWithUserInfo(postId as string),
    enabled: !!postId,
    staleTime: 24 * 60 * 60 * 1000, // 하루
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const { userId } = useStore(useAuthStore);

  if (isPostPending) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (isPostError) {
    return <div>레시피 정보를 가져오는 도중 에러가 발생했습니다</div>;
  }

  if (!data) {
    return <div>레시피 정보를 불러올 수 없습니다.</div>;
  }

  const userInfo = data.USER_TABLE;

  return (
    <div className="flex flex-col items-center justify-center bg-[#FBFBFB] lg:py-8">
      <div className="flex w-full flex-col items-center lg:max-w-[1024px] lg:gap-10">
        {/* 요리 완성 사진 & 설명 */}
        <div className="flex-start flex w-full">
          <div className="relative h-[20rem] w-[20rem] flex-shrink-0 overflow-hidden" style={{ borderRadius: "20px" }}>
            <Image
              src={data.recipe_img_done || DefaultImg}
              alt="완성 이미지"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="rounded-lg"
              loading="lazy"
            />
          </div>

          {/* 오른쪽 컨테이너 */}
          <div className="ml-10 flex w-full flex-grow flex-col gap-2">
            <div className="mt-2 flex h-auto flex-row items-center justify-between">
              <div className="flex">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={data.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={data.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <div>
                <ModifyDeletePost postId={postId} userId={userInfo.user_id} />
              </div>
            </div>
            {/* 레시피 제목 */}
            <div className="flex">
              <h1 className="text-heading-28 text-Gray-900">{data.recipe_title}</h1>
            </div>
            {/* 레시피 설명 */}
            <div className="flex flex-grow">
              <span className="text-body-16 text-Gray-900">{data.recipe_description}</span>
            </div>

            {/* 유저 영역 */}

            <div className="flex-end mt-[20px] flex justify-between gap-x-2">
              {/* 유저 사진 */}

              {userInfo.user_id !== userId ? (
                <div className="flex gap-3 py-2">
                  <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                    <Image
                      src={userInfo.user_img || DefaultProfile}
                      alt={userInfo.user_nickname}
                      width={60}
                      height={60}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  {/* 유저 정보 */}

                  <div className="flex flex-col items-start justify-center gap-x-2 gap-y-2">
                    <div className="flex items-center justify-center">
                      <span className="font-bold">
                        <UserLevelEmoji userRank={userInfo.user_rank} />
                      </span>
                      <span className="text-title-16 text-Gray-900">{userInfo.user_nickname}</span>
                    </div>
                    <span className="flex w-[11.9375rem] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap text-r-body-14 text-Gray-500">
                      {userInfo.user_introduce || "한 줄 소개가 없어요."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex h-auto w-auto items-center justify-center rounded-[2.625rem] border border-Primary-300 px-[1.25rem] py-[0.5rem] text-body-16 text-Primary-300">
                  내가 작성한 레시피
                </div>
              )}

              {/* 좋아요/스크랩 버튼 */}
              <div className="mr-1 flex flex-row items-center justify-center gap-3">
                <Likebutton postId={postId} />
                <ScrapButton postId={postId} />
              </div>
            </div>
          </div>
        </div>

        {/* 재료 목록 */}
        <div className="flex w-full flex-col gap-5 rounded-[18px] bg-Secondary-25 p-5 pb-[24px] pl-[32px] pr-[32px] pt-[20px] text-Gray-900">
          <h1 className="text-heading-24">재료 목록</h1>
          <div className="relative grid grid-cols-2 gap-4 gap-x-8">
            {/* 가운데 세로선 */}
            <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 transform rounded-full bg-Secondary-300"></div>
            {/* 재료 */}
            {data.recipe_ingredients.map((item: RecipeForm, index: number) => (
              <div key={index} className="flex justify-between">
                <span className="text-body-16">{item.ingredient}</span>
                <span className="text-body-16">
                  {item.amount}
                  {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 조리 순서 */}
        <div className="flex w-full flex-col gap-y-6 bg-[#FBFBFB]">
          <div>
            <h1 className="text-heading-24 text-Gray-900">조리 순서</h1>
          </div>
          <div className="flex flex-col gap-y-6">
            {data.recipe_img_doing.map((_: string, index: number) => (
              <div key={index} className="flex gap-x-8">
                {/* 매뉴얼 이미지*/}
                <div
                  className="relative h-[160px] w-[160px] flex-shrink-0 overflow-hidden rounded-lg"
                  style={{ borderRadius: "16px" }}
                >
                  <Image
                    src={
                      data.recipe_img_doing[index] === "/DEFAULT_IMAGE" || data.recipe_img_doing[index] === ""
                        ? DefaultImg
                        : data.recipe_img_doing[index]
                    }
                    alt={`매뉴얼 이미지 ${index + 1}`}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <h2 className="text-title-18 font-bold text-Primary-300" style={{ lineHeight: "135%" }}>
                    Step {index + 1}
                  </h2>
                  <p
                    className="whitespace-pre-wrap text-body-16 font-normal text-Gray-900"
                    style={{ lineHeight: "150%" }}
                  >
                    {data.recipe_manual[index]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-[2rem]">
        <Image src={GrayLine} alt="회색 라인" />
      </div>
      {/* 이 레시피는 어때요 */}
      <div className="flex w-full max-w-[1024px] items-center pb-[1.5rem]">
        <RecommendRecipe />
      </div>
      <div className="mb-12 mt-12">
        <Image src={GrayLine} alt="회색 라인" />
      </div>
      <div className="flex w-full max-w-[1024px] items-center">
        <Comments postId={postId} />
      </div>
    </div>
  );
};

export default RecipeDetailView;
