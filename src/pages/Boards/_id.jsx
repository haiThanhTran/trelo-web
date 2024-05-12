import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "~/pages/Boards/BoardContent/BoardContent";
import { mockData } from "~/apis/mock-data";
import { fetchBoardDetailsAPI } from "~/apis";
function Board() {
  const boardId = "663f9ebffdefd53777168b0e";
  const [board, setBoard] = useState(fetchBoardDetailsAPI(boardId));
  useEffect(() => {
    const boardId = "663f9ebffdefd53777168b0e";
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
    });
    // Call API
  }, []);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
}
export default Board;
