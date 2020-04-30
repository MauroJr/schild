import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const CardTemplate = styled.div`
  display: inline-block;
  white-space: normal;
`;

export function Card({ children, index, renderCard, disableCardDrag }: any) {
  return (
    <Draggable
      draggableId={String(children.id)}
      index={index}
      isDragDisabled={disableCardDrag}
    >
      {(provided, { isDragging }) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            data-testid="card"
          >
            <CardTemplate>{renderCard(isDragging)}</CardTemplate>
          </div>
        );
      }}
    </Draggable>
  );
}
