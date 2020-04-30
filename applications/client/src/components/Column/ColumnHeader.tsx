import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { CursorPointer } from '../Cursor';

const ColumnHeaderPlaceHolder = styled.div`
  padding-bottom: 10px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  span:nth-child(2) {
    cursor: pointer;
  }
`;

const DefaultButton = styled.button`
  color: #333333;
  background-color: #ffffff;
  border-color: #cccccc;
  :hover,
  :focus,
  :active {
    background-color: #e6e6e6;
  }
`;

const Input = styled.input`
  :focus {
    outline: none;
  }
`;

function ColumnTitle({ allowRenameColumn, onClick, children: title }: any) {
  return allowRenameColumn ? (
    <CursorPointer onClick={onClick}>{title}</CursorPointer>
  ) : (
    <span>{title}</span>
  );
}

function useRenameMode(state: any) {
  const [renameMode, setRenameMode] = useState(state);

  function toggleRenameMode() {
    setRenameMode(!renameMode);
  }

  return [renameMode, toggleRenameMode];
}

interface ColumnHeaderProps {
  children: any;
  allowRemoveColumn?: boolean;
  onColumnRemove?: Function;
  allowRenameColumn?: boolean;
  onColumnRename?: Function;
}

export function ColumnHeader({
  children: column,
  allowRemoveColumn = true,
  onColumnRemove = () => {},
  allowRenameColumn = true,
  onColumnRename = () => {},
}: ColumnHeaderProps) {
  const [renameMode, toggleRenameMode] = useRenameMode(false);
  const [titleInput, setTitleInput] = useState('');

  function handleRenameColumn(event: FormEvent) {
    event.preventDefault();

    onColumnRename(column, titleInput);
    toggleRenameMode();
  }

  function handleRenameMode() {
    setTitleInput(column.title);
    toggleRenameMode();
  }

  return (
    <ColumnHeaderPlaceHolder>
      {renameMode ? (
        <form onSubmit={handleRenameColumn}>
          <span>
            <Input
              type="text"
              value={titleInput}
              onChange={({ target: { value } }) => setTitleInput(value)}
              autoFocus
            />
          </span>
          <span>
            <DefaultButton type="submit">Rename</DefaultButton>
            <DefaultButton type="button" onClick={handleRenameMode}>
              Cancel
            </DefaultButton>
          </span>
        </form>
      ) : (
        <>
          <ColumnTitle
            allowRenameColumn={allowRenameColumn}
            onClick={handleRenameMode}
          >
            {column.title}
          </ColumnTitle>
          {allowRemoveColumn && (
            <span onClick={() => onColumnRemove(column)}>×</span>
          )}
        </>
      )}
    </ColumnHeaderPlaceHolder>
  );
}
