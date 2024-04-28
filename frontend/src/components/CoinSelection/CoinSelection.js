import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
    RoundBox,
    Wrapper,
    Menu,
    Item,
    InputGroup,
    ToggleButton,
    Logo,
    ToggleIcon,
    MaxButton,
    Input,
    ErrorBox,
} from "./CoinSelection.styles";
import { AnimatePresence } from "framer-motion";
import * as selectors from "../../store/selectors";

import { TOKENS_LIST, ChainId } from "../../utils";

import { setBridgeValue, getBalanceOfAccount } from '../../Core/web3'

const CoinSelection = ({ type }) => {
    const bridgeBalance = useSelector(selectors.bridgeBalance);
    // const account = useSelector(selectors.userWallet);
    const userBalance = useSelector(selectors.userBalance);
    const [isConnected, setIsConnected] = useState(true)
    const [value, setValue] = useState(0)
    // const [userBalance, setUserBalance] = useState(0);
    const [error, setError] = React.useState();
    const handleMaxClick = async () => {
        const res = await getBalanceOfAccount();
        if(res.success) {
            setValue(res.totalBoneBalance)
            setBridgeValue(res.totalBoneBalance)
        }
        else {
            setValue(0)
            setBridgeValue(0)
        }

    };

    useEffect(() => {
        setValue(bridgeBalance)
    }, [bridgeBalance])

    const selectedItem = TOKENS_LIST[ChainId.MAINNET][0]

    const errorMsg = error
        ? error.message
        : "";

    const showError = true

    const handleChange = (e) => {
        try {
            const val = Number(e.target.value);
            console.log("val=", val)
            if(isNaN(val)) {
                setValue(0);
                setBridgeValue(0);
            }
            setValue(val > userBalance ? userBalance : val);
            setBridgeValue(val > userBalance ? userBalance : val)
        } catch (e) {
            setValue(0)
            setBridgeValue(0)
            console.error("error", e)
        }

    }

    return (
        <AnimatePresence>
            <section className="text-white px-0 pl-2.5">
                <Wrapper>
                    <InputGroup className="rounded-full bg-white">
                        <RoundBox
                            as="label"
                            htmlFor="amount"
                            style={{
                                // @ts-expect-error TS does not likes custom CSS vars
                                "--color": "error"
                                    ? "var(--color-error-light)"
                                    : "var(--color-white)",
                                "--outline-color": "error"
                                    ? "var(--color-error)"
                                    : "var(--color-primary)",
                            }}
                            className="pr-0 mr-0 rounded-tl-full rounded-bl-full w-fit"
                        >
                            {type !== "1" && <MaxButton className="px-[6px] py-[2px] sm:px-[10px] sm:py-[5px]" onClick={handleMaxClick} disabled={!isConnected}>
                                max
                            </MaxButton>}
                            {/* <Input
                                placeholder="0.00"
                                id="amount"
                                value={value}
                                onChange={(e) => handleChange(e)}
                                disabled={type === "1" ? true : false}
                            /> */}
                        </RoundBox>
                        <Input
                            placeholder="0.00"
                            id="amount"
                            type="number"
                            value={value}
                            onChange={(e) => handleChange(e)}
                            disabled={type === "1" ? true : false}
                        />
                        <RoundBox as="label" className="rounded-tr-full rounded-br-full px-[1px] sm:px-[3px]">
                            <ToggleButton type="button">
                                <Logo src={selectedItem?.logoURI} alt={selectedItem?.name} />
                                <div className="text-gray-600 text-xs sm:text-lg">{selectedItem?.symbol}</div>
                                <ToggleIcon />
                            </ToggleButton>
                        </RoundBox>
                    </InputGroup>
                    {/* {showError && <ErrorBox>{errorMsg}</ErrorBox>} */}
                </Wrapper>
            </section>
        </AnimatePresence>
    )
};

export default CoinSelection;