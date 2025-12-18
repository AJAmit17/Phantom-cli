import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import DeviceApprovalContent from "@/components/approve-content";

export default function DeviceApprovalPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <Spinner />
                </div>
            }
        >
            <DeviceApprovalContent />
        </Suspense>
    );
}
