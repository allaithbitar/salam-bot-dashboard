import LoadingOverlay from "@/components/shared/loading-overlay.component";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateUserPreferencesMutation } from "@/hooks/mutations";
import { getErrorMessage } from "@/lib/helpers";

const BlockUserModal = ({ userToBlockData, onClose }) => {
  const { toast } = useToast();
  const {
    mutateAsync: updateUserPreferencesAsync,
    isLoading: isUpdatingUserPreferences,
  } = useUpdateUserPreferencesMutation();
  const isUnblock = userToBlockData?.preferences?.is_blocked;

  const handleBlockUser = async () => {
    try {
      await updateUserPreferencesAsync({
        tg_id: userToBlockData.tg_id,
        is_blocked: !isUnblock,
      });
      toast({
        variant: "success",
        title: "تم حظر المتسخدم",
      });

      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: getErrorMessage(error),
      });
    }
  };
  return (
    <Dialog open={!!userToBlockData} onOpenChange={onClose}>
      <DialogContent className="w-[95%] rounded-md lg:w-auto max-h-[95%] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle>
            تأكيد {isUnblock ? "إلغاء حظر" : "حظر"} المستخدم
          </DialogTitle>
        </DialogHeader>
        <p>
          هل انت متأكد من {isUnblock ? "إلغاء حظر" : "حظر"} المستخدم{" "}
          {userToBlockData.preferences.nickname} ؟
        </p>
        <div className="w-full flex gap-2">
          <Button variant="outline" className="w-full" onClick={onClose}>
            {" "}
            تراجع
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleBlockUser}
          >
            {" "}
            {isUnblock ? "إلغاء الحظر" : "حظر"}
          </Button>
        </div>
        {isUpdatingUserPreferences && <LoadingOverlay />}
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserModal;
