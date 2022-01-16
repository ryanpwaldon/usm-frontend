import JSBI from "jsbi";
import useSWR from "swr";
import { feesBasePath } from "./api/fees";
import * as Duration from "./duration";

export type Scarcity = {
  engines: {
    burned: {
      amount: JSBI;
      name: string;
      startedOn: Date;
    };
    locked: {
      amount: number;
      name: string;
      startedOn: Date;
    };
    staked: {
      amount: JSBI;
      name: string;
      startedOn: Date;
    };
  };
  ethSupply: JSBI;
  number: number;
};

// BigInt string that uses our server-side encoding of numbers + 'n', i.e. '7825428883900n'
type BigIntString = string;

const jsbiFromBigIntString = (str: string): JSBI =>
  JSBI.BigInt(str.slice(0, -1));

type RawScarcity = {
  engines: {
    burned: {
      amount: BigIntString;
      name: string;
      startedOn: Date;
    };
    locked: {
      amount: number;
      name: string;
      startedOn: Date;
    };
    staked: {
      amount: BigIntString;
      name: string;
      startedOn: Date;
    };
  };
  ethSupply: BigIntString;
  number: number;
};

export const useScarcity = (): Scarcity | undefined => {
  const { data } = useSWR<RawScarcity>(`${feesBasePath}/scarcity`, {
    refreshInterval: Duration.millisFromHours(1),
  });

  if (data === undefined) {
    return data;
  }

  return {
    engines: {
      burned: {
        ...data.engines.burned,
        startedOn: new Date(data.engines.burned.startedOn),
        amount: jsbiFromBigIntString(data.engines.burned.amount),
      },
      locked: {
        ...data.engines.locked,
        startedOn: new Date(data.engines.locked.startedOn),
      },
      staked: {
        ...data.engines.staked,
        startedOn: new Date(data.engines.staked.startedOn),
        amount: jsbiFromBigIntString(data.engines.staked.amount),
      },
    },
    ethSupply: jsbiFromBigIntString(data.ethSupply),
    number: data.number,
  };
};

type DataPoint = {
  t: number;
  v: number;
};

type RawSupplyInputs = {
  lockedData: DataPoint[];
  supplyData: DataPoint[];
  stakedData: DataPoint[];
};

type SupplyInputs = {
  stakingData: DataPoint[];
  contractData: DataPoint[];
  supplyData: DataPoint[];
};

export const useSupplyProjectionInputs = (): SupplyInputs | undefined => {
  const { data } = useSWR<RawSupplyInputs>(
    `${feesBasePath}/supply-projection-inputs`
  );

  if (data === undefined) {
    return undefined;
  }

  return {
    stakingData: data.stakedData,
    contractData: data.lockedData,
    supplyData: data.supplyData,
  };
};
