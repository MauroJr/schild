import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import { Column, ColumnCreator, ColumnHeader } from '../Column';
import { withDroppable } from '../Droppable';
import { when, partialRight, noop } from '@schild/client/src/utils';
import { DefaultCard } from '../Card/DefaultCard';
import {
  getCard,
  getCoordinates,
  isAColumnMove,
  isMovingAColumnToAnotherPosition,
  isMovingACardToAnotherPosition,
} from './services';
import {
  moveCard,
  moveColumn,
  addColumn,
  removeColumn,
  changeColumn,
  addCard,
  removeCard,
} from '../../helpers';

const StyledBoard = styled.div`
  padding: 5px;
  overflow-y: hidden;
  display: flex;
  align-items: flex-start;
`;

const Columns = styled.div`
  white-space: nowrap;
`;

const DroppableBoard = withDroppable(Columns);

interface BoardProps {
  initialBoard: any;
  onCardDragEnd?: Function;
  onColumnDragEnd?: Function;
  allowAddColumn?: boolean;
  onColumnRemove?: Function;
  allowRemoveColumn?: boolean;
  allowRenameColumn?: boolean;
  onColumnRename?: Function;
  onAddCard: Function;
  onCardRemove?: Function;
  onAddColumn: Function;
  allowAddCard?: boolean;
  allowRemoveCard?: boolean;
  onNewCardConfirm?: Function;
}

export function Board({
  initialBoard,
  onCardDragEnd = noop,
  onColumnDragEnd = noop,
  onColumnRemove = noop,
  allowRemoveColumn = true,
  allowRenameColumn = true,
  onColumnRename = noop,
  onAddCard,
  onCardRemove = noop,
  onAddColumn,
  allowAddCard = true,
  allowRemoveCard = true,
  onNewCardConfirm = noop,
}: BoardProps) {
  const [board, setBoard] = useState(initialBoard);
  const handleOnCardDragEnd = partialRight(handleOnDragEnd, {
    moveCallback: moveCard,
    notifyCallback: onCardDragEnd,
  });
  const handleOnColumnDragEnd = partialRight(handleOnDragEnd, {
    moveCallback: moveColumn,
    notifyCallback: onColumnDragEnd,
  });

  function handleOnDragEnd(
    { source, destination, subject }: any,
    { moveCallback, notifyCallback }: any
  ) {
    const reorderedBoard = moveCallback(board, source, destination);
    when(notifyCallback)((callback: Function) =>
      callback(reorderedBoard, subject, source, destination)
    );
    setBoard(reorderedBoard);
  }

  async function handleColumnAdd(newColumn: any) {
    const column = await onAddColumn(newColumn);
    const boardWithNewColumn = addColumn(board, column);
    setBoard(boardWithNewColumn);
  }

  function handleColumnRemove(column: any) {
    const filteredBoard = removeColumn(board, column);
    onColumnRemove(filteredBoard, column);
    setBoard(filteredBoard);
  }

  function handleColumnRename(column: any, title: string) {
    const boardWithRenamedColumn = changeColumn(board, column, { title });
    onColumnRename(boardWithRenamedColumn, { ...column, title });
    setBoard(boardWithRenamedColumn);
  }

  async function handleAddCard(column: any, card: any, options = {}) {
    const newCard = await onAddCard(card);
    const boardWithNewCard = addCard(board, column, newCard, options);
    setBoard(boardWithNewCard);
  }

  function handleCardRemove(column: any, card: any) {
    const boardWithoutCard = removeCard(board, column, card);
    onCardRemove(
      boardWithoutCard,
      boardWithoutCard.columns.find(({ id }: any) => id === column.id),
      card
    );
    setBoard(boardWithoutCard);
  }

  return (
    <BoardContainer
      onCardDragEnd={handleOnCardDragEnd}
      onColumnDragEnd={handleOnColumnDragEnd}
      renderColumnAdder={() => {
        if (!allowRemoveColumn) return null;
        return (
          <ColumnCreator
            onConfirm={(title: any) => handleColumnAdd({ title, cards: [] })}
          />
        );
      }}
      renderCard={(column: any, card: any, dragging: any) => (
        <DefaultCard
          dragging={dragging}
          allowRemoveCard={allowRemoveCard}
          onCardRemove={(card: any) => handleCardRemove(column, card)}
        >
          {card}
        </DefaultCard>
      )}
      allowRemoveColumn={allowRemoveColumn}
      onColumnRemove={handleColumnRemove}
      allowRenameColumn={allowRenameColumn}
      onColumnRename={handleColumnRename}
      onCardNew={handleAddCard}
      allowAddCard={allowAddCard && onNewCardConfirm}
    >
      {board}
    </BoardContainer>
  );
}

function BoardContainer({
  children: board,
  renderCard,
  disableColumnDrag,
  disableCardDrag,
  renderColumnHeader,
  renderColumnAdder,
  allowRemoveColumn,
  onColumnRemove,
  allowRenameColumn,
  onColumnRename,
  onColumnDragEnd,
  onCardDragEnd,
  onCardNew,
  allowAddCard,
}: any) {
  function handleOnDragEnd(event: any) {
    const coordinates = getCoordinates(event, board);
    if (!coordinates.source) return;

    isAColumnMove(event.type)
      ? isMovingAColumnToAnotherPosition(coordinates) &&
        onColumnDragEnd({
          ...coordinates,
          subject: board.columns[coordinates.source.fromPosition],
        })
      : isMovingACardToAnotherPosition(coordinates) &&
        onCardDragEnd({
          ...coordinates,
          subject: getCard(board, coordinates.source),
        });
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <StyledBoard>
        <DroppableBoard
          droppableId="board-droppable"
          direction="horizontal"
          type="BOARD"
        >
          {board.columns.map((column: any, index: number) => (
            <Column
              key={column.id}
              index={index}
              renderCard={renderCard}
              renderHeader={(column: any) => (
                <ColumnHeader
                  onColumnRemove={onColumnRemove}
                  onColumnRename={onColumnRename}
                >
                  {column}
                </ColumnHeader>
              )}
              onCardNew={onCardNew}
            >
              {column}
            </Column>
          ))}
        </DroppableBoard>
        {renderColumnAdder()}
      </StyledBoard>
    </DragDropContext>
  );
}
