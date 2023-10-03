import InfoGroup from "./InfoGroup";
import DocumentHeading from "./DocumentHeading";
import Description from "./Description";
import DocumentTime from "./DocumentTime";
import DocumentInput from "./DocumentInput";
import ToggleBtn from "./ToggleBtn";
import styled from "styled-components";
import SelectMenu from "./SelectMenu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  detailDocument,
  contentModify,
  basicModify,
} from "@/services/document";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import useInput from "@/hooks/useInput";
import Skeleton from "@/components/common/layout/Skeleton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrapBtn from "./ScrapBtn";
import { scrapCreate, scrapDelete } from "@/services/scrap";
import { getUserInfo } from "@/services/user";

const Group = styled.div`
  width: 22rem;
  height: 90%;

  position: fixed;
  left: 15rem;
  top: 6.2rem;
  padding: 2rem 2rem 8rem 2rem;

  background-color: white;
  box-shadow: 10px 0px 5px 0px rgba(0, 0, 0, 0.106);
  box-sizing: border-box;
  overflow: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: rgba(237, 214, 214, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(86, 77, 77, 0.3);
    border-radius: 6px;
  }

  #docsName,
  #docsLocation,
  #docsCategory {
    width: fit-content;
    height: fit-content;
  }
`;

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
`;

const Box = styled.div`
  margin: 1rem 0 3rem 0;
`;

const ContentHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

const StyledSpan = styled.span`
  display: inline-block;
  height: 1rem;
`;

const EditorContainer = styled.div`
  width: fit-content;
  max-width: 22rem;
`;

const BasicInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DocsContent = styled.div`
  display: inline-block;
  width: 12rem;
`;

const DocsInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.8rem;
`;

