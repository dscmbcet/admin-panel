import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-backgroundPrimary z-[10000] flex flex-1 items-center justify-center">
      <LoaderCircle className="text-onBackgroundPrimary animate-spin" />
    </div>
  );
}
