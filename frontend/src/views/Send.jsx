import React from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import {
  Layout,
  ChainSelection,
  CoinSelection,
  AddressSelection,
  SendAction,
} from "components";
import swapSVG from "assets/swap.svg"

const Send= () => {
  const { trackPageView } = useMatomo();

  // Track page views of the Send tab
  React.useEffect(() => {
    trackPageView({
      documentTitle: "Send",
      href: "https://across.to",
    });
  }, [trackPageView]);

  return (
    <Layout>
      <div className="px-5 pt-5 font-bold text-2xl">Token Bridge</div>
      <ChainSelection />
      {/* <CoinSelection /> */}
      <div className="text-center">
        <img src={swapSVG} className="w-[30px] m-auto rounded-full bg-[#eb382d] p-1"/>
      </div>
      <AddressSelection />
      <SendAction />
    </Layout>
  );
};

export default Send;
