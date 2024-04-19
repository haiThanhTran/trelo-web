import { Box } from "@mui/system";
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar';
import BoardBar from "../Boards/BoardBar";
import BoardContent from "../Boards/BoardContent";

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar />
      <BoardContent />
    </Container>
  );
}
export default Board;
