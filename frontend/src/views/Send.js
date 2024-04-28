import Layout from "../components/Layout";
import ChainSelection from "../components/ChainSelection";
import AddressSelection from "../components/AddressSelection";
import SendAction from "../components/SendAction";

import swapSVG from "../assets/swap.svg"

const Send = () => {
    return (
        <Layout>
            <div className="px-3 pt-3 sm:px-5 sm:pt-5 font-bold text-xl sm:text-2xl text-white">Token Bridge</div>
            <ChainSelection />
            <div className="text-center">
                <img src={swapSVG} className="w-[24px] sm:w-[30px] m-auto rounded-full bg-[#eb382d] p-1" />
            </div>
            <AddressSelection />
            <SendAction />
        </Layout>
    )
};

export default Send;
