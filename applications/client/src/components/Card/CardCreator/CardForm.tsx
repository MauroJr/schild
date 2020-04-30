import React, { useRef, FormEvent } from 'react';
import styled from 'styled-components';
import { CardFrame } from '../CardFrame';
import { when } from '../../../utils';

const DefaultCard = styled(CardFrame)`
  border-radius: 3px;
  background-color: #fff;
  padding: 10px;
  margin-bottom: 7px;
  input {
    border: 0px;
    font-family: inherit;
    font-size: inherit;
  }
`;

const CardTitle = styled.input<any>`
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0px;
`;

const CardDescription = styled.input<any>`
  input {
    width: 100%;
  }
  margin-top: 10px;
`;
const StyledFormButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

const StyledButton = styled.button`
  background-color: #eee;
  border: none;
  padding: 5px;
  width: 45%;
  margin-top: 5px;
  border-radius: 3px;
  &:hover {
    transition: 0.3s;
    cursor: pointer;
    background-color: #ccc;
  }
`;

export function CardForm({ onConfirm, onCancel }: any) {
  const inputCardTitle = useRef<HTMLInputElement>();
  const inputCardDescription = useRef<HTMLInputElement>();

  function addCard(event: FormEvent) {
    event.preventDefault();
    when(inputCardTitle?.current?.value)((value: string) => {
      onConfirm({
        title: value,
        description: inputCardDescription?.current?.value,
      });
    });
  }

  return (
    <DefaultCard>
      <form onSubmit={addCard}>
        <CardTitle
          name="title"
          autoFocus
          defaultValue="Title"
          ref={inputCardTitle}
        />
        <CardDescription
          name="description"
          defaultValue="Description"
          ref={inputCardDescription}
        />
        <StyledFormButtons>
          <StyledButton type="submit">Add</StyledButton>
          <StyledButton type="button" onClick={onCancel}>
            Cancel
          </StyledButton>
        </StyledFormButtons>
      </form>
    </DefaultCard>
  );
}
