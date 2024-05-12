import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { Box } from "@mui/system";
import React, { useState } from "react";
import Trello_Card from "./Card/Card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListCards({ cards }) {
  return (
    <SortableContext
      items={cards?.map((c) => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          p: "0 5px 5px 5px",
          m: "0 5px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
          overflowX: "hidden",
          overflowY: "auto",

          maxHeight: (theme) =>
            `calc(
            ${theme.trello.boardContentHeight} -
            ${theme.spacing(5)} - 
            ${theme.trello.columnHeaderHeight} - 
            ${theme.trello.columnFooterHeight})`,

          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ced0da" },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#bfc2cf",
          },
        }}
      >
        {/* First Card */}
        {cards?.map((card) => (
          <Trello_Card key={card._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;
