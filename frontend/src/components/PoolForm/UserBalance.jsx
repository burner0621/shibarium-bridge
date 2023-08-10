import styled from "@emotion/styled";

const UserBalance = ({ symbol, balance }) => {
  return (
    <UserBalanceWrapper>
      <span>
        Balance: {balance.toString()} {symbol}
      </span>
    </UserBalanceWrapper>
  );
};

export default UserBalance;

const UserBalanceWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;
