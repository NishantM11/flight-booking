// Flight data
const flightData = {
  "flights": [
    {
      "id": "6E301",
      "airline": "IndiGo",
      "route": "DEL-BOM",
      "departure": "06:00",
      "arrival": "08:15",
      "duration": "2h 15m",
      "price": 4500,
      "aircraft": "A320"
    },
    {
      "id": "AI131",
      "airline": "Air India", 
      "route": "DEL-BOM",
      "departure": "09:30",
      "arrival": "11:50",
      "duration": "2h 20m", 
      "price": 6200,
      "aircraft": "B737"
    },
    {
      "id": "SG8157",
      "airline": "SpiceJet",
      "route": "DEL-BOM", 
      "departure": "14:45",
      "arrival": "17:10",
      "duration": "2h 25m",
      "price": 3800,
      "aircraft": "B737"
    },
    {
      "id": "UK971",
      "airline": "Vistara",
      "route": "DEL-BOM",
      "departure": "18:20", 
      "arrival": "20:40",
      "duration": "2h 20m",
      "price": 7500,
      "aircraft": "A320neo"
    },
    {
      "id": "6E205",
      "airline": "IndiGo",
      "route": "BLR-MAA",
      "departure": "07:15",
      "arrival": "08:20", 
      "duration": "1h 05m",
      "price": 2800,
      "aircraft": "A320"
    },
    {
      "id": "AI502",
      "airline": "Air India",
      "route": "BLR-MAA", 
      "departure": "12:30",
      "arrival": "13:40",
      "duration": "1h 10m",
      "price": 3500,
      "aircraft": "A319"
    }
  ],
  "cities": [
    {"code": "DEL", "name": "Delhi", "airport": "Indira Gandhi International Airport"},
    {"code": "BOM", "name": "Mumbai", "airport": "Chhatrapati Shivaji International Airport"}, 
    {"code": "BLR", "name": "Bangalore", "airport": "Kempegowda International Airport"},
    {"code": "MAA", "name": "Chennai", "airport": "Chennai International Airport"},
    {"code": "CCU", "name": "Kolkata", "airport": "Netaji Subhas Chandra Bose International Airport"},
    {"code": "HYD", "name": "Hyderabad", "airport": "Rajiv Gandhi International Airport"}
  ],
  "seatMap": {
    "economy": {
      "rows": 25,
      "seatsPerRow": 6,
      "price": 0,
      "available": 180,
      "occupied": 70
    },
    "business": {
      "rows": 3, 
      "seatsPerRow": 4,
      "price": 2000,
      "available": 8,
      "occupied": 4
    }
  }
};

// Global state
let currentSearch = {};
let selectedFlight = null;
let selectedSeats = [];
let passengerCount = 1;
let totalAmount = 0;

// Screen management
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Format price using Indian number format
function formatPrice(amount) {
  if (typeof formatIndianRupee === 'function') {
    return formatIndianRupee(amount);
  }
  // Fallback formatting
  return '₹' + amount.toLocaleString('en-IN');
}

// Get city name from code
function getCityName(code) {
  const city = flightData.cities.find(c => c.code === code);
  return city ? city.name : code;
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get future date (add days to current date)
function getFutureDate(days) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Set today's date and a future date as defaults
  const today = getCurrentDate();
  const tomorrow = getFutureDate(1);
  
  const departureInput = document.getElementById('departure-date');
  const returnInput = document.getElementById('return-date');
  
  departureInput.value = tomorrow;
  returnInput.value = getFutureDate(8);
  
  departureInput.min = today;
  returnInput.min = tomorrow;
  
  // Set default origins/destinations
  document.getElementById('origin').value = "DEL";
  document.getElementById('destination').value = "BOM";
  document.getElementById('passengers').value = "2";
  
  // Update return date minimum when departure date changes
  departureInput.addEventListener('change', function() {
    // Ensure return date is not before departure date
    if (returnInput.value && returnInput.value < this.value) {
      returnInput.value = this.value;
    }
    returnInput.min = this.value;
  });

  // Flight search form
  document.getElementById('flight-search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    handleFlightSearch();
  });

  // Back navigation
  document.getElementById('back-to-search').addEventListener('click', function() {
    showScreen('home-screen');
  });

  document.getElementById('back-to-results').addEventListener('click', function() {
    showScreen('search-screen');
  });

  document.getElementById('new-search').addEventListener('click', function() {
    showScreen('home-screen');
  });

  // Filter controls
  document.getElementById('price-min').addEventListener('input', updatePriceLabels);
  document.getElementById('price-max').addEventListener('input', updatePriceLabels);
  document.getElementById('sort-flights').addEventListener('change', sortFlights);

  // Filter checkboxes
  document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterFlights);
  });

  // Price range sliders
  document.getElementById('price-min').addEventListener('change', filterFlights);
  document.getElementById('price-max').addEventListener('change', filterFlights);

  // Passenger form
  document.getElementById('passenger-form').addEventListener('submit', function(e) {
    e.preventDefault();
    handleBookingSubmit();
  });

  // Initialize price labels
  updatePriceLabels();
});

