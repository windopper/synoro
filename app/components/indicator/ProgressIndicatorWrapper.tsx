import { memo } from "react";
import ProgressIndicator from "./ProgressIndicator";

function ProgressIndicatorWrapper() {
    return (
        <div className="absolute top-4 right-4 z-10 max-w-sm">
            <ProgressIndicator />
        </div>
    )
}

// memo
export default memo(ProgressIndicatorWrapper);