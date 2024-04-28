import { Box } from "@mui/system";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { capitalizeFirstLetter } from "~/utils/formaters";
const MenuStyle = {
  color: "white",
  bgcolor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    bgcolor: "primary.50",
  },
};
function BoardBar(props) {
  const board = props.board;
  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976b2",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          sx={MenuStyle}
          icon={<DashboardIcon />}
          label={capitalizeFirstLetter(board.title)}
          clickable
        />
        <Chip
          sx={MenuStyle}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board.type)}
          clickable
        />
        <Chip
          sx={MenuStyle}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip sx={MenuStyle} icon={<BoltIcon />} label="Automation" clickable />
        <Chip
          sx={MenuStyle}
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddAltIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={5}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { bgcolor: "#a4b0be" },
            },
          }}
        >

          <Tooltip title="haiThanhTran">
            <Avatar
              alt="haiThanhTran"
              src="https://th.bing.com/th/id/OIP.h-k2RfzyAdzqhLP0VhXdbAHaE8?w=279&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            />
          </Tooltip>

          <Tooltip title="haiThanhTran">
            <Avatar
              alt="haiThanhTran"
              src="https://th.bing.com/th/id/OIP.oCU1h6bMV6I-zy72fpWwdgHaFi?w=217&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            />
          </Tooltip>

          <Tooltip title="haiThanhTran">
            <Avatar
              alt="haiThanhTran"
              src="https://th.bing.com/th/id/R.fedb6ebbfb9f6407e7981189678776f3?rik=qC0xIySN5nBcXw&pid=ImgRaw&r=0"
            />
          </Tooltip>

          <Tooltip title="haiThanhTran">
            <Avatar
              alt="haiThanhTran"
              src="https://th.bing.com/th/id/R.fedb6ebbfb9f6407e7981189678776f3?rik=qC0xIySN5nBcXw&pid=ImgRaw&r=0"
            />
          </Tooltip>

          <Tooltip title="haiThanhTran">
            <Avatar
              alt="haiThanhTran"
              src="https://th.bing.com/th/id/R.fedb6ebbfb9f6407e7981189678776f3?rik=qC0xIySN5nBcXw&pid=ImgRaw&r=0"
            />
          </Tooltip>

          <Tooltip title="haiThanhTran">
            <Avatar
              alt="haiThanhTran"
              src="https://th.bing.com/th/id/R.fedb6ebbfb9f6407e7981189678776f3?rik=qC0xIySN5nBcXw&pid=ImgRaw&r=0"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}
export default BoardBar;
