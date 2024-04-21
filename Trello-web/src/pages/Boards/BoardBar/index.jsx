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
function BoardBar() {
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
        borderBottom: '1px solid white',
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          sx={MenuStyle}
          icon={<DashboardIcon />}
          label="haiThanhTran"
          clickable
        />
        <Chip
          sx={MenuStyle}
          icon={<VpnLockIcon />}
          label="Public/Private Workspaces"
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
            gap:'10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border:'none'
            }
          }}
        >
          <Tooltip title="haiThanhTran">
            <Avatar
              alt="haiThanhTran"
              src="https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-1/375289051_958970645161748_1870848238690917828_n.jpg?stp=c0.93.320.320a_dst-jpg_p320x320&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=dA9v7AbhaOoAb5F0Bju&_nc_ht=scontent.fhan3-5.fna&oh=00_AfDQTL-Dsu167PUk-3yLPTG_2ajW1jBecVguZDaRLvViVQ&oe=6628481C"
            />
          </Tooltip>

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
