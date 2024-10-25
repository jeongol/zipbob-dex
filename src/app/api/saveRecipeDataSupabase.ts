import { createClient } from "@/supabase/server";
import { fetchRecipeData } from "./fetchRecipeData";
// import { v4 as uuidv4 } from "uuid";

export const saveRecipeDataSupabase = async () => {
  const recipeData = await fetchRecipeData();
  console.log("레시피 데이터:", recipeData);

  const saveData = recipeData.COOKRCP01.row.map((recipeData: any) => ({
    user_id: "12fc1c2d-f564-4510-9aac-635b1345b3ca",
    post_id: recipeData.RCP_SEQ,
    recipe_title: recipeData.RCP_NM,
    recipe_ingredients: recipeData.RCP_PARTS_DTLS,
    recipe_img_doing: Array.from(
      { length: 20 },
      (_, index) =>
        recipeData[
          `MANUAL_IMG${String(index + 1)
            .padStart(2, "0")
            .replace(/"/g, "")}`
        ]
    ).filter(Boolean),
    recipe_img_done: recipeData.ATT_FILE_NO_MK?.replace(/"/g, ""),
    recipe_manual: Array.from(
      { length: 20 },
      (_, index) => recipeData[`MANUAL${String(index + 1).padStart(2, "0")}`]
    ).filter(Boolean),
    recipe_type: recipeData.RCP_PAT2,
    recipe_method: recipeData.RCP_WAY2,
    // recipe_level:,
    recipe_kcal: recipeData.INFO_ENG,
    recipe_tip: recipeData.RCP_NA_TIP
  }));
  const serverClient = createClient();

  const { error } = await serverClient.from("MY_RECIPE_TABLE_duplicate").insert(saveData);

  if (error) {
    console.error("저장오류:", error.message);
  } else {
    console.log("저장완");
  }
};

saveRecipeDataSupabase();
