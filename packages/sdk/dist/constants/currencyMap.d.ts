import { Token, Ether } from '../entities';
import { ChainId } from '../enums';
export declare enum CurrencySymbol {
    DAI = "DAI",
    ETH = "ETH",
    WETH = "WETH",
    USDC = "USDC",
    USDT = "USDT"
}
export declare const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const UNDEPLOYED_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const EthLogo = "https://raw.githubusercontent.com/sushiswap/icons/master/token/eth.jpg";
export declare const WethLogo = "https://raw.githubusercontent.com/sushiswap/icons/master/token/weth.jpg";
export declare const UsdcLogo = "https://raw.githubusercontent.com/sushiswap/icons/master/token/usdc.jpg";
export declare const UsdtLogo = "https://raw.githubusercontent.com/sushiswap/icons/master/token/usdt.jpg";
export declare const DaiLogo = "https://raw.githubusercontent.com/sushiswap/icons/master/token/dai.jpg";
export declare const CURRENCY_SYMBOL_LOGO: {
    DAI: string;
    ETH: string;
    WETH: string;
    USDC: string;
    USDT: string;
};
export declare const getCurrencyConstants: (contracts: any) => {
    MAINNET_WETH: string;
    MAINNET_USDC: string;
    MAINNET_USDT: string;
    ROPSTEN_WETH: any;
    ROPSTEN_USDC: any;
    ROPSTEN_USDT: any;
    HARDHAT_WETH: any;
    HARDHAT_USDC: any;
    HARDHAT_USDT: any;
};
export declare const getCurrencyMap: (contracts: any) => {
    1: {
        [x: string]: Ether | Token;
        "0x0000000000000000000000000000000000000000": Ether;
    };
    3: {
        [x: number]: Token;
        "0x0000000000000000000000000000000000000000": Ether;
    };
    1337: {
        [x: number]: Token;
        "0x0000000000000000000000000000000000000000": Ether;
    };
};
export declare const getSymbolCurrencyMap: (contracts: any) => {
    1: {
        ETH: Ether;
        USDC: Token;
        USDT: Token;
        WETH: Token;
    };
    3: {
        ETH: Ether;
        USDC: Token;
        USDT: Token;
        WETH: Token;
    };
    1337: {
        ETH: Ether;
        USDC: Token;
        USDT: Token;
        WETH: Token;
    };
};
export declare const getSymbolCurrency: (contracts: any, chainId: ChainId, symbol: CurrencySymbol) => any;
export declare const isNativeCurrency: (currency: string) => boolean;
