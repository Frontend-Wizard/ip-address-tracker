const IPInput = document.getElementById("IPInput");
const inputDiv = document.getElementById("inputDiv");
const colorOfInput = getComputedStyle(IPInput).color;
const FormData = {
	ip: document.getElementById("IP"),
	location: document.getElementById("Location"),
	timezone: document.getElementById("Timezone"),
	ISP: document.getElementById("ISP"),
};

let IPData;

function ValidateIPaddress(ipaddress) {
	if (
		/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
			ipaddress.value
		)
	) {
		return true;
	}
	return false;
}

////Data for map rendering////

let map;

function updateMap(cord, k) {
	//Map cordinates
	let mapCord = [cord[0] + 0.001, cord[1]];

	//Create map
	map = L.map("mapid").setView(mapCord, 15);

	L.tileLayer(
		"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
		{
			maxZoom: 18,
			id: "mapbox/streets-v11",
			tileSize: 512,
			zoomOffset: -1,
		}
	).addTo(map);

	//Add marker
	const greenIcon = L.icon({
		iconUrl: "Images/icon-location.svg",
		iconSize: [46, 56],
		iconAnchor: [26, 56],
		popupAnchor: [6, -56],
	});

	if (k) L.marker(cord, { icon: greenIcon }).addTo(map);
}

updateMap([0, 0], false);

//Input validation
IPInput.addEventListener("change", () => {
	if (!ValidateIPaddress(IPInput)) {
		inputDiv.style.animation = "error 0.5s 1 forwards .25s";
		setTimeout(() => {
			inputDiv.style.animation = "";
		}, 500);
		IPInput.value = "Please enter valid IP address";
		IPInput.style.color = "red";
		IPInput.blur();
		IPInput.addEventListener("click", () => {
			IPInput.value = "";
			IPInput.style.color = colorOfInput;
			IPInput.removeEventListener("click", this, true);
		});
	} else {
		let ip = IPInput.value;
		const api_key = "at_YwjkeoHuOCehxumTWljbt2UpNV22H";
		$(function () {
			$.ajax({
				url: "https://geo.ipify.org/api/v1",
				data: { apiKey: api_key, ipAddress: ip },
				success: function (data) {
					IPData = JSON.parse(JSON.stringify(data));
					map.remove();
					updateMap([IPData.location.lat, IPData.location.lng], true);
					FormData.ip.innerText = IPData.ip;
					FormData.location.innerText = IPData.location.region;
					FormData.timezone.innerText = IPData.location.timezone;
					FormData.ISP.innerText = IPData.isp;
				},
			});
		});
	}
});
