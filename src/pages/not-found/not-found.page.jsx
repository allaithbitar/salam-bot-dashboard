import { Button } from "@/components/ui/button";
import { useLocation } from "preact-iso";

const NotFoundPage = () => {
  const location = useLocation();
  return (
    <div className="w-full h-full grid place-items-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xl"> حصل خطأ ما</p>
        <Button onClick={() => location.route("/")}>
          تسجيل الدخول مرة اخرى
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
