import { useGetDashboardAccountQuery } from "./queries";

export const useHasDashboardAccount = (tg_id, queryOptions) => {
  const {
    data: dashboardAccount,
    isLoading: isLoadingDashboardAccount,
    isFetching: isFetchingDashboardAccount,
  } = useGetDashboardAccountQuery(tg_id, queryOptions);

  const hasDashboardAccount = Boolean(dashboardAccount);

  return {
    dashboardAccount,
    hasDashboardAccount,
    isLoadingDashboardAccount,
    isFetchingDashboardAccount,
  };
};
