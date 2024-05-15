import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "~/pages/Boards/BoardContent/BoardContent";
import { mockData } from "~/apis/mock-data";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { generatePlaceholderCard } from "~/utils/formaters";
import { isEmpty } from "lodash";
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumndDetailsAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis";
function Board() {
  const boardId = "663f9ebffdefd53777168b0e";
  const [board, setBoard] = useState(fetchBoardDetailsAPI(boardId));
  useEffect(() => {
    const boardId = "663f9ebffdefd53777168b0e";
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        }
      });
      console.log("Full board", board);
      setBoard(board);
    });
    // Call API
  }, []);

  //Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    console.log("createdColumn", createdColumn);

    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    //Cập nhật lại state board
    const newBoard = {
      ...board,
    };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  //Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    const newBoard = {
      ...board,
    };
    const newColumnUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    if (newColumnUpdate) {
      newColumnUpdate.cards.push(createdCard);
      newColumnUpdate.cardOrderIds.push(createdCard._id);
    }
    setBoard(newBoard);
    //Cập nhật lại state board
  };

  //Func này có nhiệm vụ gọi API và xử lý khi kéo thả xong xuôi
  const moveColumn = (dndOrderedColumns) => {
    //Id order sau khi cập nhật từ UI
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    //Cập nhật lại state board
    const newBoard = {
      ...board,
    };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    //Gọi Api
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds,
    });
  };

  const moveCardInSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const newBoard = {
      ...board,
    };
    const newColumnUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (newColumnUpdate) {
      newColumnUpdate.cards = dndOrderedCards;
      newColumnUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);

    updateColumndDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  };

  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    console.log("currentCardId", currentCardId);
    console.log("prevColumnId", prevColumnId);
    console.log("nextColumnId", nextColumnId);
    console.log("dndOrderedColumns", dndOrderedColumns);

    //Id order sau khi cập nhật từ UI
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    //Cập nhật lại state board
    const newBoard = {
      ...board,
    };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    //Gọi API
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find((c) => c._id === prevColumnId)
        ?.cardOrderIds,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    });
  };
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
        moveCardInSameColumn={moveCardInSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}
export default Board;
