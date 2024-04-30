import { Box } from "@mui/system";
import ListColumns from "./ListColumns/ListColumns";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"; // Import DndContext
import { mapOrder } from "~/utils/sorts";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
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

  useEffect(() => {
    setOrderedState(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    );
  };

  const handleDragStart = (event) => {
    // console.log("handleDragStart",event)
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
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
    console.log('active: ',active)
    console.log('over: ',over)

    //Tìm 2 cái column đang được tương tác
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    console.log("activeColumn: ",activeColumn)
    console.log("overColumn: ",overColumn)
    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      setOrderedState((prevColumn) => {
        // Tìm vị trí (index) của cái overCard trong column đích
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );
        console.log("overCardIndex", overCardIndex);

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
          nextOverColumn.cards=nextOverColumn.cards.toSpliced(newCardIndex,0,activeDraggingCardData)

          //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds=nextOverColumn.cards.map(card => card._id)
        }
        console.log("nextColumns",nextColumns)
        //Clone mảng
        return nextColumns;
      });
    }
  };

  const handleDragEnd = (event) => {
    // console.log("handleDragEnd", event);
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log("hành động kéo thả card");
      return;
    }

    const { active, over } = event;
    //Kiểm tra nếu như 0 tồn tại over và active (kéo linh tinh ) thì nó return
    if (!active || !over) return;

    //Kiểm tra nếu như vị trí thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // Lấy vị trí cũ từ active
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      //Lấy vị trí mới từ over
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds=dndOrderedColumns.map(c => c._id)
      // console.log("dndOrderedColumns:",dndOrderedColumns)
      // console.log("dndOrderedColumnsIds:",dndOrderedColumnsIds)
      setOrderedState(dndOrderedColumns);
    }
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      sensors={sensors}
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
        <ListColumns columns={orderedColumns} />
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