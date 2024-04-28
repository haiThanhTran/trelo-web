import { Box } from "@mui/system";
import ListColumns from "./ListColumns/ListColumns";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core"; // Import DndContext
import { mapOrder } from "~/utils/sorts";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
function BoardContent({ board }) {
  //
  const poiterSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 }});

  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 }});

  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay:250, tolerance:5 } } );


  // const sensors = useSensors(poiterSensor);
  const sensors = useSensors(mouseSensor,touchSensor)

  const [orderedColumns, setOrderedState] = useState([]);

  useEffect(() => {
    setOrderedState(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    console.log("handleDragEnd", event);
    const { active, over } = event;
    //Kiểm tra nếu như 0 tồn tại over (kéo linh tinh ) thì nó return
    if (!over) return;

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
  };
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  );
}
export default BoardContent;
