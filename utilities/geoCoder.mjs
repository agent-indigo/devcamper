import node_geocoder from "node-geocoder"
const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}
const geoCoder = node_geocoder(options)
export default geoCoder