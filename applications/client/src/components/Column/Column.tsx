import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { withDroppable } from '../Droppable';
import { CardCreator } from '../Card/CardCreator';
import { Card } from '../Card';

export const StyledColumn = styled.div`
  height: 100%;
  display: inline-block;
  padding: 15px;
  border-radius: 2px;
  background-color: #eee;
  margin: 5px;
  vertical-align: top;
`;

const DroppableColumn = withDroppable(styled.div`
  min-height: 28px;
`);

const CardPlaceholder = styled.div`
  box-sizing: border-box;
  max-width: 250px;
  min-width: 250px;
`;

interface ColumnProps {
  children: any;
  index: number;
  renderHeader: Function;
  onCardNew: Function;
  renderCard: Function;
}

export function Column({
  children,
  index: columnIndex,
  renderCard,
  renderHeader,
  onCardNew,
}: ColumnProps) {
  return (
    <Draggable draggableId={`column-${children.id}`} index={columnIndex}>
      {(column) => (
        <StyledColumn
          ref={column.innerRef}
          {...column.draggableProps}
          data-testid="column"
        >
          <div {...column.dragHandleProps} data-testid="column-header">
            {renderHeader(children)}
          </div>

          <CardCreator column={children} onConfirm={onCardNew} />

          <DroppableColumn droppableId={String(children.id)}>
            {children.cards.length ? (
              children.cards.map((card: any, index: any) => (
                <Card
                  key={card.id}
                  index={index}
                  renderCard={(dragging: any) =>
                    renderCard(children, card, dragging)
                  }
                >
                  {card}
                </Card>
              ))
            ) : (
              <CardPlaceholder />
            )}
          </DroppableColumn>
        </StyledColumn>
      )}
    </Draggable>
  );
}
