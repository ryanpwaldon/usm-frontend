import { useFeeData } from "../../api";
import { weiToEth } from "../../utils/metric-utils";
import colors from "../../colors";
import BaseGauge from "./IssuanceBurnBaseGauge";
import { FC } from "react";
import { Timeframe } from "../FeePeriodControl";
import { Unit } from "../ComingSoon";
import { timeframeBurnRateMap } from "../CumulativeFeeBurn";

type BurnGaugeProps = { timeframe: Timeframe; unit: Unit };

const BurnGauge: FC<BurnGaugeProps> = ({ timeframe, unit }) => {
  const { burnRates } = useFeeData();

  const selectedBurnRate =
    burnRates !== undefined
      ? burnRates[timeframeBurnRateMap[timeframe][unit]]
      : undefined;

  const burnRate =
    selectedBurnRate === undefined
      ? 0
      : unit === "eth"
      ? weiToEth(selectedBurnRate * 60 * 24 * 365.25) / 10 ** 6
      : (selectedBurnRate * 60 * 24 * 365.25) / 10 ** 9;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 pt-7 rounded-lg md:rounded-r-none lg:rounded-r-lg">
      <BaseGauge
        title="burn"
        value={burnRate}
        valueFillColor={colors.fireOrange}
        needleColor={colors.fireOrange}
        emoji="🔥"
        gaugeUnit={unit === "eth" ? "M" : "B"}
        valueUnit={unit === "eth" ? "ETH/year" : "USD/year"}
      />
    </div>
  );
};

export default BurnGauge;
