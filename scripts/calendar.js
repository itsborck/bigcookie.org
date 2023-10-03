// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt9iLbK994xWQHHqmYlkEBg7JlhdCyjiE",
  authDomain: "calendar-d87ae.firebaseapp.com",
  projectId: "calendar-d87ae",
  storageBucket: "calendar-d87ae.appspot.com",
  messagingSenderId: "989488562781",
  appId: "1:989488562781:web:a270ddc694ae9f337003b4",
  measurementId: "G-H2SVP3MK38"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const calendarGrid = document.getElementById('calendar-grid');
    const eventModal = document.getElementById('event-modal');
    const closeModalButton = document.getElementById('close-modal');
    const addEventButton = document.getElementById('add-event-button');
    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const selectedDay = document.getElementById('selected-day');
    const eventList = document.getElementById('event-list');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    // Store the current year and month
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    // Event listeners
    addEventButton.addEventListener('click', () => {
        eventModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const title = eventTitleInput.value.trim();
        const selectedDate = new Date(eventDateInput.value);

        // Check for valid title and date
        if (!title || isNaN(selectedDate) || selectedDate.toString() === 'Invalid Date') {
            alert('Please enter a title and a valid date in the format "YYYY-MM-DD" for the event.');
            return;
        }

        const formattedDate = selectedDate.toISOString().split('T')[0];

        // Add event to Firebase
        db.collection('events').add({
            title: title,
            date: formattedDate,
        })
        .then(() => {
            alert('Event added successfully!');
            eventModal.style.display = 'none';
            eventTitleInput.value = '';
            eventDateInput.value = '';
            // Update the displayed events
            displayEventsForSelectedDay(selectedDay);
        })
        .catch((error) => {
            console.error('Error adding event: ', error);
        });
    });

    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        displayEventsOnCalendar(currentYear, currentMonth);
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        displayEventsOnCalendar(currentYear, currentMonth);
    });

    // Event listener to handle day selection
    function selectDay(selectedDay) {
        // Ensure that selectedDay is a valid number
        if (isNaN(selectedDay)) {
            console.error('Invalid day provided: ', selectedDay);
            return;
        }
    
        // Create the selectedDate object
        const selectedDate = new Date(currentYear, currentMonth, selectedDay);
    
        // Validate the date object
        if (isNaN(selectedDate.getTime())) {
            console.error('Invalid date object created.');
            return;
        }
    
        // Proceed with displaying events
        displayEventsForSelectedDay(selectedDate);
    }

    // Display events on the calendar for the selected day
    function displayEventsForSelectedDay(selectedDay) {
        const selectedDate = new Date(currentYear, currentMonth, selectedDay);
        const formattedDate = selectedDate.toISOString().split('T')[0];
    
        db.collection('events')
            .where('date', '==', formattedDate)
            .get()
            .then((querySnapshot) => {
                const events = [];
                querySnapshot.forEach((doc) => {
                    const eventData = doc.data();
                    events.push(eventData.title);
                });
                displayEvents(selectedDate, events);
            })
            .catch((error) => {
                console.error('Error getting events: ', error);
            });
    }

    // Display events on the calendar
    function displayEventsOnCalendar(year, month) {
        const calendarGrid = document.getElementById('calendar-cells');
        const calendarHeader = document.getElementById('calendar-month-year');
        calendarHeader.textContent = new Date(year, month).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        });
    
        // Clear existing day cells
        calendarGrid.innerHTML = '';
    
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
    
        // Create an array to store day names (Sun, Mon, Tue, etc.)
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
        // Create day name cells (Sun, Mon, Tue, etc.)
        for (const dayName of dayNames) {
            const dayNameCell = document.createElement('div');
            dayNameCell.classList.add('day-name');
            dayNameCell.textContent = dayName;
            calendarGrid.appendChild(dayNameCell);
        }
    
        // Fill in the day cells with correct day numbers
        let dayCounter = 1;
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('day');
                if (row === 0 && col < firstDayOfMonth) {
                    // Empty cells before the first day of the month
                    dayCell.textContent = '';
                } else if (dayCounter <= daysInMonth) {
                    // Fill in day numbers up to the number of days in the month
                    dayCell.textContent = dayCounter;
                    dayCounter++;
                } else {
                    // Empty cells after the last day of the month
                    dayCell.textContent = '';
                }
    
                // Attach click event listener to each day cell
                dayCell.addEventListener('click', () => {
                    const selectedDayElement = document.getElementById('selected-day');
                    const selectedDay = parseInt(selectedDayElement.textContent);
                    if (!isNaN(selectedDay)) {
                        displayEventsForSelectedDay(selectedDay);
                    }
                });
    
                calendarGrid.appendChild(dayCell);
            }
        }
    
        // Fetch and display events for the initial selected day
        const selectedDayElement = document.getElementById('selected-day');
        const initialSelectedDay = parseInt(selectedDayElement.textContent);
        if (!isNaN(initialSelectedDay)) {
            displayEventsForSelectedDay(initialSelectedDay);
        }
    }    

    // Helper function to display events for the selected day
    function displayEvents(selectedDate, events) {
        selectedDay.textContent = selectedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        eventList.innerHTML = '';
        if (events.length === 0) {
            eventList.innerHTML = '<li>No events for this day.</li>';
        } else {
            events.forEach((event) => {
                const eventItem = document.createElement('li');
                eventItem.textContent = event;
                eventList.appendChild(eventItem);
            });
        }
    }

    // Initial display of the calendar (for example, for the current month)
    displayEventsOnCalendar(currentYear, currentMonth);
});