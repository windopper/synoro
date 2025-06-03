"use client"

import { useShipSystemsSimulation } from "@/app/hooks/useShipSystemsSimulation";
import { memo } from "react";


function ShipSimulationInitializer() {
  console.log("ShipSimulationInitializer")

  useShipSystemsSimulation({
    enabled: true,
    updateInterval: 1000,
    enableRandomEvents: false,
    enableAutomation: false,
  })
    return null;
}

// memo
export default memo(ShipSimulationInitializer);