import { Button, Fade } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import milkPicture from './assets/milk.webp'

const ItemPage = (props) => {

    return (
        <Fade in={true}>
            <div>
                <div style={{ margin: "-2ch" }}>
                    <img onError={(e) => {
                        e.target.onError = null;
                        e.target.src = milkPicture
                    }} src={"https://raw.githubusercontent.com/yZipperer/item-api/main/images/" + props.itemDetails.image} style={{ objectFit: "cover", height: "40vh", width: "100%" }} />
                </div>
                <h1 style={{ textTransform: "capitalize" }}>{props.itemDetails.name}</h1>
                <span className="itemPageInfoStyle"><b>Price:</b> ${props.itemDetails.price}</span>
                <span className="itemPageInfoStyle"><b>Type:</b> {props.itemDetails.category}</span>
                <span className="itemPageInfoStyle"><b>Location:</b> {props.itemDetails.location_name}</span>

                <Button onClick={() => {
                    props.setFindCategory(props.itemDetails.category)
                    props.setPage("map")
                }} startIcon={<SearchIcon />} style={{ marginTop: "3vh" }} variant="contained">Find Item in Store</Button>
            </div>
        </Fade>
    )
}

export default ItemPage