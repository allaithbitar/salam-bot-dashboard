import { QUERY_KEYS } from "@/constants";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateUserPreferencesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tg_id, ...rest }) =>
      api.put("UpdateUserPreferences", {
        tg_id,
        preferences: rest,
      }),
    onSuccess: async (_, vars) => {
      await queryClient.invalidateQueries([
        QUERY_KEYS.GET_USER_DATA_FOR_EDITING,
        vars.tg_id,
      ]);
      await queryClient.invalidateQueries([
        QUERY_KEYS.GET_PROVIDER_BOT_ACCOUNT_PREFERENCES,
        vars.tg_id,
      ]);
      await queryClient.invalidateQueries(QUERY_KEYS.GET_ALL_USERS);
    },
  });
};

export const useGenerateDashboardAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tg_id }) =>
      api.post("CreateDashboardAccount", {
        tg_id,
      }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries([
        QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT,
        variables.tg_id,
      ]),
  });
};

export const useUpdateDashboardAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tg_id, ...rest }) =>
      // UpdateDashboardAccount
      api.put("UpdateDashboardAccount", {
        tg_id,
        properties: rest,
      }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries([
        QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT,
        variables.tg_id,
      ]),
  });
};

export const useDashboardLoginMutation = () => {
  return useMutation({
    mutationFn: async ({ nickname, password }) => {
      const { data } = await api.post("LoginDashboard", { nickname, password });
      return data.data;
    },
  });
};

export const useDeleteDashboardAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tg_id }) =>
      api.delete("DeleteDashboardAccount", {
        params: {
          tg_id,
        },
      }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries([
        QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT,
        variables.tg_id,
      ]),
  });
};

export const useValidateAuthTokenMutation = () => {
  return useMutation({
    mutationFn: async (token) => {
      const { data } = await api.get("ValidateDashboardAccountAuthToken", {
        params: {
          token,
        },
      });
      return data.data;
    },
  });
};
