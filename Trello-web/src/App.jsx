import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import HomeIcon from "@mui/icons-material/Home"
import { pink } from "@mui/material/colors"
import Typography from "@mui/material/Typography"
import {useColorScheme} from "@mui/material/styles"
import Button from "@mui/material/Button"

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? "Turn dark" : "Turn light"}
    </Button>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ModeToggle/>
      <hr />
      <div>haiThanhTran</div>
      <Typography variant="body2" color="text.secondary">
        Hai
      </Typography>
      <Button variant="contained">Hello world</Button>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>

      <AccessAlarmIcon />
      <AccessAlarmIcon />

      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />
      <HomeIcon sx={{ color: pink[500] }} />
    </>
  );
}

export default App;