// Handle flight search
function handleFlightSearch() {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const departureDate = document.getElementById('departure-date').value;
  const returnDate = document.getElementById('return-date').value;
  passengerCount = parseInt(document.getElementById('passengers').value);
  const travelClass = document.getElementById('travel-class').value;

  if (!origin || !destination || !departureDate) {
    alert('Please fill in all required fields');
    return;
  }

  if (origin === destination) {
    alert('Origin and destination cannot be the same');
    return;
  }

  currentSearch = {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers: passengerCount,
    travelClass
  };

  displayFlightResults();
  showScreen('search-screen');
}

// Display flight results
function displayFlightResults() {
  const route = `${currentSearch.origin}-${currentSearch.destination}`;
  const availableFlights = flightData.flights.filter(flight => flight.route === route);
  
  const container = document.getElementById('flights-container');
  
  if (availableFlights.length === 0) {
    container.innerHTML = `
      <div class="card">
        <div class="card__body">
          <p>No flights found for this route. Please try a different route.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = availableFlights.map(flight => `
    <div class="card flight-card" data-flight-id="${flight.id}" data-price="${flight.price}">
      <div class="card__body">
        <div class="flight-card__content">
          <div class="flight-info">
            <div class="airline-info">
              <div class="airline-name">${flight.airline}</div>
              <div class="flight-number">${flight.id} • ${flight.aircraft}</div>
            </div>
            
            <div class="route-info">
              <div class="time-info">
                <div class="time">${flight.departure}</div>
                <div class="city">${getCityName(currentSearch.origin)}</div>
              </div>
              
              <div class="duration-info">
                <div class="duration">${flight.duration}</div>
                <div class="aircraft">Direct</div>
              </div>
              
              <div class="time-info">
                <div class="time">${flight.arrival}</div>
                <div class="city">${getCityName(currentSearch.destination)}</div>
              </div>
            </div>
          </div>
          
          <div class="price-info">
            <div class="price rupee-amount">${formatPrice(flight.price)}</div>
            <div>per person</div>
          </div>
          
          <button class="btn btn--primary book-flight-btn" onclick="selectFlight('${flight.id}')">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Apply filters 
  filterFlights();
}

// Update price range labels
function updatePriceLabels() {
  const minPrice = document.getElementById('price-min').value;
  const maxPrice = document.getElementById('price-max').value;
  
  document.getElementById('price-min-label').textContent = formatPrice(parseInt(minPrice));
  document.getElementById('price-max-label').textContent = formatPrice(parseInt(maxPrice));
}

// Filter flights
function filterFlights() {
  const minPrice = parseInt(document.getElementById('price-min').value);
  const maxPrice = parseInt(document.getElementById('price-max').value);
  const selectedAirlines = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  const flightCards = document.querySelectorAll('.flight-card');
  
  flightCards.forEach(card => {
    const flightId = card.dataset.flightId;
    const flight = flightData.flights.find(f => f.id === flightId);
    
    const priceInRange = flight.price >= minPrice && flight.price <= maxPrice;
    const airlineSelected = selectedAirlines.includes(flight.airline);
    
    if (priceInRange && airlineSelected) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Apply sorting
  sortFlights();
}

// Sort flights
function sortFlights() {
  const sortBy = document.getElementById('sort-flights').value;
  const container = document.getElementById('flights-container');
  const flightCards = Array.from(container.querySelectorAll('.flight-card'));
  
  flightCards.sort((a, b) => {
    const flightA = flightData.flights.find(f => f.id === a.dataset.flightId);
    const flightB = flightData.flights.find(f => f.id === b.dataset.flightId);
    
    switch (sortBy) {
      case 'price':
        return flightA.price - flightB.price;
      case 'duration':
        const durationA = parseDuration(flightA.duration);
        const durationB = parseDuration(flightB.duration);
        return durationA - durationB;
      case 'departure':
        return flightA.departure.localeCompare(flightB.departure);
      default:
        return 0;
    }
  });
  
  flightCards.forEach(card => container.appendChild(card));
}

// Parse duration string to minutes
function parseDuration(duration) {
  const match = duration.match(/(\d+)h\s*(\d+)m/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
}

// Select flight for booking
function selectFlight(flightId) {
  selectedFlight = flightData.flights.find(f => f.id === flightId);
  if (!selectedFlight) return;

  displayFlightSummary();
  generatePassengerForms();
  generateSeatMap();
  calculateTotal();
  showScreen('booking-screen');
}

// Display selected flight summary
function displayFlightSummary() {
  const summary = document.getElementById('selected-flight-summary');
  summary.innerHTML = `
    <div class="flight-summary">
      <h4>${selectedFlight.airline} ${selectedFlight.id}</h4>
      <div class="flight-route">
        <span>${getCityName(currentSearch.origin)} (${currentSearch.origin})</span>
        <span> → </span>
        <span>${getCityName(currentSearch.destination)} (${currentSearch.destination})</span>
      </div>
      <div class="flight-time">
        ${selectedFlight.departure} - ${selectedFlight.arrival}
      </div>
      <div class="flight-duration">Duration: ${selectedFlight.duration}</div>
      <div class="flight-date">${formatDate(currentSearch.departureDate)}</div>
    </div>
  `;
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Generate passenger forms
function generatePassengerForms() {
  const container = document.getElementById('passenger-forms-container');
  const forms = [];
  
  for (let i = 1; i <= passengerCount; i++) {
    forms.push(`
      <div class="passenger-form">
        <h4>Passenger ${i}</h4>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="passenger-${i}-title">Title</label>
            <select id="passenger-${i}-title" class="form-control" required>
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="passenger-${i}-first-name">First Name</label>
            <input type="text" id="passenger-${i}-first-name" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="passenger-${i}-last-name">Last Name</label>
            <input type="text" id="passenger-${i}-last-name" class="form-control" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="passenger-${i}-age">Age</label>
            <input type="number" id="passenger-${i}-age" class="form-control" min="1" max="120" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="passenger-${i}-passport">Passport Number</label>
            <input type="text" id="passenger-${i}-passport" class="form-control" required>
          </div>
        </div>
      </div>
    `);
  }
  
  container.innerHTML = forms.join('');
  document.getElementById('passenger-count').textContent = passengerCount;
}

// Generate seat map
function generateSeatMap() {
  const container = document.getElementById('seat-map-container');
  const seatConfig = flightData.seatMap[currentSearch.travelClass === 'business' ? 'business' : 'economy'];
  const rows = [];
  
  // Create a specific pattern of occupied seats to make selection easier for testing
  const occupiedSeats = [];
  
  // Set 30% of seats as occupied but ensure the first row has available seats for testing
  for (let row = 2; row <= seatConfig.rows; row++) {
    for (let seat = 0; seat < seatConfig.seatsPerRow; seat++) {
      // Make some seats occupied (more likely in the middle)
      if (Math.random() < (seat >= 1 && seat <= 4 ? 0.4 : 0.2)) {
        const seatLabel = String.fromCharCode(65 + seat);
        occupiedSeats.push(`${row}${seatLabel}`);
      }
    }
  }
  
  for (let row = 1; row <= seatConfig.rows; row++) {
    const seats = [];
    for (let seat = 0; seat < seatConfig.seatsPerRow; seat++) {
      const seatLabel = String.fromCharCode(65 + seat); // A, B, C, D, E, F
      const seatId = `${row}${seatLabel}`;
      const isOccupied = occupiedSeats.includes(seatId);
      
      seats.push(`
        <div class="seat ${isOccupied ? 'occupied' : 'available'}" 
             data-seat="${seatId}" 
             onclick="toggleSeat('${seatId}', ${isOccupied})">
          ${seatLabel}
        </div>
      `);
    }
    
    rows.push(`
      <div class="seat-row-number">Row ${row}</div>
      ${seats.join('')}
    `);
  }
  
  container.innerHTML = `<div class="seat-grid">${rows.join('')}</div>`;
  selectedSeats = [];
}

// Toggle seat selection
function toggleSeat(seatId, isOccupied) {
  if (isOccupied) return;
  
  const seatElement = document.querySelector(`[data-seat="${seatId}"]`);
  const isSelected = selectedSeats.includes(seatId);
  
  if (isSelected) {
    selectedSeats = selectedSeats.filter(id => id !== seatId);
    seatElement.classList.remove('selected');
    seatElement.classList.add('available');
  } else {
    if (selectedSeats.length < passengerCount) {
      selectedSeats.push(seatId);
      seatElement.classList.remove('available');
      seatElement.classList.add('selected');
    } else {
      alert(`You can only select ${passengerCount} seat(s)`);
    }
  }
  
  calculateTotal();
}

// Calculate total amount
function calculateTotal() {
  const baseFare = selectedFlight.price * passengerCount;
  const taxes = Math.round(baseFare * 0.12); // 12% taxes
  const seatCharges = selectedSeats.length * (currentSearch.travelClass === 'business' ? 2000 : 0);
  
  totalAmount = baseFare + taxes + seatCharges;
  
  document.getElementById('base-fare-total').textContent = formatPrice(baseFare);
  document.getElementById('taxes-fees').textContent = formatPrice(taxes);
  document.getElementById('seat-charges').textContent = formatPrice(seatCharges);
  document.getElementById('total-amount').textContent = formatPrice(totalAmount);
}

// Handle booking submission
function handleBookingSubmit() {
  // Validate all passenger forms
  let isValid = true;
  const passengers = [];
  
  for (let i = 1; i <= passengerCount; i++) {
    const title = document.getElementById(`passenger-${i}-title`).value;
    const firstName = document.getElementById(`passenger-${i}-first-name`).value;
    const lastName = document.getElementById(`passenger-${i}-last-name`).value;
    const age = document.getElementById(`passenger-${i}-age`).value;
    const passport = document.getElementById(`passenger-${i}-passport`).value;
    
    if (!title || !firstName || !lastName || !age || !passport) {
      isValid = false;
      break;
    }
    
    passengers.push({ title, firstName, lastName, age, passport });
  }
  
  if (!isValid) {
    alert('Please fill in all passenger details');
    return;
  }
  
  if (selectedSeats.length !== passengerCount) {
    alert(`Please select ${passengerCount} seat(s)`);
    return;
  }
  
  // Generate booking reference
  const bookingRef = 'FB' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  displayConfirmation(bookingRef, passengers);
  showScreen('confirmation-screen');
}

// Display booking confirmation
function displayConfirmation(bookingRef, passengers) {
  document.getElementById('booking-reference').textContent = bookingRef;
  
  // Flight details
  const flightDetails = document.getElementById('confirmed-flight-details');
  flightDetails.innerHTML = `
    <div class="confirmed-flight">
      <p><strong>Flight:</strong> ${selectedFlight.airline} ${selectedFlight.id}</p>
      <p><strong>Route:</strong> ${getCityName(currentSearch.origin)} → ${getCityName(currentSearch.destination)}</p>
      <p><strong>Date:</strong> ${formatDate(currentSearch.departureDate)}</p>
      <p><strong>Time:</strong> ${selectedFlight.departure} - ${selectedFlight.arrival}</p>
      <p><strong>Duration:</strong> ${selectedFlight.duration}</p>
      <p><strong>Aircraft:</strong> ${selectedFlight.aircraft}</p>
      <p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>
    </div>
  `;
  
  // Passenger details
  const passengerDetails = document.getElementById('confirmed-passenger-details');
  passengerDetails.innerHTML = passengers.map((passenger, index) => `
    <div class="passenger-summary">
      <p><strong>Passenger ${index + 1}:</strong> ${passenger.title} ${passenger.firstName} ${passenger.lastName}</p>
      <p><strong>Age:</strong> ${passenger.age} | <strong>Passport:</strong> ${passenger.passport}</p>
    </div>
  `).join('');
  
  document.getElementById('final-amount').textContent = formatPrice(totalAmount);
}