// Leaflet Map Initialization
let map;
let hospitalMarker;
let donorMarkers = {};

function initMap(lat, lng) {
    if (map) return;

    map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    hospitalMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'hospital-marker',
            html: '<div class="bg-red-600 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">H</div>'
        })
    }).addTo(map).bindPopup("Hospital Location").openPopup();
}

// SocketIO Integration
const socket = io();
const hospitalId = "65e01234567890abcdef1234"; // Should be dynamic

socket.on('connect', () => {
    socket.emit('join_hospital', { hospital_id: hospitalId });
});

socket.on('donor_accepted', (data) => {
    const container = document.getElementById('tracker-container');
    container.classList.remove('hidden');
    setTimeout(() => {
        container.classList.remove('scale-95', 'opacity-0');
        container.classList.add('scale-100', 'opacity-100');
    }, 10);

    initMap(13.0827, 80.2707);

    const donorList = document.getElementById('donor-list');
    // Remove the "Waiting for donors" placeholder if it exists
    if (donorList.innerHTML.includes('Waiting for donors')) {
        donorList.innerHTML = '';
    }
    const li = document.createElement('li');
    li.id = `donor-${data.donor_id}`;
    li.className = "flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200";
    li.innerHTML = `
        <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </div>
            <div>
                <p class="font-bold text-gray-800">Donor #${data.donor_id.substring(0, 6)}</p>
                <p class="text-sm text-gray-600">Status: En-route</p>
            </div>
        </div>
        <div class="text-right">
            <p class="text-2xl font-black text-green-600">${data.eta}m</p>
            <p class="text-xs uppercase text-gray-500 font-bold">Estimated ETA</p>
        </div>
    `;
    donorList.appendChild(li);

    // Add donor marker
    donorMarkers[data.donor_id] = L.marker([data.location.lat, data.location.lng], {
        icon: L.divIcon({
            className: 'donor-marker',
            html: '<div class="bg-green-500 w-6 h-6 rounded-full border-2 border-white shadow-lg pulse"></div>'
        })
    }).addTo(map);
});

socket.on('live_tracking', (data) => {
    if (donorMarkers[data.donor_id]) {
        donorMarkers[data.donor_id].setLatLng([data.lat, data.lng]);
    }
});
