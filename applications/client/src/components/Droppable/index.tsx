import React, { ComponentType } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

export function withDroppable(Component: ComponentType<any>) {
  return function WrapperComponent({
    children,
    ...droppableProps
  }: DroppableProps) {
    return (
      <Droppable {...droppableProps}>
        {(provided) => (
          <Component ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </Component>
        )}
      </Droppable>
    );
  };
}
