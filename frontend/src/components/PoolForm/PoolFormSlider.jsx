import { FC, Dispatch, SetStateAction } from "react";
import ReactSlider from "react-slider";
import styled from "@emotion/styled";

const PoolFormSlider = ({ value, setValue }) => {
  return (
    <Slider
      className="PoolForm-slider"
      defaultValue={value}
      value={value}
      thumbClassName="PoolForm-thumb"
      trackClassName="PoolForm-track"
      onChange={(v) => {
        if (typeof v === "number") setValue(v);
      }}
      renderThumb={(props, state) => <div {...props} />}
    />
  );
};

export default PoolFormSlider;

const Slider = styled(ReactSlider)`
  .PoolForm-thumb {
    height: 34px;
    width: 34px;
    background-color: var(--color-primary);
    border-radius: 16px;
    border: 3px solid var(--color-white);
    margin-bottom: -8px;
    top: -17px;
    &:focus {
      outline: none;
    }
  }
  .PoolForm-track {
    height: 3px;
    background-color: var(--color-white);
  }
`;
