import { Fragment, useState } from 'react'
import { Paper, Grid, Fade } from '@mui/material'
import milkPicture from './assets/milk.webp'


const Categories = () => {
    const [items, setItems] = useState([
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
    ])

    return (
        <Fade in={true}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                <h1 style={{alignSelf: "flex-start"}}>Categories </h1>
                <Grid container spacing={2} style={{ width: "100%" }}>
                    {items.map((item) => (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={item.name}>
                            <Paper className='listing-styles' elevation={6} onClick={() => { console.log(item.name) }}>
                                <img src={milkPicture} style={{ width: "100%", height: "15ch", objectFit: "cover" }} />
                                <div className='listing-info-style'>
                                    <span className='listing-title-style'>{item.name}</span>
                                    <span className='listing-price-style'>${item.price}</span>
                                    <span className='listing-quantity-style'>Amount: <b>{item.amount}</b></span>

                                </div>
                            </Paper>
                        </Grid>

                    ))}
                </Grid>
            </div>
        </Fade>
    )
}

export default Categories