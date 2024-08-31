import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { DASHBOARD_USER_ROLE } from "@/constants";
import { useUserContext } from "@/context/user/user.context";
import { useDashboardLoginMutation } from "@/hooks/mutations";
import useReducerState from "@/hooks/use-reducer-state";
import { useLocation } from "preact-iso";

const LoginPage = () => {
  const { setUser } = useUserContext();
  const location = useLocation();

  const [loginData, setLoginData] = useReducerState({
    password: "",
    nickname: "",
  });

  const { toast } = useToast();

  const { mutateAsync: loginAsync, isLoading: isLoggingIn } =
    useDashboardLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAsync(loginData);
      setUser(res);
      if (res.role === DASHBOARD_USER_ROLE.Admin) {
        location.route("/admin");
      } else {
        location.route("/provider");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: error.message,
      });
    }
  };

  return (
    <div className="h-full grid place-items-center">
      <Card className="w-full sm:w-[500px]">
        <CardHeader>
          <CardTitle>تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="nickname"> الاسم المستعار</Label>
                <Input
                  autocomplete="nickname"
                  disabled={isLoggingIn}
                  id="nickname"
                  value={loginData.nickname}
                  onInput={(e) =>
                    setLoginData({
                      nickname: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  autocomplete="password"
                  disabled={isLoggingIn}
                  id="password"
                  type="password"
                  value={loginData.password}
                  onInput={(e) =>
                    setLoginData({
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                onClick={handleLogin}
                disabled={
                  Object.values(loginData).some((v) => !v) || isLoggingIn
                }
              >
                {isLoggingIn ? <LoadingSpinner size={20} /> : "تسجيل الدخول"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
