import { QUERY_KEYS } from "@/constants";
import { encrypt } from "@/lib/crypto-js";
import { superbase } from "@/lib/superbase";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateUserPreferencesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tg_id, ...rest }) =>
      superbase
        .from("bot_user_preferences")
        .update(rest)
        .eq("user", tg_id)
        .throwOnError(),
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

export const useUpdateUserFirstNameLastNameUsername = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ first_name, last_name, username, tg_id }) =>
      superbase
        .from("bot_users")
        .update({
          first_name,
          last_name,
          username,
        })
        .eq("tg_id", tg_id)
        .throwOnError(),
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.GET_ALL_USERS),
  });
};

export const useGenerateDashboardAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bot_user_id, password }) =>
      await superbase
        .from("bot_dashboard_users")
        .insert({
          bot_user_id,
          password,
        })
        .throwOnError(),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries([
        QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT,
        variables.bot_user_id,
      ]),
  });
};

export const useUpdateDashboardAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bot_user_id, ...rest }) =>
      await superbase
        .from("bot_dashboard_users")
        .update(rest)
        .eq("bot_user_id", bot_user_id)
        .throwOnError(),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries([
        QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT,
        variables.bot_user_id,
      ]),
  });
};

export const useDashboardLoginMutation = () => {
  return useMutation({
    mutationFn: async ({ nickname, password }) => {
      const { data: userData } = await superbase
        .from("bot_user_preferences")
        .select("user")
        .eq("nickname", nickname)
        .throwOnError();

      const botUserId = userData[0]?.user;

      if (!botUserId) {
        throw new Error(
          "لم يتم العثور على المستخدم رجاء قم بالتحقق من الاسم المستعار",
        );
      }

      const encryptedPassword = encrypt(password);

      const { data: passwordData } = await superbase
        .from("bot_dashboard_users")
        .select("id,password,role")
        .eq("bot_user_id", botUserId)
        .throwOnError();
      const storedEncryptedPassword = passwordData[0].password;
      const dashboardUserId = passwordData[0].id;
      const role = passwordData[0].role;

      if (storedEncryptedPassword !== encryptedPassword) {
        throw new Error("كلمة المرور غير صحيحة");
      }

      return { botUserId, dashboardUserId, role };
    },
  });
};

export const useDeleteDashboardAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bot_user_id }) =>
      await superbase
        .from("bot_dashboard_users")
        .delete()
        .eq("bot_user_id", bot_user_id)
        .throwOnError(),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries([
        QUERY_KEYS.GET_DASHBOARD_USER_ACCOUNT,
        variables.bot_user_id,
      ]),
  });
};
