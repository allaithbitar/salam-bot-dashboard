import {} from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { USER_TYPE_ENUM, USER_TYPE_ENUM_TO_READABLE } from "@/constants";
import { useUpdateUserPreferencesMutation } from "@/hooks/mutations";
import { useEffect, useMemo, useState } from "preact/hooks";
import BotUserDashboardAccount from "./bot-user-dashboard-account.component";
import { Separator } from "@/components/ui/separator";
import { validateUserPreferences } from "@/constants/validators";
import {
  getErrorMessage,
  isDuplicateNicknameError,
  transformNickname,
} from "@/lib/helpers";
import { useHasDashboardAccount } from "@/hooks/use-has-dashboard-account";
import { LoadingSpinner } from "@/components/ui/loading";
import { useGetUserDataForEditingQuery } from "@/hooks/queries";
import LoadingOverlay from "@/components/shared/loading-overlay.component";

const EditUserModal = ({ userToEditTgId, onClose }) => {
  const {
    data: userToEditData,
    isFetching: isFetchingUserData,
    isLoading: isLoadingUserData,
  } = useGetUserDataForEditingQuery(userToEditTgId, {
    enabled: !!userToEditTgId,
  });

  const { toast } = useToast();
  const { hasDashboardAccount } = useHasDashboardAccount(userToEditTgId, {
    enabled: !!userToEditTgId,
  });

  const {
    mutateAsync: updateUserPreferencesAsync,
    isLoading: isUpdatingUserPreferences,
  } = useUpdateUserPreferencesMutation();

  // const {
  //   mutateAsync: updateUserFirstNameLastNameUsername,
  //   isLoading: isUpdatingUserFirstNameLastNameUsername,
  // } = useUpdateUserFirstNameLastNameUsername();

  // const isUpdatingUserData =
  //   isUpdatingUserFirstNameLastNameUsername || isUpdatingUserPreferences;

  const [userData, setUserData] = useState({
    tg_id: 0,
    first_name: "",
    last_name: "",
    username: "",
    nickname: "",
    will_to_provide: 0,
    user_type: USER_TYPE_ENUM.Consumer,
  });
  const originalUserData = useMemo(() => {
    if (!userToEditData) return null;
    const userServerSideData = userToEditData;
    return {
      tg_id: userServerSideData.tg_id,
      first_name: userServerSideData.first_name,
      last_name: userServerSideData.last_name,
      username: userServerSideData.username,
      nickname: userServerSideData.preferences?.nickname ?? "",
      will_to_provide: userServerSideData.preferences?.will_to_provide ?? 0,
      user_type:
        userServerSideData.preferences?.user_type ?? USER_TYPE_ENUM.Consumer,
    };
  }, [userToEditData]);

  //
  // const originalUserData = useMemo(
  //   () => ({
  //     tg_id: userToEdit.tg_id,
  //     first_name: userToEdit.first_name,
  //     last_name: userToEdit.last_name,
  //     username: userToEdit.username,
  //     nickname: userToEdit.preferences?.nickname ?? "",
  //     will_to_provide: userToEdit.preferences?.will_to_provide ?? 0,
  //     user_type:
  //       userToEdit?.preferences?.user_type ?? USER_TYPE_ENUM.Consumer,
  //   }),
  //   [userToEdit],
  // );

  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "nickname")
      e.target.value = transformNickname(e.target.value);
    return setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    const _errors = validateUserPreferences(userData);
    if (_errors) {
      setErrors(_errors);
      return;
    }

    try {
      // if (
      //   originalUserData.first_name !== userData.first_name ||
      //   userData.last_name !== originalUserData.last_name ||
      //   originalUserData.username !== userData.username
      // ) {
      //   await updateUserFirstNameLastNameUsername(userData);
      // }
      await updateUserPreferencesAsync({
        tg_id: userData.tg_id,
        nickname: userData.nickname,
        will_to_provide: Number(userData.will_to_provide),
        user_type: userData.user_type,
      });

      toast({
        variant: "success",
        title: "تم حفظ التعديلات",
      });
    } catch (error) {
      //duplicates error code
      let details = getErrorMessage(error);
      if (isDuplicateNicknameError(getErrorMessage(error)))
        details = "الاسم المستعار مستخدم من قبل مستخدم اخر";
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: details,
      });
    }
  };

  useEffect(() => {
    if (userToEditData) {
      const userServerSideData = userToEditData;
      setUserData({
        tg_id: userServerSideData.tg_id,
        first_name: userServerSideData.first_name,
        last_name: userServerSideData.last_name,
        username: userServerSideData.username,
        nickname: userServerSideData.preferences?.nickname ?? "",
        will_to_provide: userServerSideData.preferences?.will_to_provide ?? 0,
        user_type:
          userServerSideData.preferences?.user_type ?? USER_TYPE_ENUM.Consumer,
      });
    }
  }, [userToEditData]);

  const isFetchingOrUpdatingUserData = isFetchingUserData;

  return (
    <Dialog open={!!userData} onOpenChange={onClose}>
      <DialogContent className="w-[95%] rounded-md lg:w-auto max-h-[95%] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>حساب البوت</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative max-h-[90dvh] ">
          {isLoadingUserData && <LoadingOverlay />}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="first_name">الاسم الاول</Label>
                <Input
                  disabled
                  id="first_name"
                  name="first_name"
                  value={userData.first_name}
                  onInput={handleChange}
                />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="last_name">الاسم الاخير</Label>
                <Input
                  disabled
                  id="last_name"
                  name="last_name"
                  value={userData.last_name}
                  onInput={handleChange}
                />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  disabled
                  id="username"
                  name="username"
                  value={userData.username}
                  onInput={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="user_type"> نوع المستخدم</Label>
                <Select
                  id="user_type"
                  value={userData.user_type}
                  disabled={isFetchingOrUpdatingUserData}
                  onValueChange={(v) =>
                    handleChange({
                      target: {
                        name: "user_type",
                        value: v,
                      },
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
                    <SelectItem
                      disabled={hasDashboardAccount}
                      value={USER_TYPE_ENUM.Consumer}
                    >
                      {USER_TYPE_ENUM_TO_READABLE.Consumer}
                    </SelectItem>

                    <SelectItem value={USER_TYPE_ENUM.Provider}>
                      {USER_TYPE_ENUM_TO_READABLE.Provider}
                    </SelectItem>
                    <SelectItem value={USER_TYPE_ENUM.Specialist}>
                      {USER_TYPE_ENUM_TO_READABLE.Specialist}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="will_to_provide">
                  الاولوية في تقديم الرعاية
                </Label>
                <Select
                  id="will_to_provide"
                  value={String(userData.will_to_provide)}
                  disabled={
                    isFetchingOrUpdatingUserData ||
                    userData.user_type === USER_TYPE_ENUM.Consumer
                  }
                  onValueChange={(v) =>
                    handleChange({
                      target: {
                        name: "will_to_provide",
                        value: v,
                      },
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
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Label htmlFor="nickname">الاسم المستعار</Label>
              <Input
                disabled={isFetchingOrUpdatingUserData}
                id="nickname"
                name="nickname"
                value={userData.nickname}
                onInput={handleChange}
              />
              {errors?.nickname && (
                <small className="text-red-500 mt-[-10px]">
                  {errors.nickname}
                </small>
              )}
            </div>

            <Button disabled={isFetchingOrUpdatingUserData} className="w-full">
              {isLoadingUserData ? <LoadingSpinner size={25} /> : "حفظ"}
            </Button>
            <Separator />
            {originalUserData && (
              <BotUserDashboardAccount
                userData={userData}
                originalUserData={originalUserData}
              />
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
