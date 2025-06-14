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
  const stars = useAppSelector(
    (state) => state.starSystem.stars
  );
  const transmissionQueue = useAppSelector(
    (state) => state.shipSystems.communicationStatus.transmissionQueue
  );

  const extractions = Object.entries(activeExtractions)

  const targetStar = stars.find(star => star.id === navigation?.targetStarId);

  return <div className="flex flex-col gap-1">
    <ProgressIndicatorItem name="Current State" description="Current State" value={100} />
    <ProgressIndicatorItem name="Current State" description="Current State" value={80} />
    <ProgressIndicatorItem name="Current State" description="Current State" value={50} /> 
    {extractions.map((extraction) => (
      <ProgressIndicatorItem 
        key={extraction[0]}
        name={`Extracting resources...`} 
        description={`Extracting resources from ${extraction[0]}`}
        value={extraction[1].progress} 
      />
    ))}
    {navigation && (
      <ProgressIndicatorItem 
        name="Navigation" 
        description={`Navigating to ${targetStar?.name || 'target star'}`} 
        value={navigation.travelProgress} 
      />
    )}
    {Object.entries(transmissionQueue).map((transmission) => (
      <ProgressIndicatorItem 
        key={transmission[0]}
        name={`Transmitting ${transmission[1].type.replace('_', ' ')}...`} 
        description={`Transmitting ${transmission[1].type.replace('_', ' ')} to HQ`}
        value={transmission[1].progress}
      />
    ))}
  </div>
}

export default memo(ProgressIndicator);