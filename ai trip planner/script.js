document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('trip-form');
    const itinerarySection = document.getElementById('itinerary');
    const itineraryBody = document.getElementById('itinerary-body');
    const priceInfo = document.getElementById('price-info');
    const routeSubtitle = document.getElementById('route-subtitle');

    if (!form) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;
        const timeline = document.getElementById('timeline').value;
        const numPeople = document.getElementById('num-people').value;
        const category = document.getElementById('trip-category').value;
        const transport = document.getElementById('transport').value;

        if (!departure || !destination || !timeline || !numPeople) {
            alert('Please fill in all the required fields.');
            return;
        }

        itinerarySection.classList.add('visible');

        const locationOrder = [
            'New Delhi',
            'Varanasi',
            'Goa',
            'Mumbai',
            'Haridwar',
            'Sikkim',
            'Valley Of Flowers'
        ];

        const depIdx = locationOrder.indexOf(departure);
        const destIdx = locationOrder.indexOf(destination);
        const routeIndexDiff = Math.max(0, Math.abs(depIdx - destIdx));
        const routeFactor = 1 + routeIndexDiff * 0.09;

        const categoryMultiplier = {
            budget: 0.95,
            friends: 1.0,
            family: 1.08,
            group: 1.15
        };

        const peopleCount = Math.max(1, parseInt(numPeople, 10) || 1);
        const peopleFactor = Math.min(1.6, 1 + (peopleCount - 1) * 0.12);

        const catMul = categoryMultiplier[category] || 1.0;

        const basePrices = {
            flight: 2500,
            train: 700,
            bus: 300,
            car: 1000
        };

        const priceFor = function (key) {
            return Math.round(basePrices[key] * routeFactor * catMul * peopleFactor);
        };

        const flightPrice = priceFor('flight');
        const trainPrice = priceFor('train');
        const busPrice = priceFor('bus');
        const carPrice = priceFor('car');

        if (routeSubtitle) {
            routeSubtitle.textContent = `Prices for ${departure} \u2192 ${destination}`;
        }

        const transportLabel = transport
            ? transport.charAt(0).toUpperCase() + transport.slice(1)
            : 'Transport';

        const selectedTransportBase =
            transport === 'flight'
                ? flightPrice
                : transport === 'train'
                    ? trainPrice
                    : transport === 'bus'
                        ? busPrice
                        : transport === 'car'
                            ? carPrice
                            : trainPrice;

        let itineraryHTML = '';

        for (let i = 1; i <= 5; i++) {
            const jitter = 0.85 + Math.random() * 0.35; // small randomness around computed price
            const dayFactor = 0.92 + i * 0.05;
            const costEstimate = Math.round(selectedTransportBase * jitter * dayFactor);

            itineraryHTML += `
                <tr>
                    <td>Day ${i}</td>
                    <td>Explore ${destination} - Highlight ${i}</td>
                    <td>${transportLabel}</td>
                    <td>₹${costEstimate}</td>
                </tr>
            `;
        }

        priceInfo.innerHTML = `
            <div class="price-row price-row-flight ${transport === 'flight' ? 'is-selected' : ''}">
                <div class="price-label">
                    <span class="price-icon">✈️</span>
                    <span>Flight</span>
                </div>
                <span class="price-value">₹${flightPrice}</span>
            </div>
            <div class="price-row price-row-train ${transport === 'train' ? 'is-selected' : ''}">
                <div class="price-label">
                    <span class="price-icon">🚆</span>
                    <span>Train</span>
                </div>
                <span class="price-value">₹${trainPrice}</span>
            </div>
            <div class="price-row price-row-bus ${transport === 'bus' ? 'is-selected' : ''}">
                <div class="price-label">
                    <span class="price-icon">🚌</span>
                    <span>Bus</span>
                </div>
                <span class="price-value">₹${busPrice}</span>
            </div>
            <div class="price-row price-row-car ${transport === 'car' ? 'is-selected' : ''}">
                <div class="price-label">
                    <span class="price-icon">🚗</span>
                    <span>Car</span>
                </div>
                <span class="price-value">₹${carPrice}</span>
            </div>
        `;

        itineraryBody.innerHTML = itineraryHTML;
    });
});
