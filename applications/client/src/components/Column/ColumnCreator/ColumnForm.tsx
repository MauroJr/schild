import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { StyledColumn } from '../../Column';
import { when } from '@schild/client/src/utils';

const StyledColumnForm = styled(StyledColumn)`
  min-width: 230px;
  form {
    display: flex;
    justify-content: space-between;
  }
`;

export function ColumnForm({ onConfirm, onCancel }: any) {
  const inputColumnTitle = React.createRef<HTMLInputElement>();

  function addColumn(event: FormEvent) {
    event.preventDefault();

    when(inputColumnTitle?.current?.value)(onConfirm);
  }

  return (
    <StyledColumnForm>
      <form onSubmit={addColumn}>
        <input type="text" ref={inputColumnTitle} autoFocus />
        <button type="submit">Add</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </StyledColumnForm>
  );
}
