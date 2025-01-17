import { QUERY_KEYS } from "@/constants";
import { api } from "@/lib/axios";
import { useQuery } from "react-query";

export const useGetAllUsersQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USERS],
    queryFn: async () => {
      const { data } = await api.get("GetAllBotUsers");
      return data.data;
    },

    keepPreviousData: true,
  });
};

export const useGetDashboardAccountQuery = (tg_id, queryOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT, tg_id],
    queryFn: async () => {
      try {
        const { data } = await api.get("DashboardAccountByTgId", {
          params: {
            tg_id,
          },
        });
        return data.data;
      } catch (error) {
        return null;
      }
    },
    // await superbase
    //   .from("bot_dashboard_users")
    //   .select("id,password,role")
    //   .eq("bot_user_id", bot_user_id)
    //   .throwOnError(),
    ...queryOptions,
  });
};

export const useGetProviderPreferences = (tg_id, queryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROVIDER_BOT_ACCOUNT_PREFERENCES, tg_id],
    queryFn: async () => {
      const { data } = await api.get("GetUserPreferences", {
        params: {
          tg_id,
        },
      });
      return data.data;
    },
    ...queryOptions,
  });
};

export const useGetUserDataForEditingQuery = (tg_id, queryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_DATA_FOR_EDITING, tg_id],
    queryFn: async () => {
      const { data } = await api.get("GetBotUserByTgId", {
        params: { tg_id },
      });
      return data.data;
    },
    ...queryOptions,
  });
};
