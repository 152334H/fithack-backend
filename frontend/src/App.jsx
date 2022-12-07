import { useState } from 'react'
import { Paper, BottomNavigation, BottomNavigationAction, Avatar } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map';
import './App.css'
import { useEffect } from 'react';

const App = () => {
  const [page, setPage] = useState("home")
  const [user, setUser] = useState("Kai Xiang")
  const [userLetters, setUserLetters] = useState("")

  useEffect(() => {
    const userWords = user.split(" ")
    if (userWords.length > 1) {
      setUserLetters(userWords[0][0] + userWords[1][0])
    }
    else setUserLetters(userWords[0][0])

  }, [])

  return (
    <div className="overallBackground" style={{ overflowX: "hidden", height: "100vh", width: "100vw" }}>
      <div style={{ margin: "2ch" }}>
        <Paper elevation={20} style={{display: "flex", alignItems: "center", padding: "2ch"}}>
          <Avatar style={{marginRight: "1ch"}}>{userLetters}</Avatar>
          <span>Welcome Back, {user}</span>
        </Paper>
      </div>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={12}>
        <BottomNavigation sx={{ backgroundColor: "transparent" }} value={page} onChange={(e, newValue) => { setPage(newValue) }}>
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Map"
            value="map"
            icon={<MapIcon />}
          />
        </BottomNavigation>
      </Paper>
    </div>
  )
}

export default App
