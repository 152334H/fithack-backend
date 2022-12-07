import 'leaflet/dist/leaflet.css';
import { Icon as LIcon, divIcon as LdivIcon, point as Lpoint } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete LIcon.Default.prototype._getIconUrl;

LIcon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const Map = () => {

}
export default Map;