import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";

import DocumentInputGroup from "./DocumentInputGroup";
import DocumentLabel from "@/components/document/DocumentLabel";
import SelectInput from "@/components/common/input/SelectInput";
import Button from "@/components/common/button/Button";
import { DOCS_INFO, ERROR_MSG, CATEGORY } from "@/constant/document/create";
import { HELPER_MSG } from "@/constant/document/helpermsg";
import { create } from "@/services/document";
import { askAlert, requestAlert } from "@/utils/alert";
import { nullTokenWrite, occurError } from "@/utils/toast";
import useHandleAddress from "@/hooks/useHandleAddress";

const CreateDocument = () => {
  const { latitude, longitude } = useSelector((state) => state.latLng);
  const address = useSelector((state) => state.address.address);
  const isLogin = useSelector((state) => state.user.isLogin);

  const methods = useForm();
  const { reset, getValues, handleSubmit } = methods;

  const { inputAddress, clearAddress, isAddress } = useHandleAddress(
    methods,
    address,
    latitude,
    longitude
  );

  const { mutate } = useMutation({
    mutationFn: create,
  });

  const handleClear = () => {
    reset();
    clearAddress();
  };

  const sendRequest = (data) => {
    mutate(data, {
      onSuccess: () => {
        requestAlert();
        handleClear();
      },
      onError: (error) => {
        occurError();
        console.error(error);
      },
    });
  };

  const handleRegisterAlert = (data) => {
    if (data.docsName && data.docsLocation.lat) {
      askAlert(data.docsName, address, data.docsCategory).then((result) => {
        if (result.isConfirmed) {
          sendRequest(data);
        }
      });
    }
  };

  const onCancel = () => {
    const isValidInput = getValues(DOCS_INFO.NAME) || inputAddress;
    if (isValidInput) {
      handleClear();
    }
  };

  const onSubmit = (data) => {
    if (!isLogin) {
      return nullTokenWrite();
    }

    isAddress();
    handleRegisterAlert(data);
  };

  return (
    <FormProvider {...methods}>
      <Container onSubmit={handleSubmit(onSubmit)}>
        <DocsInput
          type={DOCS_INFO.NAME}
          placeholder={HELPER_MSG.NAME}
          requiredMsg={ERROR_MSG.NAME}
          isLogin={isLogin}
          autoFocus
        >
          문서 제목
        </DocsInput>

        <DocsInput
          type={DOCS_INFO.LOCATION}
          placeholder={HELPER_MSG.LOCATION}
          value={inputAddress || ""}
          disabled
        >
          위치
        </DocsInput>

        <DocumentLabel htmlFor={DOCS_INFO.CATEGORY}>카테고리</DocumentLabel>
        <SelectInput
          id={DOCS_INFO.CATEGORY}
          name={DOCS_INFO.CATEGORY}
          list={CATEGORY}
        />

        <StyledButton>
          <Button
            color="primary"
            border="1px solid"
            border-color="primary"
            backgroundcolor="white"
            type="reset"
            onClick={onCancel}
          >
            등록 취소
          </Button>
          <Button type="submit" color="white" backgroundcolor="primary">
            등록 요청
          </Button>
        </StyledButton>
      </Container>
    </FormProvider>
  );
};

export const Container = styled.form`
  width: 21rem;
  height: 100vh;

  position: fixed;
  left: 15rem;
  top: 6rem;
  padding: 2rem;

  background-color: white;
  box-shadow: 10px 0px 5px 0px rgba(0, 0, 0, 0.106);

  #docsName,
  #docsLocation,
  #docsCategory {
    width: 100%;
    height: 2.5rem;
    margin-top: 0.8rem;
  }

  @media screen and (max-width: 1023px) {
    height: calc(100vh - 3.4rem);
    left: auto;
    top: 5rem;
  }

  @media screen and (max-width: 767px) {
    top: auto;
    bottom: 3.4rem;

    box-sizing: border-box;
    width: 100%;
    height: 35%;

    overflow-y: auto;
  }
`;

export const StyledButton = styled.div`
  position: absolute;
  right: 1.5rem;
  bottom: 12rem;

  @media screen and (max-width: 767px) {
    bottom: auto;
    right: auto;

    margin-top: 3rem;
    position: static;

    display: flex;
    justify-content: center;
    gap: 1rem;

    > * {
      width: 10rem;
    }
  }
`;

const DocsInput = styled(DocumentInputGroup)`
  height: 6rem;
  margin-bottom: 2rem;
`;

export default CreateDocument;
