import { nullTokenEdit } from "@/utils/toast";
import { useSelector } from "react-redux";
import styled from "styled-components";
const DocumentHeading = ({
  children,
  onEditClick,
  onSaveClick,
  onCancelClick,
  isEdit = false,
}) => {
  const { isLogin } = useSelector((state) => state.user);

  const toggleEditAuth = () => {
    if (!isLogin) return nullTokenEdit();
    onEditClick();
  };

  return (
    <Group>
      <SectionTitle>{children}</SectionTitle>
      {isEdit ? (
        <>
          <button type="submit" className="icon save" onClick={onSaveClick}>
            저장
          </button>
          <button type="button" className="icon cancel" onClick={onCancelClick}>
            취소
          </button>
        </>
      ) : (
        <button type="button" className="icon" onClick={toggleEditAuth}>
          편집
        </button>
      )}
    </Group>
  );
};

const Group = styled.span`
  display: flex;
  align-items: center;
  color: #216d32;
  margin: 0.5rem 0 0.8rem 0;
  width: 12rem;

  .icon {
    cursor: pointer;
    font-size: 0.9rem;
    margin: 0 0.3rem;
    color: #736e6e;
  }
`;

const SectionTitle = styled.p`
  font-size: 1.4rem;
  font-weight: 600;

  margin-right: 1rem;
  color: #216d32;
  float: left;

  @media screen and (max-width: 1023px) {
    font-size: 1.3rem;
  }
`;

export default DocumentHeading;
