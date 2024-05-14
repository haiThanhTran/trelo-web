import { Box } from "@mui/system";
import ListColumns from "./ListColumns/ListColumns";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core"; // Import DndContext
import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { mapOrder } from "~/utils/sorts";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState, useCallback, useRef } from "react";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formaters";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumn,
  moveCardInSameColumn,
}) {
  //
  const poiterSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });

  // const sensors = useSensors(poiterSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedState] = useState([]);

  // Cùng 1 thời điểm chỉ có 1 phần tử dạng được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState([null]);
  const [activeDragItemType, setActiveDragItemType] = useState([null]);
  const [activeDragItemData, setActiveDragItemData] = useState([null]);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([
    null,
  ]);
  //Điểm va chạm cuối cùng (xử lý thuật toán va chạm)
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedState(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    );
  };
  //Cap nhat lai state trong truong hop di chuyen card giua cac Column khac nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedState((prevColumn) => {
      // Tìm vị trí (index) của cái overCard trong column đích
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );
      // console.log("overCardIndex", overCardIndex);

      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      const nextColumns = cloneDeep(prevColumn);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );

      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        // Xoá card ở cái column active ( cũng có thể hiểu là column cũ,cái lúc mà kéo card ra hỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        //Them placeholder Card neu column rong
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }

      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa,nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        //Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          activeDraggingCardData
        );

        //Xóa cái placehoder cũ đi nếu nó tồn tại
        // nextOverColumn.cards = nextOverColumn.filter(
        //   (card) => !card.FE_PlaceholderCard
        // );

        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }
      // console.log("nextColumns", nextColumns);
      //Clone mảng
      return nextColumns;
    });
  };

  //Trigger khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    // console.log("handleDragStart",event)
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  //Trigger trong quá trình kéo (drag) 1 phần tử
  const handleDragOver = (event) => {
    //0 làm gì nếu như nó đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    //Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các column
    // console.log("handleDragOver", event);
    const { active, over } = event;
    //Kiểm tra nếu như 0 tồn tại over và active (kéo linh tinh ) thì nó return
    if (!active || !over) return;

    //activeDraggingCard là cái card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    //cái over là cái đang tương tác với cái trên
    const { id: overCardId } = over;

    //Tìm 2 cái column đang được tương tác
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    // console.log("activeColumn: ", activeColumn);
    // console.log("overColumn: ", overColumn);
    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  //Trigger khi thả 1 phần tử
  const handleDragEnd = (event) => {
    const { active, over } = event;
    //Kiểm tra nếu như 0 tồn tại over và active (kéo linh tinh ) thì nó return
    if (!active || !over) return;
    // console.log("handleDragEnd", event);

    //Xử lý kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCard là cái card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      //cái over là cái đang tương tác với cái trên
      const { id: overCardId } = over;

      //Tìm 2 cái column đang được tương tác
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);
      if (!activeColumn || !overColumn) return;

      // console.log("activeDragItemData", activeDragItemData);
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //Hành động kéo card khác column
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        //Hành động kéo card cùng 1 column

        // Lấy vị trí cũ từ oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        );
        //Lấy vị trí mới từ over
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );

        //Dùng arrayMove vì kéo cards trong 1 cái column thì tương tự kéo column trong 1 board content
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );

        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id);
        setOrderedState((prevColumn) => {
          const nextColumns = cloneDeep(prevColumn);

          //Tìm tới cái Column mà chúng ta đang thả
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          //Cập nhật giá trị 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);

          return nextColumns;
        });
        moveCardInSameColumn(dndOrderedCards,dndOrderedCardIds,oldColumnWhenDraggingCard._id);
      }
    }

    //Xử lý kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Kiểm tra nếu như vị trí thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ từ active
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );
        //Lấy vị trí mới từ over
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        setOrderedState(dndOrderedColumns);
        moveColumn(dndOrderedColumns);
      }
    }
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };
  //args
  const collisionDetectionStrategy = useCallback(
    (args) => {
      //Nếu kéo column thì vẫn dùng cái phát hiện va chạm closestCorner
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // console.log("arg", args);

      //Tim cac diem giao nhau,va cham voi con tro
      const pointerIntersection = pointerWithin(args);
      console.log("pointerIntersection", pointerIntersection);

      if (!pointerIntersection?.length) return;
      //Thuat toan phat hien va cham se tra ve 1 mang cac va cham o day
      // const intersections =
      //   pointerIntersection?.length > 0
      //     ? pointerIntersection
      //     : rectIntersection(args);
      //Tìm overId đầu tiên va chạm
      let overId = getFirstCollision(pointerIntersection, "id");
      console.log("overId: ", overId);
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container._id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }
      // If there are no collisions with the pointer, return rectangle intersections
      // Nếu không có xung đột với con trỏ, trả về giao điểm hình chữ nhật
      //Nếu overID là null thì trả về mảng rỗng -tránh crash
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976b2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}
export default BoardContent;
