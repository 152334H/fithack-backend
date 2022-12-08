import { Fragment, useState } from 'react'
import { CircularProgress, Button, Paper, BottomNavigation, BottomNavigationAction, Avatar, Grow, Fade, TextField, InputAdornment, Collapse, Grid, Skeleton } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import './App.css'
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import debounce from 'lodash.debounce'
import milkPicture from './assets/milk.webp'
import fairpricelogo from './assets/fairpricelogo.png'
import ViewListIcon from '@mui/icons-material/ViewList';
import Categories from './Categories';
import ItemPage from './ItemPage';
import Map from './Map';

window.address = "http://irscybersec.ml:5170"

const listLoadingSkeleton = []
for (let i = 0; i < 6; i++) {
  listLoadingSkeleton.push(
    <Grid item xs={6} sm={6} md={4} lg={3}>
      <Skeleton animation="wave" variant="rectangular" height="30vh" />
    </Grid>)
}

// It appears that putting the debounced function INSIDE the functional component causes re-renders at every setState
// and hence causes the debouncer to fail
const debouncedUpdate = debounce((callAPIUpdate, value) => {
  callAPIUpdate(value)
}, 500)

let fullOriginalItemList = []

const App = () => {
  const theme = useTheme()
  const [searchVal, setSearchVal] = useState("")
  const [page, setPage] = useState("home")
  const [center, setCenter] = useState({ //center of map
    lat: 100,
    lng: 200
  })
  const [zoom, setZoom] = useState(10)
  const [user, setUser] = useState("Kai Xiang")
  const [isQnA, setisQnA] = useState(false)
  const [userLetters, setUserLetters] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchLoading, setSearchLoading] = useState(true)
  const [searchErrored, setSearchErrored] = useState(false)
  const [items, setItems] = useState([])
  const [itemDetails, setItemDetails] = useState({
    name: "HL MILK",
    price: 1.50,
    category: "Drink",
    location: "Shelf E5",
    amount: 5
  })
  const [isProductSearch, setIsProductSearch] = useState(false)

  useEffect(() => {
    const userWords = user.split(" ")
    if (userWords.length > 1) {
      setUserLetters(userWords[0][0] + userWords[1][0])
    }
    else setUserLetters(userWords[0][0])
    getItems()
  }, [])

  const getItems = async () => {
    await fetch(window.address + "/listing/unsorted", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((results) => {
      return results.json(); //return data in JSON (since its JSON data)
    }).then((data) => {
      setItems(data)
      fullOriginalItemList = data
    }).catch((error) => {
      console.log(error)
    })
    setSearchLoading(false)
  }

  const callAPIUpdate = async (value) => {
    
    if (value === "") {
      setIsProductSearch(false)
    }
    else {

      setIsProductSearch(true)
      // call search API here

      await fetch(window.address + "/gpt/classify", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: value
        })
      }).then((results) => {
        return results.json(); //return data in JSON (since its JSON data)
      }).then((data) => {
        if ("error" in data) {
          setSearchErrored(true)
        }
        else {
          if (data.variant === "item") {
            setisQnA(false)
            const newItemList = []
            for (let i = 0; i < data.relatedItems.length; i++) {
              newItemList.push(data.relatedItems[i].item)
            }
            setItems(newItemList)
          }
          else if (data.variant === "help") {
            setisQnA(true)
          }
        }

      }).catch((error) => {
        setSearchErrored(true)
        console.log(error)
      })

    }
    setSearchLoading(false)

  }

  const viewItem = (itemInfo) => {
    setItemDetails(itemInfo)
    setPage("itemPage")
  }



  return (
    <div className='overallBackground' style={{ overflowX: "hidden", height: "100vh", width: "100vw" }}>

      <div style={{ margin: "2ch", marginBottom: "10vh" }}>
        {page === "home" && (
          <Fragment>
            <Grow in={true}>
              <Paper elevation={16} style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "2ch", borderRadius: "15px" }}>
                <Avatar style={{ marginRight: "1ch", backgroundColor: theme.palette.primary.main }}>{userLetters}</Avatar>
                <span style={{ fontWeight: 450, fontSize: "1.1em", marginRight: "1ch", }}>Welcome Back, <span style={{ fontWeight: 600 }}>{user}</span></span>
                <img src={fairpricelogo} style={{ height: "4ch", borderRadius: "10px" }} />
              </Paper>
            </Grow>

            <Fade in={true} style={{ transitionDelay: '120ms' }}>
              <Paper className="searchBGStyle" elevation={12} style={{ marginTop: "3vh", borderRadius: "10px" }}>
                <TextField
                  value={searchVal}
                  onFocus={() => { setSearchFocused(true) }}
                  onBlur={() => { setSearchFocused(false) }}
                  onChange={(e) => {
                    debouncedUpdate(callAPIUpdate, e.target.value)
                    setSearchVal(e.target.value)
                    if (!searchLoading) setSearchLoading(true)
                    setSearchErrored(false)
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Collapse orientation="horizontal" in={!searchFocused}>
                          <span style={{ fontSize: "1.2em" }}>
                            👉
                          </span>
                        </Collapse>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchLoading && (
                          <Fade in={true}>
                            <CircularProgress style={{ color: "#fadb14" }} />
                          </Fade>
                        )}
                      </InputAdornment>
                    )
                  }}
                  className="roundedTextField" fullWidth style={{ borderRadius: "10px", color: "white" }} placeholder={'Ask me anything...'} />
              </Paper>
            </Fade>

            <Fade in={true} style={{ transitionDelay: '240ms' }} >
              <div style={{ display: "flex", justifyContent: "center", marginTop: "2vh", flexDirection: "column" }}>
                {searchLoading ? (
                  <Fragment>
                    {listLoadingSkeleton}
                  </Fragment>
                ) : (
                <Fragment>
                  {isProductSearch && (
                    <Button style={{ alignSelf: "center", marginBottom: "2vh" }} variant="contained" onClick={() => {
                      setSearchVal("")
                      setIsProductSearch(false)
                      setSearchErrored(false)
                      setItems(fullOriginalItemList)
                      setisQnA(false)
                    }}>Clear Search</Button>
                  )}

                  {!searchErrored && !isQnA && (
                    <Fragment>
                      {isProductSearch ? (
                        <h3 style={{ marginBottom: "1vh", marginTop: 0 }}>Are you looking for these products?</h3>
                      ) : (
                        <h3 style={{ marginBottom: "1vh", marginTop: 0 }}>Recommended Products For You</h3>
                      )}
                    </Fragment>
                  )}

                  <Grid rowSpacing={3} container spacing={2} alignItems="stretch">
                    {searchErrored ? (
                      <Grid item columns={12} style={{ width: "100%" }}>
                        <Paper style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2ch", textAlign: "center" }} elevation={12}>
                          <SentimentDissatisfiedIcon style={{ fontSize: "5ch", color: "#2196f3" }} />
                          <h3>I did not understand that query</h3>
                          <span>Perhaps try typing a different search query?</span>
                        </Paper>
                      </Grid>
                    ) : (
                      <Fragment>
                        {isQnA ? (
                          <Grid item columns={12} style={{ width: "100%" }}>
                            <Paper style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2ch", textAlign: "center" }} elevation={12}>
                              <SentimentDissatisfiedIcon style={{ fontSize: "5ch", color: "#2196f3" }} />
                              <h3>You asked: </h3>
                              <span>response</span>
                            </Paper>
                          </Grid>) : (
                          <Fragment>
                            {items.length === 0 ? (
                              <Grid item columns={12} style={{ width: "100%" }}>
                                <Paper style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2ch", textAlign: "center" }} elevation={12}>
                                  <SentimentDissatisfiedIcon style={{ fontSize: "5ch", color: "#2196f3" }} />
                                  <h3>No Products Were Found</h3>
                                  <span>Perhaps try typing a different search query?</span>
                                </Paper>
                              </Grid>
                            ) : (
                              <Fragment>
                                {items.map((item, index) => (
                                  <Grid item xs={6} sm={6} md={4} lg={3} key={item.name}>
                                    <Paper className='listing-styles' elevation={6} onClick={() => {
                                      viewItem(items[index])
                                    }}>
                                      <img src={milkPicture} style={{ width: "100%", height: "15ch", objectFit: "cover" }} />
                                      <div className='listing-info-style'>
                                        <span className='listing-title-style'>{item.name}</span>
                                        <span className='listing-price-style'>${item.price}</span>

                                      </div>
                                    </Paper>
                                  </Grid>
                                ))}
                              </Fragment>
                            )}
                          </Fragment>
                        )}
                      </Fragment>
                    )}

                  </Grid>
                </Fragment>
                )}
              </div>
            </Fade>
          </Fragment>
        )}
        {page === "category" && (
          <Categories viewItem={viewItem} />
        )}
        {page === "itemPage" && (
          <ItemPage setPage={setPage} itemDetails={itemDetails} />
        )}
        {page === "map" && (
          <Map center={center} zoom={zoom} setCenter={setCenter} setZoom={setZoom} />
        )}
      </div>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={12}>
        <BottomNavigation sx={{ backgroundColor: "transparent" }} value={page} onChange={(e, newValue) => { setPage(newValue) }}>
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Categories"
            value="category"
            icon={<ViewListIcon />}
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
