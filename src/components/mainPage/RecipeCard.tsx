"use client";

import { useUserNickname } from "@/serverActions/profileAction";
import Image from "next/image";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import { RecipeCardProps } from "@/types/main";
import { useRouter } from "next/navigation";
import LikeButton from "../common/button/LikeButton";
import ScrapButton from "../common/button/ScrapButton";
import TrashCanIcon from "@images/myrecipe/trashCan.svg";
import DefaultImage from "@images/myrecipe/imageFile.svg";

interface ExtendedRecipeCardProps extends RecipeCardProps {
  isEditMode?: boolean;
  onDelete?: (postId: string) => void;
}

const RecipeCard = ({ post, isEditMode = false, onDelete }: ExtendedRecipeCardProps) => {
  const { data: nickname } = useUserNickname(post.user_id);
  const router = useRouter();

  return (
    <div
      className="flex cursor-pointer flex-col gap-3 rounded-[1.25rem] bg-white p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]"
      onClick={() => router.push(`/myrecipedetail/${post.post_id}`)}
    >
      <div className="relative h-[13.25rem] w-[13.25rem] overflow-hidden">
        <Image
          src={post.recipe_img_done || DefaultImage}
          alt="레시피 사진"
          fill
          sizes="13.25rem"
          className="rounded-[1.25rem] object-cover"
          loading="lazy"
        />
      </div>
      <div className="text-start">
        <p className="text-title-16 text-Gray-900">{post.recipe_title}</p>
        <p className="mt-1 text-body-13 text-gray-500">{nickname}</p>
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <Image src={FireFilledIcon} alt="레시피 난이도" className="h-auto w-auto" />
          <Image
            src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-auto w-auto"
          />
          <Image
            src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-auto w-auto"
          />
        </div>

        {/* 편집 모드 아닐 때 -> LikeButton / ScrapButton 활성화 */}
        {!isEditMode ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <LikeButton postId={post.post_id} />
            <ScrapButton postId={post.post_id} />
          </div>
        ) : (
          // 편집모드일 떄 -> 휴지통모양 생성
          onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(post.post_id);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <Image src={TrashCanIcon} alt="삭제 아이콘" width={20} height={20} />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
