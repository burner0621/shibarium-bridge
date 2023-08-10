import styled from "@emotion/styled";
import AccentSectionBorder from "assets/border.svg";
import { QUERIES } from "utils";

export const Section = styled.section`
  color: var(--color-white);
  padding: 10px;
  @media ${QUERIES.tabletAndUp} {
    padding: 20px;
  }
`;
export const SectionTitle = styled.h3`
  font-weight: 700;
  padding-top: 5px;
  margin-bottom: 10px;
  margin-left: 5px;
`;
export const AccentSection = styled.section`
  padding: 0 30px;
`;
