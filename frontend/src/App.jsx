import { Fragment, useState } from 'react'
import { CircularProgress, Button, Paper, BottomNavigation, BottomNavigationAction, Avatar, Grow, Fade, TextField, InputAdornment, Collapse, Grid, Skeleton } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import './App.css'
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import debounce from 'lodash.debounce'
import milkPicture from './assets/milk.webp'
import fairpricelogo from './assets/fairpricelogo.png'
import ViewListIcon from '@mui/icons-material/ViewList';
import MicIcon from '@mui/icons-material/Mic';
import Categories from './Categories';
import ItemPage from './ItemPage';
import Map from './Map';
import StringSimiliarity from 'string-similarity';

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
const questions = ["What are the opening hours of the fairprice at Our Tampines Hub?", "What payment methods does Fairprice accept?", "Do I need to pay for plastic bags?", "How do I register for a Fairprice membership account?"]
const answers = ["24 hours a day, everyday.", "Visa, NETs, Fairprice App", "Yes there is a charge of $0.20 per plastic bag. We recommend bringing your own reusable bag to help save the environment!", "You can create an account online at https://www.fairprice.com.sg/membership/registration"]

let mediaRecorder = null
let recordedChunks = []

const App = () => {
  const theme = useTheme()
  const [searchVal, setSearchVal] = useState("")
  const [page, setPage] = useState("home")

  const [user, setUser] = useState("Kai Xiang")
  const [isQnA, setisQnA] = useState(false)
  const [userLetters, setUserLetters] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchLoading, setSearchLoading] = useState(true)
  const [searchErrored, setSearchErrored] = useState(false)
  const [items, setItems] = useState([])
  const [findCategory, setFindCategory] = useState(false)
  const [itemDetails, setItemDetails] = useState({
    name: "HL MILK",
    price: 1.50,
    category: "Drink",
    location: "Shelf E5",
    amount: 5
  })
  const [isProductSearch, setIsProductSearch] = useState(false)
  const [QnAPrompt, setQnAPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const userWords = user.split(" ")
    if (userWords.length > 1) {
      setUserLetters(userWords[0][0] + userWords[1][0])
    }
    else setUserLetters(userWords[0][0])
    getItems()

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleMediaRecorder);
  }, [])

  const handleMediaRecorder = async (stream) => {
    const options = { mimeType: 'audio/webm', audioBitsPerSecond: 16000 };
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.addEventListener('dataavailable', function (e) {
      if (e.data.size > 0) recordedChunks.push(e.data);
    });

    mediaRecorder.addEventListener('stop', async () => {
      setSearchLoading(true)
      

      const saveRecordedChunks = new Blob(recordedChunks)
      recordedChunks = []
      const reader = new FileReader();
      reader.readAsDataURL(saveRecordedChunks);
      reader.onloadend = async () => {
        const base64data = reader.result;

        await fetch("https://nc.cutemares.xyz/whisper/stt", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({'audio': base64data.split(",")[1]})
        }).then((results) => {
          return results.json(); //return data in JSON (since its JSON data)
        }).then((data) => {
          let result = data.txt
          if (data.txt.indexOf(".") !== -1) {
            result = data.txt.split(".")[0].replace(" ", "")
          }

          setSearchVal(result)
          setSearchErrored(false)
          
        }).catch((error) => {
          console.log(error)
        })
        setSearchLoading(false)
      }
    });


  }

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
      setSearchLoading(false)
    }
    else {
      setIsProductSearch(true)
      if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g.test(value)) {
        setisQnA(false)
        const newItemList = []
        for (let i = 0; i < fullOriginalItemList.length; i++) {
          if (fullOriginalItemList[i].name.indexOf(value) !== -1) {
            newItemList.push(fullOriginalItemList[i])
          }
        }
        setItems(newItemList)
      }
      else {
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
            console.log(data)
            setSearchErrored(true)
          }
          else {
            console.log(data)
            if (data.variant === "item") {
              setisQnA(false)
              const newItemList = []
              for (let i = 0; i < data.relatedItems.length; i++) {
                newItemList.push(data.relatedItems[i].item)
              }
              setItems(newItemList)
            }
            else if (data.variant === "help") {
              const matches = StringSimiliarity.findBestMatch(value, questions)
              setQnAPrompt(matches.bestMatch.target)
              setResponse(answers[matches.bestMatchIndex])
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
                        {searchLoading ? (
                          <Fade in={true}>
                            <CircularProgress style={{ color: "#fadb14" }} />
                          </Fade>
                        ) : (
                          <Fade in={true}>
                            <MicIcon onClick={() => {
                              if (!isRecording) {
                                mediaRecorder.start();
                                setIsRecording(true)
                              }
                              else {
                                mediaRecorder.stop()
                                setIsRecording(false)
                              }

                            }} style={{ color: isRecording ? "red" : "#fadb14" }} />
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
                  <Grid rowSpacing={3} container spacing={2} alignItems="stretch">
                    {listLoadingSkeleton}
                  </Grid>
                ) : (
                  <Fragment>
                    {isProductSearch && (
                      <Button style={{ alignSelf: "center", marginBottom: "2vh" }} variant="contained" onClick={() => {
                        setSearchVal("")
                        setSearchErrored(false)
                        setItems(fullOriginalItemList)
                        setisQnA(false)
                        setIsProductSearch(false)
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
                                <SentimentSatisfiedAltIcon style={{ fontSize: "5ch", color: "#2196f3" }} />
                                <h3>You asked: {QnAPrompt}</h3>
                                <span>{response}</span>
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
                                        <img onError={(e) => {
                                          e.target.onError = null;
                                          e.target.src = milkPicture
                                        }} src={"https://raw.githubusercontent.com/yZipperer/item-api/main/images/" + item.image} style={{ width: "100%", height: "15ch", objectFit: "cover" }} />
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
          <ItemPage setPage={setPage} setFindCategory={setFindCategory} itemDetails={itemDetails} />
        )}
        {page === "map" && (
          <Map findCategory={findCategory} />
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
