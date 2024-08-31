import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { DASHBOARD_USER_ROLE, USER_TYPE_ENUM } from "@/constants";
import {
  useDeleteDashboardAccountMutation,
  useGenerateDashboardAccountMutation,
  useUpdateDashboardAccountMutation,
} from "@/hooks/mutations";
import { generateRandomPassword } from "@/lib/utils";
import { useRef, useState } from "preact/hooks";
import { decrypt, encrypt } from "@/lib/crypto-js";
import { Checkbox } from "@/components/ui/checkbox";
import { validateNewPassword } from "@/constants/validators";
import { transformPassword } from "@/lib/helpers";
import { useHasDashboardAccount } from "@/hooks/use-has-dashboard-account";

const HasNoAccount = ({ userData, originalUserData }) => {
  const { toast } = useToast();
  const {
    mutateAsync: createDashboardAccountAsync,
    isLoading: isCreateingAccount,
  } = useGenerateDashboardAccountMutation();

  const handleGenerateDashboardAccount = async () => {
    const password = generateRandomPassword();
    const encryptedPasssword = encrypt(password);

    try {
      await createDashboardAccountAsync({
        bot_user_id: userData.tg_id,
        password: encryptedPasssword,
      });

      toast({
        variant: "success",
        title: "تم إنشاء حساب لوحة تحكم لهذا المستخدم",
      });
    } catch (error) {
      let details = error.message;
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: details,
      });
    }
  };

  return (
    <>
      <p className="text-center text-muted-foreground leading-none tracking-tight">
        لا يملك هذا المستخدم حساب في لوحة التحكم
      </p>
      {originalUserData.user_type !== USER_TYPE_ENUM.Consumer && (
        <Button
          disabled={isCreateingAccount}
          onClick={handleGenerateDashboardAccount}
          type="button"
        >
          {isCreateingAccount ? (
            <LoadingSpinner size={20} />
          ) : (
            "إنشاء حساب في لوحة التحكم"
          )}
        </Button>
      )}
    </>
  );
};

const DeleteAccountSection = ({
  onConfirm,
  isUpdatingDashboardAccount,
  isDeletingDashboardAccount,
}) => {
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  if (isConfirmMode) {
    return (
      <div className="flex flex-col gap-3 text-center font-bold p-4 border rounded-md">
        <p>هل متأكد من حذف حساب لوحة التحكم لهذا المستخدم ؟ </p>
        <div className="flex gap-2">
          <Button
            disabled={isDeletingDashboardAccount}
            variant="destructive"
            className="w-full"
            onClick={onConfirm}
          >
            تأكيد
          </Button>
          <Button
            disabled={isDeletingDashboardAccount}
            variant="outline"
            className="w-full"
            onClick={() => setIsConfirmMode(false)}
          >
            إلغاء
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Button
      variant="destructive"
      onClick={() => setIsConfirmMode(true)}
      disabled={isUpdatingDashboardAccount || isDeletingDashboardAccount}
    >
      {isDeletingDashboardAccount ? (
        <LoadingSpinner size={20} />
      ) : (
        "حذف حساب لوحة التحكم"
      )}
    </Button>
  );
};

const HasAccount = ({ userData, originalUserData }) => {
  const { toast } = useToast();
  const { dashboardAccount } = useHasDashboardAccount(userData.tg_id);

  const {
    mutateAsync: deleteDashboardAccountAsync,
    isLoading: isDeletingDashboardAccount,
  } = useDeleteDashboardAccountMutation();

  const {
    mutateAsync: updateDashboardAccountAsync,
    isLoading: isUpdatingDashboardAccount,
  } = useUpdateDashboardAccountMutation();
  const originalDecryptedPassword = useRef(decrypt(dashboardAccount.password));
  const originalIsAdmin = useRef(
    dashboardAccount.role === DASHBOARD_USER_ROLE.Admin,
  );
  const [decryptedPassword, setDecryptedPassword] = useState(
    decrypt(dashboardAccount.password),
  );
  const [isAdmin, setIsAdmin] = useState(
    dashboardAccount.role === DASHBOARD_USER_ROLE.Admin,
  );
  const [passwordError, setPasswordError] = useState(null);

  const handleUpdatePassword = async () => {
    try {
      setPasswordError(null);
      const error = validateNewPassword(decryptedPassword);
      if (error) {
        setPasswordError(error);
        return;
      }
      const encrypted = encrypt(decryptedPassword);
      await updateDashboardAccountAsync({
        bot_user_id: userData.tg_id,
        password: encrypted,
        role: isAdmin
          ? DASHBOARD_USER_ROLE.Admin
          : DASHBOARD_USER_ROLE.Provider,
      });
      toast({
        variant: "success",
        title: "تم حفظ التعديلات",
      });
      originalDecryptedPassword.current = decryptedPassword;
      originalIsAdmin.current = isAdmin;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };

  const handleDeleteDashboardAccount = async () => {
    try {
      await deleteDashboardAccountAsync({
        bot_user_id: userData.tg_id,
      });

      toast({
        variant: "success",
        title: "تم حذف الحساب بنجاح",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <p>
          الاسم المستعار :{" "}
          <span className="text-muted-foreground">
            {originalUserData.nickname}
          </span>{" "}
        </p>

        <div className="flex items-center gap-2">
          <Checkbox
            disabled={isUpdatingDashboardAccount || isDeletingDashboardAccount}
            id="isAdmim"
            checked={isAdmin}
            onCheckedChange={(v) => {
              setIsAdmin(v);
            }}
          />
          <Label
            htmlFor="isAdmin"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ادمن
          </Label>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="password">كلمة المرور :</Label>
        <Input
          disabled={isUpdatingDashboardAccount || isDeletingDashboardAccount}
          id="password"
          value={decryptedPassword}
          onInput={(e) => {
            e.target.value = transformPassword(e.target.value);
            return setDecryptedPassword(e.target.value);
          }}
        />
        <div className="flex flex-col mt-[-10px]">
          {passwordError && (
            <small className="text-red-500">{passwordError}</small>
          )}
        </div>
        <small className="text-muted-foreground text-center">
          تستخدم المعلومات أعلاه من أجل تسجيل الدخول الى إعدادات المستخدم من
          الموقع
        </small>

        <Button
          type="button"
          onClick={handleUpdatePassword}
          disabled={
            (originalDecryptedPassword.current === decryptedPassword &&
              originalIsAdmin.current === isAdmin) ||
            isUpdatingDashboardAccount ||
            isDeletingDashboardAccount
          }
        >
          {isUpdatingDashboardAccount ? <LoadingSpinner size={20} /> : "حفظ"}
        </Button>
        <DeleteAccountSection
          onConfirm={handleDeleteDashboardAccount}
          isDeletingDashboardAccount={isDeletingDashboardAccount}
          isUpdatingDashboardAccount={isUpdatingDashboardAccount}
        />
      </div>
    </>
  );
};

const BotUserDashboardAccount = ({ userData, originalUserData }) => {
  const { isLoadingDashboardAccount, hasDashboardAccount } =
    useHasDashboardAccount(userData.tg_id);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">حساب لوحة التحكم</p>
      </div>
      {isLoadingDashboardAccount && (
        <LoadingSpinner size={25} className="text-center mx-auto" />
      )}
      {!isLoadingDashboardAccount && (
        <>
          {!hasDashboardAccount && (
            <HasNoAccount
              userData={userData}
              originalUserData={originalUserData}
            />
          )}
          {hasDashboardAccount && (
            <HasAccount
              userData={userData}
              originalUserData={originalUserData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BotUserDashboardAccount;
