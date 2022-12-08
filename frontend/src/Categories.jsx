import { Fragment, useState } from 'react'
import { Paper, Grid, Fade, Divider, IconButton, Grow, Skeleton } from '@mui/material'
import milkPicture from './assets/milk.webp'
import { useEffect } from 'react'
import { useTheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const listLoadingSkeleton = []
for (let i = 0; i < 6; i++) {
    listLoadingSkeleton.push(
        <Grid item xs={6} sm={6} md={4} lg={3}>
            <Skeleton animation="wave" variant="rectangular" height="30vh" />
        </Grid>)
}

const Categories = (props) => {
    const theme = useTheme()
    const [loadingCats, setLoadingCats] = useState(true)
    const [itemCategories, setItems] = useState({
        drink: [
            {
                name: "HL MILK",
                price: 1.50,
                type: "Drink",
                location: "Shelf E5",
                amount: 5
            },
            {
                name: "HL MILK 200ML",
                price: 1.50,
                type: "Drink",
                location: "Shelf E5",
                amount: 5
            },
            {
                name: "HL MILK 300ML",
                price: 1.50,
                type: "Drink",
                location: "Shelf E5",
                amount: 5
            }
        ]
    })
    const [categoryGrid, setCategoryGrid] = useState(null)
    const [categoryPage, setCategoryPage] = useState(false)

    useEffect(() => {
        getListings()
    }, [])

    const getListings = async () => {
        await fetch(window.address + "/listing/categorised", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then((results) => {
            return results.json(); //return data in JSON (since its JSON data)
        }).then((data) => {
            setItems(data)
            const newGrid = []
            for (const category in data) {
                newGrid.push(
                    <Grid item xs={6} sm={6} md={4} lg={3} key={"category-" + category}>
                        <Paper className='listing-styles' elevation={6} onClick={() => { setCategoryPage(category) }}>
                            <img src={milkPicture} style={{ width: "100%", height: "15ch", objectFit: "cover" }} />
                            <div className='listing-info-category-style'>
                                <span className='listing-category-style'>{category}</span>
                            </div>
                        </Paper>
                    </Grid>)
            }
            setCategoryGrid(newGrid)
        }).catch((error) => {
            console.log(error)
        })
        setLoadingCats(false)
    }

    return (
        <Fade in={true}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                {!categoryPage && (
                    <h1 style={{ alignSelf: "flex-start", marginBottom: "5px" }}>Categories </h1>
                )}
                {loadingCats ? (
                    <Grid container spacing={2} style={{ width: "100%" }}>
                        {listLoadingSkeleton}
                    </Grid>) : (
                    <Fragment>
                        {categoryPage ? (

                            <div style={{ width: "100%", height: "100%" }}>
                                <h1 style={{ alignSelf: "flex-start", textTransform: "capitalize", marginBottom: "5px", display: "flex", alignItems: "center" }}>
                                    <Grow in={true}>
                                        <IconButton color="primary" className="rounded-icon-button" style={{ marginRight: "1ch" }} onClick={() => {
                                            setCategoryPage(false)
                                        }}>
                                            <ArrowBackIosNewIcon />
                                        </IconButton>
                                    </Grow>

                                    <span><u>{categoryPage}</u> category </span>
                                </h1>
                                <Divider style={{ width: "100%", marginBottom: "2vh" }} />
                                <Fade in={true}>
                                    <Grid container spacing={2} style={{ width: "100%" }}>
                                        {itemCategories[categoryPage].map((item) =>
                                            <Grid item xs={6} sm={6} md={4} lg={3} key={item.name}>
                                                <Paper className='listing-styles' elevation={6} onClick={() => {
                                                    props.viewItem(item)
                                                }}>
                                                    <img src={milkPicture} style={{ width: "100%", height: "15ch", objectFit: "cover" }} />
                                                    <div className='listing-info-style'>
                                                        <span className='listing-title-style'>{item.name}</span>
                                                        <span className='listing-price-style'>${item.price}</span>

                                                    </div>
                                                </Paper>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Fade>
                            </div>


                        ) : (

                            <div style={{ width: "100%", height: "100%" }}>

                                <Divider style={{ width: "100%", marginBottom: "2vh" }} />
                                <Fade in={true}>
                                    <Grid container spacing={2} style={{ width: "100%" }}>
                                        {categoryGrid}
                                    </Grid>
                                </Fade>
                            </div>

                        )}
                    </Fragment>
                )}

            </div>
        </Fade>
    )
}

export default Categories