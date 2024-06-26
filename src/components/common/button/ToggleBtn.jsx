import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import styled, { css } from "styled-components";

const ToggleBtn = ({ toggle, onClick, $isList = false }) => {
  return (
    <aside onClick={onClick}>
      {toggle ? <StyledToggle $isList={$isList} /> : <StyledClosedToggle />}
    </aside>
  );
};

const baseStyles = css`
  cursor: pointer;

  &:hover {
    font-size: 2.2rem;
    transition-duration: 100ms;
  }

  background-color: white;

  font-size: 1.8rem;
  border-radius: 0 5px 5px 0;
  box-shadow: 5px 0px 5px 0px rgba(0, 0, 0, 0.106);

  position: absolute;
  top: calc(100vh / 2);

  @media screen and (max-width: 1023px) {
    top: calc((100vh - 3.4rem) / 2);
  }

  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const StyledToggle = styled(IoIosArrowBack)`
  ${baseStyles}

  left: ${(props) => (props.$isList ? "20rem" : "27rem")};

  @media screen and (max-width: 1023px) {
    left: ${(props) => (props.$isList ? "20rem" : "25rem")};
  }
`;

const StyledClosedToggle = styled(IoIosArrowForward)`
  ${baseStyles}

  @media screen and (max-width: 1023px) {
    left: 0;
  }
`;

export default ToggleBtn;
