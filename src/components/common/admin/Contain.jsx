import styled from "styled-components";

const Contain = ({ children, marginBottom }) => {
  return <ContainCss marginBottom={marginBottom}>{children}</ContainCss>;
};

const ContainCss = styled.div`
  width: 700px;
  height: 25rem;

  display: flex;
  flex-direction: column;
  margin:0;

  position: relative;
  left:27rem;
  top:11rem;
`;

export default Contain;