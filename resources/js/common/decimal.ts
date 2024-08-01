import BigNumber from "bignumber.js";

export const preciseLte = (a: number, b: number) => {
    const x = new BigNumber(a);
    const y = new BigNumber(b);
    return x.lte(y);
};
