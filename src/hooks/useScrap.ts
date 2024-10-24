import { supabase } from "@/supabase/supabase";
import { useEffect, useState } from "react";

const MOCK_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

export const useScrap = () => {
  const [folderName, setFolderName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [existingFolders, setExistingFolders] = useState<string[]>([]);

  // 레시피 스크랩 함수
  const saveScrap = async (recipeId: string) => {
    setIsSaving(true);

    // 새 폴더와 레시피를 저장
    const { error } = await supabase.from("SCRAP_TABLE").insert({
      user_id: MOCK_USER_ID,
      scrap_id: crypto.randomUUID(),
      folder_name: folderName,
      scraped_recipe: recipeId,
      created_at: new Date(),
      updated_at: new Date()
    });

    if (error) {
      console.error("스크랩 저장 오류:", error.message);
    } else {
      alert("스크랩이 저장되었습니다.");
    }

    setIsSaving(false);
  };

  const fetchFolders = async () => {
    const { data, error } = await supabase.from("SCRAP_TABLE").select("folder_name").eq("user_id", MOCK_USER_ID);

    if (error) {
      console.error("폴더 목록 불러오기 오류:", error.message);
    } else if (data) {
      // 중복된 폴더 이름 제거
      const uniqueFolders = Array.from(new Set(data.map((item) => item.folder_name)));
      setExistingFolders(uniqueFolders);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folderName,
    setFolderName,
    isSaving,
    saveScrap,
    existingFolders
  };
};
