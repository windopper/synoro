import { useAppSelector } from "@/app/lib/hooks";
import ProgressIndicatorItem from "./ProgressIndicatorItem";
import { memo } from "react";

function ProgressIndicator() {
  const activeExtractions = useAppSelector(
    (state) => state.shipSystems.stellarExtraction.activeExtractions
  );
  const navigation = useAppSelector(
    (state) => state.shipSystems.navigation
  );

  const extractions = Object.entries(activeExtractions)

  return <div className="flex flex-col gap-2">
    <ProgressIndicatorItem name="Current State" value={100} />
    <ProgressIndicatorItem name="Current State" value={80} />
    <ProgressIndicatorItem name="Current State" value={50} />
    {extractions.map((extraction) => (
      <ProgressIndicatorItem name={extraction[0]} value={extraction[1].progress} />
    ))}
    {navigation && (
      <ProgressIndicatorItem name="Navigation" value={navigation.travelProgress} />
    )}
  </div>
}

export default memo(ProgressIndicator);