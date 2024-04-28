import React, { useMemo, useState, useContext, useCallback } from "react";
import { useSelector } from "react-redux";
// eslint-disable-next-line import/first
import {
    Wrapper,
    Info,
    AccentSection,
    InfoContainer,
    AmountToReceive,
    InfoHeadlineContainer,
    FeesButton,
    SlippageDisclaimer,
} from "./SendAction.styles";

import { PrimaryButton } from "../Buttons";
import * as selectors from "../../store/selectors";
import { toast } from "react-toastify";
import {approveToken, bridgeToken, getTokenAllowance} from "../../Core/web3"
import Swal from "sweetalert2";
import { useEffect } from "react";

const SendAction = () => {
    const bridgeBalance = useSelector(selectors.bridgeBalance);
    const account = useSelector(selectors.userWallet);
    const [value, setValue] = useState (0)
    const [tokenAllowance, setTokenAllowance] = useState(0);
    const [isInfoModalOpen, setOpenInfoModal] = useState(false);
    const toggleInfoModal = () => setOpenInfoModal((oldOpen) => !oldOpen);
    const [pending, setPending] = useState(false);
    const [isApprovalPending, setApprovalPending] = useState(false);
    const [hasToApprove, setHasToApprove] = useState(false);
    const [isSendPending, setSendPending] = useState(false);

    useEffect(() => {
      const _getAllowance = async () => {
        const res = await getTokenAllowance();
        if(res.success)
          setTokenAllowance(Number(res.tokenAllowance));
        else
        setTokenAllowance(0)
      }
      if(account)
        _getAllowance()
      else
        setTokenAllowance(0)
    }, [account])

    useEffect (() => {
        setValue (bridgeBalance) 
        if(bridgeBalance < tokenAllowance) {
          setHasToApprove(false);
        } else {
          setHasToApprove(true);
        }
    }, [bridgeBalance])

    const buttonMsg = useCallback(() => {
      if (hasToApprove) {
        if (isApprovalPending) return "Approval in progress...";
        return "Approve";
      } 
      if (pending) return "Sending in progress...";
      return "SEND";
    }, [pending, isApprovalPending, hasToApprove]);

    const handleClick = async() => {
        if (value === 0 || value === undefined) return;
        setPending(true);
        try {
          if(hasToApprove) {
            setApprovalPending(true);            
            const res = await approveToken(value);
            setApprovalPending(false);
            if(res.success) {
              setHasToApprove(false);
            } else {
              return;
            }
          }
          const result = await bridgeToken(value);
          if (result.success) {
            // Swal.fire({
            //   icon: "success",
            //   title: " Success",
            //   text: "You have sent BONE successfully. Please wait a few mininutes.",
            // });
            toast.success("You have sent BONE successfully. Please wait a few mininutes.")
          } else {
            toast.error("Transaction has been failed. " + result.error);
          }
        } catch (error) {
          toast.error("Transaction has been failed. " + error);
        } finally {
          setPending(false);
        }
    }
    return (
        <AccentSection className="rounded-b-2xl bg-[#ffd091]">
            <Wrapper>
                <>
                    <PrimaryButton
                        onClick={handleClick}
                        disabled={Number(value) === 0 || value === undefined?true:false}
                    >
                        <span>{buttonMsg()}</span>
                    </PrimaryButton>
                </>
            </Wrapper>
        </AccentSection>
    )
};

export default SendAction;