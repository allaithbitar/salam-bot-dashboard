import { LoadingSpinner } from "@/components/ui/loading";

const LoadingOverlay = ({ containerCn }) => {
  return (
    // bg-neutral-200 bg-opacity-25
    <div
      className={`absolute left-0 top-0 h-full w-full grid place-items-center bg-black bg-opacity-50 z-[10] ${containerCn}`}
    >
      <LoadingSpinner className="text-primary" size={60} />
    </div>
  );
};

export default LoadingOverlay;