const Document = ({ data }) => {
  const queryClient = useQueryClient();

  const { data: memberId } = useQuery(["member_info"], getUserInfo, {
    staleTime: Infinity,
    select: (data) => data?.data?.response.id,
  });

  const {
    id,
    docsName,
    docsLocation,
    docsCategory,
    docsCreatedAt,
    docsContent,
    scrap: isScraped,
  } = data || {};

  const { category } = useSelector((state) => state.category);
  const { latitude: getLat, longitude: getLng } = useSelector(
    (state) => state.latLng
  );
  const { address, initialAddress } = useSelector((state) => state.address);
  let addressInfo = { lat: getLat, lng: getLng };

  const { valueInit, handleOnChange, reset } = useInput({
    docsCategory,
    docsName,
    docsLocation: address,
    docsContent,
  });

  const [basicEdit, setBasicEdit] = useState(false);
  const [contentValue, setContentValue] = useState(docsContent);
  const [editContent, setEditContent] = useState(false);
  const [scraped, setScrap] = useState(isScraped);
  const [toggle, setToggle] = useState(true);

  const { mutate: mutationBasicModify } = useMutation({
    mutationFn: basicModify,
    onSuccess: () => {
      queryClient.invalidateQueries("detail_document");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: mutationContentModify } = useMutation({
    mutationFn: contentModify,
    onSuccess: () => {
      queryClient.invalidateQueries("detail_document");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: scrapDetailCreate } = useMutation({
    mutationFn: scrapCreate,
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: scrapDetailDelete } = useMutation({
    mutationFn: scrapDelete,
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSetInput = () => {
    setBasicEdit(true);
    valueInit.docsName = docsName;
  };

  const handleAddressInfo = () => {
    !getLat && (addressInfo = docsLocation);
    return addressInfo;
  };

  const saveBasicInfo = () => {
    mutationBasicModify({
      docsId: id,
      docsRequestType: "MODIFIED",
      docsRequestCategory: category || docsCategory,
      docsRequestName: valueInit.docsName,
      docsRequestLocation: addressInfo,
    });

    toast.info("관리자 승인 후 갱신됩니다.");
  };

  const handleBasicSave = () => {
    setBasicEdit(false);
    handleAddressInfo();
    saveBasicInfo();
  };

  const handleBasicCancel = () => {
    setBasicEdit(false);
  };

  const handleOnContentChange = (updateValue) => {
    setContentValue(updateValue);
  };

  const handleInputContent = () => {
    setEditContent(true);
    setContentValue(docsContent);
  };

  const saveContentInfo = () => {
    mutationContentModify({ docs_id: id, docsContent: contentValue });
    toast.success("내용이 수정되었습니다!");
  };

  const handleContentSave = () => {
    setEditContent(false);
    saveContentInfo();
  };

  const handleContentcCancel = () => {
    setEditContent(false);
  };

  useEffect(() => {
    setScrap(isScraped);
  }, [isScraped]);

  const handleOnScrapFill = () => {
    setScrap((prev) => !prev);
    if (!scraped) {
      scrapDetailCreate({ memberId, docsId: id });
    } else {
      scrapDetailDelete({ memberId, docsId: id });
    }
  };

  const clickToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container>
        {toggle && (
          <Group>
            <BasicInfo>
              <DocumentHeading
                className="basic"
                type={basicEdit}
                clickEdit={handleSetInput}
                basicSave={handleBasicSave}
                basicCancel={handleBasicCancel}
              >
                기본 정보
              </DocumentHeading>
              <ScrapBtn onClick={handleOnScrapFill} scrap={scraped} />
            </BasicInfo>

            <Box>
              <DocsInfo>
                <InfoGroup htmlFor="docsName" label="문서 제목" />
                {basicEdit ? (
                  <DocumentInput
                    htmlFor="docsName"
                    id="docsName"
                    placeholder={docsName}
                    value={valueInit.docsName}
                    onChange={handleOnChange}
                  />
                ) : (
                  <DocsContent>{docsName}</DocsContent>
                )}
              </DocsInfo>
              <DocsInfo>
                <InfoGroup
                  className="location"
                  htmlFor="docsLocation"
                  label="위치"
                />
                {basicEdit ? (
                  <DocumentInput
                    htmlFor="docsLocation"
                    id="docsLocation"
                    placeholder={initialAddress}
                    value={address}
                    disabled
                    onChange={handleOnChange}
                  />
                ) : (
                  <DocsContent>{initialAddress}</DocsContent>
                )}
              </DocsInfo>
              <InfoGroup htmlFor="docsCategory" label="카테고리">
                {basicEdit ? (
                  <StyledSpan>
                    <SelectMenu
                      id="docsCategory"
                      value={category}
                      onChange={handleOnChange}
                      selected={docsCategory}
                    />
                  </StyledSpan>
                ) : (
                  docsCategory
                )}
              </InfoGroup>
            </Box>

            <ContentHeading>
              <DocumentHeading
                className="content"
                contentType={editContent}
                clickEdit={handleInputContent}
                contentSave={handleContentSave}
                contentCancel={handleContentcCancel}
              >
                내용
              </DocumentHeading>
              <DocumentTime className="time">{docsCreatedAt}</DocumentTime>
            </ContentHeading>

            <Description>
              {editContent ? (
                <EditorContainer className="container">
                  <MDEditor
                    height={250}
                    value={contentValue}
                    onChange={handleOnContentChange}
                    preview="edit"
                    components={{
                      toolbar: (command, disabled, executeCommand) => {
                        if (command.keyCommand === "code") {
                          return (
                            <button
                              aria-label="Insert code"
                              disabled={disabled}
                              onClick={(evn) => {
                                evn.stopPropagation();
                                executeCommand(command, command.groupName);
                              }}
                            >
                              Code
                            </button>
                          );
                        }
                      },
                    }}
                  />
                </EditorContainer>
              ) : (
                <MDEditor.Markdown
                  source={docsContent}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              )}
            </Description>
          </Group>
        )}
        <ToggleBtn toggle={toggle} onClick={clickToggle} />
      </Container>
    </>
  );
};

export default Document;
