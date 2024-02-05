// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of directory

function toRad(x) { return (x * Math.PI) / 180; }
function toDeg(x) { return (x * 180) / Math.PI; }

export const sortArrayofObjects = (property, order) => {
	var sortOrder = order === "asc" ? 1 : -1;
	return function (a, b) {
		var result = a["properties"][property] < b["properties"][property] ? -1 : a["properties"][property] > b["properties"][property] ? 1 : 0;
		return result * sortOrder;
	};
};

export const haversine = (coords1, coords2) => {
	// Distance	
	lon1 = coords1[0];
	lat1 = coords1[1];
	lon2 = coords2[0];
	lat2 = coords2[1];
	R = 6371; // kilometers
	x1 = lat2 - lat1;
	dLat = toRad(x1);
	x2 = lon2 - lon1;
	dLon = toRad(x2);
	a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	d = R * c;
	d /= 1.60934;
	// Bearing
	lon1r = toRad(lon2);
	lat1r = toRad(lat2);
	lon2r = toRad(lon1);
	lat2r = toRad(lat1);
	by = Math.sin(lon2r - lon1r) * Math.cos(lat2r);
	bx = Math.cos(lat1r) * Math.sin(lat2r) - Math.sin(lat1r) * Math.cos(lat2r) * Math.cos(lon2r - lon1r);
	brg = (toDeg(Math.atan2(by, bx)) + 360) % 360;	
 	brg_x = Math.floor((brg / 22.5) + 0.5);
    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    directions_verbose = ["north", "north-northeast", "northeast", "east-northeast", "east", "east-southeast", "southeast", "south-southeast", "south", "south-southwest", "southwest", "west-southwest", "west", "west-northwest", "northwest", "north-northwest"];
    b = directions[(brg_x % 16)];
    bv = directions_verbose[(brg_x % 16)];
	return {d, b, bv};
}

export const formatDistance = (distance) => {
	if (distance < 0.5) {
		distance = distance * 5280;
		distance = distance.toFixed(0);
		distance = Math.ceil(distance / 10) * 10;
		unit = "feet";
	}
	else {
		distance = distance.toFixed(1);
		unit = "miles";
	}
	if (distance >= 100 || unit == 'miles') return `${distance} ${unit}`;
	else return `within 100 feet`;
}

export const getBbox = (features) => {
	const statewide = {lat_min: 34.5, lat_max: 42.5, lon_min: -121.0, lon_max: -112.0}
	let bbox = { lat_min: 90.0, lat_max: -90.0, lon_min: 180.0, lon_max: -180.0 };
	features.forEach((feature) => {
		if (feature.geometry.coordinates[0] <= bbox.lon_min) bbox.lon_min = feature.geometry.coordinates[0];
		if (feature.geometry.coordinates[0] >= bbox.lon_max) bbox.lon_max = feature.geometry.coordinates[0];
		if (feature.geometry.coordinates[1] <= bbox.lat_min) bbox.lat_min = feature.geometry.coordinates[1];
		if (feature.geometry.coordinates[1] >= bbox.lat_max) bbox.lat_max = feature.geometry.coordinates[1];
	});
	if (bbox.lat_min == 90.0 || bbox.lat_max == -90.0 || bbox.lon_min == 180.0 || bbox.lon_max == -180.0 ) return statewide;
	else {
		if (bbox.lat_min == bbox.lat_max) {
			bbox.lat_min -= 0.0025;
			bbox.lat_max += 0.0025;
		}
		if (bbox.lon_min == bbox.lon_max) {
			bbox.lon_min -= 0.0025;
			bbox.lon_max += 0.0025;
		}
		return bbox;
	}
}

export const bboxToRegion = (bbox) => {
	return {
		latitude: (bbox.lat_min + bbox.lat_max) / 2.0,
		longitude: (bbox.lon_min + bbox.lon_max) / 2.0,
		latitudeDelta:
			Math.abs(bbox.lat_max - bbox.lat_min) * 1.25,
		longitudeDelta:
			Math.abs(bbox.lon_max - bbox.lon_min) * 1.25,
	};
}

export const importAll = (r) => {
	let images = {};
	r.keys().map((item, index) => {
		images[item.replace("./", "")] = r(item);
	});
	return images;
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const fulfillWithTimeLimit = async(timeLimit, task, failureValue) => {
    let timeout;
    const timeoutPromise = new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
            resolve(failureValue);
        }, timeLimit);
    });
    const response = await Promise.race([task, timeoutPromise]);
    if(timeout){
        clearTimeout(timeout);
    }
    return response;
}
