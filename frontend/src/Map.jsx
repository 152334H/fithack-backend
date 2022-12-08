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
import { useSnackbar } from 'notistack'

delete LIcon.Default.prototype._getIconUrl;

LIcon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});
const bounds = [[0, 0], [1280, 720]];

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

let fullCategoryData = {}
const Map = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [center, setCenter] = useState({ //center of map
    lat: 100,
    lng: 200
  })
  const [zoom, setZoom] = useState(10)
  const theme = useTheme()
  const [markersList, setItemMarkers] = useState([])
  const [currentShelf, setCurrentShelf] = useState("")
  const [items, setItems] = useState([])

  const handeClick = (category) => {
    setItems(fullCategoryData[category])

    if ("location_name" in fullCategoryData[category][0]) {
      setCurrentShelf(fullCategoryData[category][0].location_name)
      setZoom(3)
      setCenter(fullCategoryData[category][0].location)
    }
    else {
      enqueueSnackbar("Item does not have a location", { variant: "error" })
    }

  }

  const getListings = async () => {
    await fetch(window.address + "/listing/categorised", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((results) => {
      return results.json(); //return data in JSON (since its JSON data)
    }).then((data) => {
      fullCategoryData = data
      const markers = []
      for (const category in data) {
        if ("location" in data[category][0]) {
          markers.push(
            <Marker eventHandlers={{
              click: () => {
                handeClick(category, data[category][0].location_name)
              }
            }} key={data[category][0].location_name} position={data[category][0].location}>
              <Popup closeOnClick={false} closeButton={false} closeOnEscapeKey={false} maxWidth={250} minWidth={10} maxHeight={55}>
                <b>{data[category][0].location_name} </b>
              </Popup>
            </Marker>
          )
        }

      }

      setItemMarkers(markers)
      if (props.findCategory) {
        handeClick(props.findCategory)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    getListings()
  }, [])
  return (
    <Fragment>
      <div style={{ margin: "-2ch" }}>
        <MapContainer maxZoom={2} bounds={bounds} style={{ height: "40vh", width: "100vw" }}>
          <ZoomControl position="bottomright"></ZoomControl>
          <AddImageOverlay />
          <ChangeMapZoomFocus center={center} zoom={zoom} />
          {markersList}
        </MapContainer>
      </div>
      <h2 style={{ marginTop: "2ch" }}><span style={{ color: theme.palette.primary.main }}>Bukit Panjang</span> Outlet</h2>
      <h3>Items at: {currentShelf ? currentShelf : "No Shelf Selected"}</h3>
      <div>
        {items.map((item) => {
          return (
            <Paper key={item.name} className="mapListStyle">
              <img src={milkPicture} style={{ width: "100%", height: "15ch", objectFit: "cover" }} />
              <div className='listing-info-style'>
                <span className='listing-title-style'>{item.name}</span>
                <span className='listing-price-style'>${item.price}</span>

              </div>
            </Paper>
          )
        })}
      </div>
    </Fragment>

  )

}
export default Map;