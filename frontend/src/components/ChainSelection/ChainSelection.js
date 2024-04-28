import React, { useEffect, useState, useCallback } from 'react'
import {
    Wrapper,
    RoundBox,
    Logo,
    ConnectButton,
    Menu,
    Item,
    ToggleIcon,
    ToggleButton,
    InputGroup,
    ToggleChainName,
    SendBlockedWarning,
} from "./ChainSelection.styles";

import { Section, SectionTitle } from "../Section";

import { ChainId, CHAINS_SELECTION } from '../../utils/constants'
import CoinSelection from "../CoinSelection/CoinSelection";
import { getBalanceOfAccount } from "../../Core/web3"
import { useSelector } from 'react-redux';
import * as selectors from "../../store/selectors";


const ChainSelection = () => {
    const selectedItem = CHAINS_SELECTION.filter((a) => a.chainId === ChainId.MAINNET)[0]
    const account = useSelector(selectors.userWallet)
    const [balance, setBalance] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            const rlt = await getBalanceOfAccount();
            if (rlt.success) setBalance(Number(rlt.totalBoneBalance))
        }
        if(account)
            fetchData()
        else {
            setBalance(0)
        }
    }, [account])
    return (
        <section className="p-2.5">
            <Wrapper className="py-5 px-3 bg-[#ffddb3] rounded-3xl">
                <SectionTitle className="text-white text-sm sm:text-lg">From</SectionTitle>
                <div className="flex flex-row items-center justify-between">
                    <InputGroup className="rounded-full bg-white">
                        <RoundBox as="label" className="rounded-full bg-white">
                            <ToggleButton type="button">
                                <Logo src={selectedItem?.logoURI} alt={selectedItem?.name} className='w-[16px] h-[24px] sm:w-[30px] sm:h-[30px]' />
                                <ToggleChainName className='text-sm sm:text-base'>{selectedItem?.name}</ToggleChainName>
                                <ToggleIcon />
                            </ToggleButton>
                        </RoundBox>
                    </InputGroup>
                    <CoinSelection />
                </div>
                <div className="text-right mt-2 mr-3 text-gray-700">Balance: {balance.toFixed(2)}</div>
            </Wrapper>
        </section>
    )
};
export default ChainSelection;