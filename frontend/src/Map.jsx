import 'leaflet/dist/leaflet.css';
import { latLng, CRS, imageOverlay, Icon as LIcon, divIcon as LdivIcon, point as Lpoint } from 'leaflet';
import { Marker, MapContainer, ZoomControl, useMap, Popup } from 'react-leaflet'
import { Paper } from '@mui/material';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import FloorPlan from './assets/FloorPlan.png'
import { Fragment, useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import milkPicture from './assets/milk.webp'
delete LIcon.Default.prototype._getIconUrl;

LIcon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});
const bounds = [[0, 0], [900, 640]];

const AddImageOverlay = () => {
  const map = useMap()

  imageOverlay(FloorPlan, bounds).addTo(map)

  map.fitBounds(bounds)
  map.crs = CRS.Simple
  return false
}

const ChangeMapZoomFocus = (props) => {
  const map = useMap()
  useEffect(() => {
    map.setView(props.center, props.zoom)
  }, [props.center, props.zoom])

  return null;

}


const Map = (props) => {
  const theme = useTheme()
  const [itemsList, setItemsList] = useState([])
  const [markersList, setItemMarkers] = useState([])
  const [items, setItems] = useState([{
    name: "HL MILK",
    price: 1.50,
    type: "Drink",
    location: latLng([50, 100]),
    amount: 5
  },
  {
    name: "HL MILK 200ML",
    price: 1.50,
    type: "Drink",
    location: latLng([50, 325]),
    amount: 5
  },
  {
    name: "HL MILK 300ML",
    price: 1.50,
    type: "Drink",
    location: latLng([50, 525]),
    amount: 5
  }])

  useEffect(() => {
    const newList = []
    const newMarkers = []
    for (let i = 0; i < items.length; i++) {
      newList.push(
        <Paper onClick={() => {
          props.setCenter(items[i].location)
          props.setZoom(1)
        }} key={items[i].name} className="mapListStyle">
          <img src={milkPicture} style={{ width: "100%", height: "15ch", objectFit: "cover" }} />
          <div className='listing-info-style'>
            <span className='listing-title-style'>{items[i].name}</span>
            <span className='listing-price-style'>${items[i].price}</span>
            <span className='listing-quantity-style'>Amount: <b>{items[i].amount}</b></span>

          </div>
        </Paper>
      )
      newMarkers.push(
        <Marker key={items[i].name} position={items[i].location}>
          <Popup closeOnClick={false} closeButton={false} closeOnEscapeKey={false} maxWidth={250} minWidth={10} maxHeight={55}>
            <b>{items[i].name} </b>

          </Popup>
        </Marker>
      )
    }
    setItemMarkers(newMarkers)
    setItemsList(newList)

  }, [])
  return (
    <Fragment>
      <div style={{ margin: "-2ch" }}>
        <MapContainer bounds={bounds} style={{ height: "40vh", width: "100vw" }}>
          <ZoomControl position="bottomright"></ZoomControl>
          <AddImageOverlay />
          <ChangeMapZoomFocus center={props.center} zoom={props.zoom} />
          {markersList}
        </MapContainer>
      </div>
      <h1 style={{ marginTop: "2ch" }}><span style={{ color: theme.palette.primary.main }}>Bukit Panjang</span> Outlet</h1>
      <div>
        {itemsList}
      </div>
    </Fragment>

  )

}
export default Map;