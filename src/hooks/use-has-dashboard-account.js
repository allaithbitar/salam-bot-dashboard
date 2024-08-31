import { useGetDashboardAccountQuery } from "./queries";

export const useHasDashboardAccount = (tg_id, queryOptions) => {
  const {
    data,
    isLoading: isLoadingDashboardAccount,
    isFetching: isFetchingDashboardAccount,
  } = useGetDashboardAccountQuery(tg_id, queryOptions);
  const dashboardAccount = data?.data?.[0];

  const hasDashboardAccount = Boolean(dashboardAccount);

  return {
    dashboardAccount,
    hasDashboardAccount,
    isLoadingDashboardAccount,
    isFetchingDashboardAccount,
  };
};
