import LoadingOverlay from "@/components/shared/loading-overlay.component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DASHBOARD_USER_ROLE } from "@/constants";
import {
  validateNewPassword,
  validateUserPreferences,
} from "@/constants/validators";
import { useUserContext } from "@/context/user/user.context";
import { withRole } from "@/HOCs/with-role";
import {
  useUpdateDashboardAccountMutation,
  useUpdateUserPreferencesMutation,
} from "@/hooks/mutations";
import {
  useGetDashboardAccountQuery,
  useGetProviderPreferences,
} from "@/hooks/queries";
import useReducerState from "@/hooks/use-reducer-state";
import { decrypt, encrypt } from "@/lib/crypto-js";
import {
  isDuplicateNicknameError,
  transformNickname,
  transformPassword,
} from "@/lib/helpers";
import { useEffect, useRef, useState } from "preact/hooks";

const ProviderPreferencesForm = ({
  providerData,
  setProviderData,
  providerServerSidePreferences,
  providerServerSideDashboardAccountData,
  isRefetchingData,
}) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [errors, setErrors] = useState(null);
  const originalDecryptedPassword = useRef(
    decrypt(providerServerSideDashboardAccountData.password),
  );
  const [decryptedPassword, setDecryptedPassword] = useState(
    decrypt(providerServerSideDashboardAccountData.password),
  );

  const {
    mutateAsync: updateUserPreferencesAsync,
    isLoading: isUpdatingUserPreferences,
  } = useUpdateUserPreferencesMutation();

  const {
    mutateAsync: updateDashboardAccountAsync,
    isLoading: isUpdatingDashboardAccount,
  } = useUpdateDashboardAccountMutation();

  const didChangeThePassword =
    originalDecryptedPassword.current !== decryptedPassword;

  const didChangeNickname =
    providerServerSidePreferences.nickname !== providerData.nickname;

  const didChangeWillToProvide =
    providerServerSidePreferences.will_to_provide !==
    providerData.will_to_provide;

  const disableInputs =
    isUpdatingDashboardAccount || isUpdatingUserPreferences || isRefetchingData;

  const disableSaveButton =
    (!didChangeNickname && !didChangeWillToProvide && !didChangeThePassword) ||
    isUpdatingDashboardAccount ||
    isUpdatingUserPreferences ||
    isRefetchingData;

  const handleSave = async () => {
    try {
      setErrors(null);
      if (didChangeNickname || didChangeWillToProvide) {
        const _errors = validateUserPreferences(providerData);
        if (_errors) {
          setErrors(_errors);
          return;
        }
        await updateUserPreferencesAsync({
          ...providerData,
          tg_id: user.botUserId,
          will_to_provide: Number(providerData.will_to_provide),
        });
      }
      if (didChangeThePassword) {
        const _passwordError = validateNewPassword(decryptedPassword);
        if (_passwordError) {
          setErrors({
            password: _passwordError,
          });
          return;
        }
        const encryptedPassword = encrypt(decryptedPassword);
        await updateDashboardAccountAsync({
          bot_user_id: user.botUserId,
          password: encryptedPassword,
        });
        originalDecryptedPassword.current = decryptedPassword;
      }
      toast({
        variant: "success",
        title: "تم حفظ التعديلات",
      });
    } catch (error) {
      let details = error.message;
      if (isDuplicateNicknameError(error))
        details = "الاسم المستعار مستخدم من قبل مستخدم اخر";
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: details,
      });
    }
  };

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="nickname">الاسم المستعار</Label>
          <Input
            disabled={disableInputs}
            value={providerData.nickname}
            onInput={(e) => {
              e.target.value = transformNickname(e.target.value);
              return setProviderData({ nickname: e.target.value });
            }}
          />
          {errors?.nickname && (
            <small className="text-red-500">{errors.nickname}</small>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="will_to_provide"> الاولوية في تقديم الرعاية</Label>
          <Select
            disabled={disableInputs}
            value={String(providerData.will_to_provide)}
            onValueChange={(v) =>
              setProviderData({
                will_to_provide: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              ref={(ref) => {
                if (!ref) return;
                ref.ontouchstart = (e) => {
                  e.preventDefault();
                };
              }}
            >
              <SelectItem value={"1"}>1</SelectItem>
              <SelectItem value={"2"}>2</SelectItem>
              <SelectItem value={"3"}>3</SelectItem>
              <SelectItem value={"4"}>4</SelectItem>
              <SelectItem value={"5"}>5</SelectItem>
            </SelectContent>
          </Select>
          <small className="text-muted-foreground">
            قيمة اعلى = فرصة اكبر لربطك مع مستفيد
          </small>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password">كلمة المرور :</Label>
          <Input
            disabled={disableInputs}
            id="password"
            value={decryptedPassword}
            onInput={(e) => {
              e.target.value = transformPassword(e.target.value);
              return setDecryptedPassword(e.target.value);
            }}
          />
          {errors?.password && (
            <small className="text-red-500">{errors.password}</small>
          )}
        </div>

        <Button disabled={disableSaveButton}>
          {isUpdatingUserPreferences ||
          isUpdatingDashboardAccount ||
          isRefetchingData ? (
            <LoadingSpinner size={25} />
          ) : (
            "حفظ"
          )}
        </Button>
      </div>
    </form>
  );
};

const ProviderPage = () => {
  const { user } = useUserContext();
  const {
    data,
    isFetching: isFetchingProviderServerSideProviderPreferencesData,
    isLoading: isLoadingProviderServerSidePreferencesData,
  } = useGetProviderPreferences(user.botUserId);

  const {
    data: dashboardAccountData,
    isFetching: isFetchingProviderServerSideDashboardAccountData,
    isLoading: isLoadingProviderServerSideDashboardAccountData,
  } = useGetDashboardAccountQuery(user.botUserId);

  const [providerData, setProviderData] = useReducerState();
  const providerServerSidePreferences = data?.data[0];
  const providerServerSideDashboardAccountData = dashboardAccountData?.data[0];

  useEffect(() => {
    if (providerServerSidePreferences) {
      setProviderData({
        ...providerServerSidePreferences,
      });
    }
  }, [providerServerSidePreferences, setProviderData]);

  return (
    <div className="h-full  relatvie">
      {(isLoadingProviderServerSidePreferencesData ||
        isLoadingProviderServerSideDashboardAccountData) && <LoadingOverlay />}

      {providerData && providerServerSideDashboardAccountData && (
        <ProviderPreferencesForm
          isRefetchingData={
            isFetchingProviderServerSideProviderPreferencesData ||
            isFetchingProviderServerSideDashboardAccountData
          }
          providerData={providerData}
          setProviderData={setProviderData}
          providerServerSidePreferences={providerServerSidePreferences}
          providerServerSideDashboardAccountData={
            providerServerSideDashboardAccountData
          }
        />
      )}
    </div>
  );
};

export default withRole(ProviderPage, DASHBOARD_USER_ROLE.Provider);
