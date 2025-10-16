'use client';;
import {
  closestCenter,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import tunnel from 'tunnel-rat';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const t = tunnel();

const KanbanContext = createContext({
  columns: [],
  data: [],
  activeCardId: null,
});

export const KanbanBoard = ({
  id,
  children,
  className
}) => {
  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id,
    data: {
      type: 'column',
      column: { id },
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${id}`,
    data: {
      type: 'column',
      column: { id },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Combine both refs
  const combinedRef = (node) => {
    setDragRef(node);
    setDropRef(node);
  };

  return (
    <div
      className={cn(
        'flex size-full min-h-40 flex-col divide-y overflow-hidden rounded-md border bg-secondary text-xs shadow-sm ring-2 transition-all',
        isOver ? 'ring-primary' : 'ring-transparent',
        isDragging && 'opacity-30 cursor-grabbing',
        className
      )}
      ref={combinedRef}
      style={style}
      {...attributes}>
      {/* Drag handle on the header */}
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        {children}
      </div>
    </div>
  );
};

export const KanbanCard = (
  {
    id,
    name,
    children,
    className
  }
) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
  });
  const { activeCardId } = useContext(KanbanContext);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div style={style} {...listeners} {...attributes} ref={setNodeRef}>
        <Card
          className={cn(
            'cursor-grab gap-4 rounded-md p-3 shadow-sm',
            isDragging && 'pointer-events-none cursor-grabbing opacity-30',
            className
          )}>
          {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              'cursor-grab gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary',
              isDragging && 'cursor-grabbing',
              className
            )}>
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  );
};

export const KanbanCards = (
  {
    children,
    className,
    ...props
  }
) => {
  const { data } = useContext(KanbanContext);
  const filteredData = data
    .filter((item) => item.column === props.id)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)); // Sort by position
  const items = filteredData.map((item) => item.id);

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div className={cn('flex flex-grow flex-col gap-2 p-2', className)} {...props}>
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export const KanbanHeader = ({
  className,
  ...props
}) => (
  <div className={cn('m-0 p-2 font-semibold text-sm', className)} {...props} />
);

// Custom collision detection for Kanban boards
// This prioritizes pointer position and handles nested droppables correctly
const customCollisionDetection = (args) => {
  const { droppableContainers } = args;

  // First, check if pointer is within any droppable
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    // Get all column IDs by looking for droppables with 'column' type in their data
    // Columns can have both numeric IDs and 'column-X' string IDs
    const columnIds = new Set();
    droppableContainers.forEach((container) => {
      if (container.data.current?.type === 'column') {
        // Add numeric IDs directly
        if (typeof container.id === 'number') {
          columnIds.add(container.id);
        }
        // Extract numeric ID from 'column-X' strings
        if (typeof container.id === 'string' && container.id.startsWith('column-')) {
          const numericId = parseInt(container.id.replace('column-', ''));
          columnIds.add(numericId);
        }
      }
    });

    // Separate column collisions from card collisions
    // Check both numeric IDs and 'column-X' string IDs
    const columnCollisions = pointerCollisions.filter(({ id }) => {
      if (typeof id === 'number' && columnIds.has(id)) return true;
      if (typeof id === 'string' && id.startsWith('column-')) {
        const numericId = parseInt(id.replace('column-', ''));
        return columnIds.has(numericId);
      }
      return false;
    });

    const cardCollisions = pointerCollisions.filter(({ id }) => {
      if (typeof id === 'string' && id.startsWith('column-')) return false;
      if (typeof id === 'number' && columnIds.has(id)) return false;
      return true;
    });

    // If dragging a card and we have collisions
    if (args.active && !String(args.active.id).startsWith('column-')) {
      // IMPORTANT: Prioritize card collisions over column collisions
      // Cards are smaller and more specific than columns, so if we detect a card, use it
      if (cardCollisions.length > 0) {
        return cardCollisions;
      }
      // Only use column collisions if there are no card collisions (empty column)
      if (columnCollisions.length > 0) {
        // Convert 'column-X' string IDs to numeric IDs for proper highlighting
        return columnCollisions.map(collision => {
          if (typeof collision.id === 'string' && collision.id.startsWith('column-')) {
            const numericId = parseInt(collision.id.replace('column-', ''));
            return { ...collision, id: numericId };
          }
          return collision;
        });
      }
    }

    // For other cases, convert any 'column-X' strings to numeric and prefer those
    const convertedCollisions = pointerCollisions.map(collision => {
      if (typeof collision.id === 'string' && collision.id.startsWith('column-')) {
        const numericId = parseInt(collision.id.replace('column-', ''));
        return { ...collision, id: numericId };
      }
      return collision;
    });

    const numericCollisions = convertedCollisions.filter(({ id }) => typeof id === 'number');
    if (numericCollisions.length > 0) {
      return numericCollisions;
    }

    return convertedCollisions;
  }

  // Fallback to rectangle intersection for better accuracy
  const intersectionCollisions = rectIntersection(args);

  if (intersectionCollisions.length > 0) {
    return intersectionCollisions;
  }

  // Final fallback to closest corners
  return closestCorners(args);
};

export const KanbanProvider = (
  {
    children,
    onDragStart,
    onDragEnd,
    onDragOver,
    className,
    columns,
    data,
    onDataChange,
    ...props
  }
) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;

    if (!active || !active.id) return;

    // Check if dragging a column
    const activeIdStr = String(active.id);
    if (activeIdStr.startsWith('column-')) {
      const columnId = parseInt(activeIdStr.replace('column-', ''));
      setActiveColumnId(columnId);
    } else {
      // Check if dragging a card
      const card = data.find((item) => item.id === active.id);
      if (card) {
        setActiveCardId(active.id);
      }
    }

    onDragStart?.(event);
  };

  const handleDragOver = (event) => {
    // Disable automatic column updates during drag to prevent visual glitches
    // Let the parent component handle all data updates in onDragEnd
    onDragOver?.(event);
  };

  const handleDragEnd = (event) => {
    setActiveCardId(null);
    setActiveColumnId(null);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      onDragEnd?.(event);
      return;
    }

    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);

    // Check if reordering within the same column
    if (activeItem && overItem && activeItem.column === overItem.column) {
      // Handle same-column reordering
      let newData = [...data];
      const oldIndex = newData.findIndex((item) => item.id === active.id);
      const newIndex = newData.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        newData = arrayMove(newData, oldIndex, newIndex);
        onDataChange?.(newData);
      }
    }

    // Always call the parent's onDragEnd for backend updates
    onDragEnd?.(event);
  };

  const announcements = {
    onDragStart({ active }) {
      const { name, column } = data.find((item) => item.id === active.id) ?? {};

      return `Picked up the card "${name}" from the "${column}" column`;
    },
    onDragOver({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;

      return `Dragged the card "${name}" over the "${newColumn}" column`;
    },
    onDragEnd({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;

      return `Dropped the card "${name}" into the "${newColumn}" column`;
    },
    onDragCancel({ active }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};

      return `Cancelled dragging the card "${name}"`;
    },
  };

  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={customCollisionDetection}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}>
        <SortableContext items={columns.map(col => `column-${col.id}`)}>
          <div
            className={cn('flex justify-start gap-8', className)}>
            {columns.map((column) => children(column))}
          </div>
        </SortableContext>
        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay>
              {activeColumnId ? (
                <div className="flex size-full min-h-40 flex-col divide-y overflow-hidden rounded-md border bg-secondary text-xs shadow-lg ring-2 ring-primary opacity-80 min-w-80 max-w-96">
                  {(() => {
                    const column = columns.find(col => col.id === activeColumnId);
                    return column ? children(column) : null;
                  })()}
                </div>
              ) : (
                <t.Out />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  );
};