const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) { 
  request.get('https://api.ipify.org?format=json', (error, res, body) => { 
    if (error) {
      callback(error, null);
      return null;
    }

    // if non-200 status, assume server error
    if (res.statusCode !== 200) {
      const msg = `Status Code ${res.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const data = JSON.parse(body);
    callback(error, data.ip);
  })
  // use request to fetch IP address from JSON API
}


const fetchCoordsByIp = (ip, callback)=>{
  request.get(`https://api.ipbase.com/v2/info?apikey=PzIt1A9Qb0jYseish09kpwLwMSepkaY8Z0B2MbXA&ip=${ip}`, (error, res, body) => { 
    if (error) {
        callback(error, null);
        return null;
      }

    // if non-200 status, assume server error
    if (res.statusCode !== 200) {
      const msg = `Status Code ${res.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    
    const data = JSON.parse(body).data;
    const latAndLon = {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    }
    callback(error, latAndLon)
    
  })
  
}

const fetchISSFlyOverTimes = (lat, long,cb) => {
  request.get(`https://iss-pass.herokuapp.com/json/?lat=${lat}&lon=${long}`, (error, res, body) => { 

     if (error) {
        callback(error, null);
        return null;
      }

    // if non-200 status, assume server error
    if (res.statusCode !== 200) {
      const msg = `Status Code ${res.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const pass = JSON.parse(body);
    cb(pass.response)
  })
  
}

const nextISSTimeForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
  if (error) {
    return callback(error, null);
  }
  
  fetchCoordsByIp(ip, (error, data) => {
    if (error) {
      return callback(error, null);
    }
    
    fetchISSFlyOverTimes(data.latitude, data.longitude, (passTimes) => {
      

      callback(null, passTimes)
        

    });
  })
  
});
}




module.exports = { nextISSTimeForMyLocation };
