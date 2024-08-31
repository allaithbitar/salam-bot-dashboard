import { QUERY_KEYS } from "@/constants";
import { superbase } from "@/lib/superbase";
import { useQuery } from "react-query";

export const useGetAllUsersQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USERS],
    queryFn: async () =>
      await superbase
        .from("bot_users")
        .select(
          "*,bot_user_preferences ( nickname, will_to_provide, user_type)",
          {
            count: "exact",
          },
        )
        .order("created_at", { ascending: false })
        .throwOnError(),
    // .or(
    //           `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`,
    //         )

    // .range(pageSize * pageIndex, (pageIndex * pageIndex) / 1 + pageSize)
    keepPreviousData: true,
  });
};

export const useGetDashboardAccountQuery = (bot_user_id, queryOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT, bot_user_id],
    queryFn: async () =>
      await superbase
        .from("bot_dashboard_users")
        .select("id,password,role")
        .eq("bot_user_id", bot_user_id)
        .throwOnError(),
    ...queryOptions,
  });
};

export const useGetProviderPreferences = (bot_user_id, queryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROVIDER_BOT_ACCOUNT_PREFERENCES, bot_user_id],
    queryFn: async () =>
      await superbase
        .from("bot_user_preferences")
        .select("nickname,will_to_provide")
        .eq("user", bot_user_id)
        .throwOnError(),
    ...queryOptions,
  });
};

export const useGetUserDataForEditingQuery = (bot_user_id, queryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_DATA_FOR_EDITING, bot_user_id],
    queryFn: async () =>
      await superbase
        .from("bot_users")
        .select(
          "*,bot_user_preferences ( nickname, will_to_provide, user_type)",
        )
        .eq("tg_id", bot_user_id)
        .throwOnError(),
    ...queryOptions,
  });
};
