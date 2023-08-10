import styled from "@emotion/styled";

const SuperHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  height: 60px;
  color: var(--color-gray);
  background-color: var(--color-error);
  border-bottom: 1px solid var(--color-gray);

  & button {
    background-color: inherit;
    font-size: inherit;
    color: var(--color-gray);
    text-decoration: underline;
    cursor: pointer;
    border: none;
    padding: 0;
    margin: 0;
    display: inline-flex;
    &:hover {
      color: var(--color-black);
    }
  }
`;

export const Banner = styled(SuperHeader)`
  background-color: var(--color-banner);
  color: var(--color-white);
  font-weight: 500;
  font-size: ${16 / 16}rem;
  & a {
    color: var(--color-primary);
    text-decoration: underline;
    &:hover {
      opacity: 0.7;
    }
  }
`;

export default SuperHeader;
