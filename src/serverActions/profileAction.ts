import browserClient from "@/supabase/client";

export const getUserId = async (): Promise<string | null> => {
  const { data, error } = await browserClient.auth.getUser();

  if (error) {
    console.log("user 정보 불러오기를 실패했습니다.", error.message);
  }

  const userId = data.user?.id ?? null;
  return userId;
};

export const getUserProfile = async () => {
  const { data } = await browserClient.auth.getUser();

  const userProfile = data.user?.user_metadata.avatar_url ?? null;
  return userProfile;
};
