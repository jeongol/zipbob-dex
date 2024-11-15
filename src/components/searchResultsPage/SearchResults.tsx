"use client";

import React, { useEffect, useState } from "react";
import { Recipe } from "@/types/Recipe";
import { useParams } from "next/navigation";
import browserClient from "@/supabase/client";
// import RecipeCard from "@/components/common/search/ListCard";
import RecipeCard from "@/components/mainPage/RecipeCard";
import SortOptions from "@/components/common/search/SortOptions";
import Pagination from "@/components/common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

import Image from "next/image";
import NoneAlert from "@images/noneAlert.svg";

const SearchResult = () => {
  const { query } = useParams();
  const searchText = decodeURI(query as string);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortOption, setSortOption] = useState<string>("likes");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 16;

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        let request = browserClient.from("MY_RECIPE_TABLE").select("*");

        // 정렬 옵션 적용
        if (sortOption === "likes") {
          request = request.order("like_count", { ascending: false });
        } else if (sortOption === "comment") {
          request = request.order("comment_count", { ascending: false });
        } else if (sortOption === "level") {
          request = request.order("recipe_level", { ascending: false });
        } else if (sortOption === "scraps") {
          request = request.order("scrap_count", { ascending: false });
        }

        const { data, error } = await request;
        if (error) {
          console.error("에러", error);
        } else {
          const filteredData = data.filter((recipe: Recipe) => {
            const titleMatch = recipe.recipe_title.toLowerCase().includes(searchText.toLowerCase());
            const ingredientsMatch = recipe.recipe_ingredients.some((ingredient) =>
              ingredient.ingredient.toLowerCase().includes(searchText.toLowerCase())
            );
            return titleMatch || ingredientsMatch;
          });
          setRecipes(filteredData as Recipe[]);
          setCurrentPage(1);
        }
        setLoading(false);
      };
      fetchResults();
    }
  }, [query, sortOption]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData: Recipe[] = recipes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="mx-auto flex max-w-[1024px] items-center justify-between py-[40px]">
        <p className="text-[20px] font-semibold">
          &quot;{searchText}&quot; 검색어 결과 {recipes.length}개
        </p>
        <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
      </div>
      <section>
        {loading ? (
          <LoadingSpinner />
        ) : recipes.length > 0 ? (
          <div>
            <ul className="mx-auto grid max-w-[1024px] grid-cols-4 gap-x-[16px] gap-y-[28px]">
              {currentData.map((recipe) => (
                <RecipeCard key={recipe.post_id} post={recipe} />
              ))}
            </ul>
            <div className="mb-8 mt-8">
              <Pagination
                currentPage={currentPage}
                pageSize={itemsPerPage}
                totalItems={recipes.length}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          !loading && (
            <div>
              <div className="flex min-h-[50vh] flex-col items-center justify-center">
                <Image src={NoneAlert} width={80} height={80} alt="경고" className="mb-6" />
                <p className="mb-10 w-auto whitespace-nowrap text-center text-[20px] font-semibold">
                  &quot;{searchText}&quot; 키워드와 일치하는 레시피가 없습니다.
                </p>
                <ul className="flex h-[152px] w-[548px] list-disc flex-col items-center justify-center rounded-2xl bg-stone-100 p-4">
                  <h1 className="mb-4 ml-8 self-start text-[18px] font-semibold text-[#ff9143]">검색 Tip!</h1>
                  <li className="ml-8 mt-1 self-start text-[16px] text-stone-500">레시피명을 다시 확인해 주세요!</li>
                  <li className="ml-8 mt-1 self-start text-[16px] text-stone-500">구체적인 키워드를 사용해보세요!</li>
                  <li className="ml-8 mt-1 self-start text-[16px] text-stone-500">
                    키워드를 조합해 레시피를 검색해보세요!
                  </li>
                </ul>
              </div>
              <div className="min-h-[20vh]" />
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default SearchResult;
