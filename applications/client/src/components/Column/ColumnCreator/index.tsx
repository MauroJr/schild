import React, { useState } from 'react';
import styled from 'styled-components';
import { ColumnForm } from './ColumnForm';

const Placeholder = styled.div`
  border: 2px dashed #eee;
  min-width: 230px;
  height: 132px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`;

export function ColumnCreator({ onConfirm }: any) {
  const [isAddingColumn, setAddingColumn] = useState(false);

  function confirmColumn(title: string) {
    onConfirm(title);
    setAddingColumn(false);
  }

  return isAddingColumn ? (
    <ColumnForm
      onConfirm={confirmColumn}
      onCancel={() => setAddingColumn(false)}
    />
  ) : (
    <Placeholder onClick={() => setAddingColumn(true)} role="button">
      <span role="img" aria-label="add column">
        ➕
      </span>
    </Placeholder>
  );
}
