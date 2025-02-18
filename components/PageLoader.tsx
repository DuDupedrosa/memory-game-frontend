import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <Loader2 className="animate-spin w-20 h-20 text-primary" />
    </div>
  );
}
