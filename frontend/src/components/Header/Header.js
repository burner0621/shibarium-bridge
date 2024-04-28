

import {
    Wrapper,
    Navigation,
    Link,
    LogoLink,
    Logo,
    MobileLogo,
    MobileNavigation,
    MobileList,
    MobileItem,
    BaseLink as MobileLink,
    ExternalMobileLink,
    List,
    Item,
    WalletWrapper,
} from "./Header.styles";

import Wallet from '../Wallet'

const Header = () => {
    return (
        <Wrapper className="!flex !flex-row justify-between">
            <LogoLink className="h-full flex flex-row items-center" to="/">
                <img src="/images/logo_web.png" className="h-[40px] sm:h-[60px]" />
                <MobileLogo />
            </LogoLink>
            <div></div>
            <div className="flex flex-row gap-8">
                {/* <a className="" href="https://app.shipedex.io/" target="_blank">
                    ShipeDEX
                </a> */}
                <a
                    href="https://app.shipedex.io/"
                    target="_blank"
                    className="flex items-center font-medium text-[#df343a] hover:text-[#d56b71] border border-[#df343a] rounded-lg px-4"
                >
                    ShipeDEX
                </a>
                <WalletWrapper>
                    <Wallet />
                </WalletWrapper>
            </div>
        </Wrapper>
    )
};
export default Header;