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
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function () {
    // Get references to DOM elements
    const calendarGrid = document.getElementById('calendar-grid');
    const eventModal = document.getElementById('add-event-modal');
    const displayEventModal = document.getElementById('display-event-modal');
    const closeModalButton = document.getElementById('close-event-modal');
    const closeDisplayModalButton = document.getElementById('close-display-modal');
    const addEventButton = document.getElementById('add-event-button');
    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const selectedDay = document.getElementById('selected-day');
    const eventList = document.getElementById('event-list');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    const googleSignInButton = document.getElementById('google-signin');
    const signOutButton = document.getElementById('sign-out-button');

    // Store the current year and month
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    googleSignInButton.addEventListener('click', () => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(googleProvider)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User signed in:', user);
            })
            .catch((error) => {
                console.error('Error signing in:', error);
            });
    });

    signOutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            // Reset UI after sign out
            document.getElementById('google-signin').style.display = 'block';
            document.getElementById('sign-out-button').style.display = 'none';
    
            window.location.reload();
        })
        .catch((error) => {
        console.error(error);
        });
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('google-signin').style.display = 'none';
            document.getElementById('sign-out-button').style.display = 'block';
            document.getElementById('add-event-button').style.display = 'block';
        } else {
            document.getElementById('google-signin').style.display = 'block';
            document.getElementById('sign-out-button').style.display = 'none';
            document.getElementById('add-event-button').style.display = 'none';
        }
    });

    // Event listeners
    addEventButton.addEventListener('click', () => {
        eventModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.key ==='Esc') {
            eventModal.style.display = 'none';
            displayEventModal.style.display = 'none';
        }
    })

    closeDisplayModalButton.addEventListener('click', () => {
        displayEventModal.style.display = 'none';
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
            displayEventsForSelectedDay(selectedDay.textContent);
            window.location.reload();
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

    // Display events on the calendar for the selected day
    function displayEventsForSelectedDay(selectedDate) {
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

                updateCalendarEvents(events);
                // Display events in the modal
                const modalContent = document.getElementById('display-event-modal-content');
                modalContent.innerHTML = '';
                const modalTitle = document.createElement('h2');
                modalTitle.textContent = selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                modalContent.appendChild(modalTitle);
    
                if (events.length === 0) {
                    const noEventsMessage = document.createElement('p');
                    noEventsMessage.textContent = 'No events for this day.';
                    modalContent.appendChild(noEventsMessage);
                } else {
                    const eventList = document.createElement('ul');
                    events.forEach((event) => {
                        const eventItem = document.createElement('li');
                        eventItem.textContent = event;
                        eventList.appendChild(eventItem);
                    });
                    modalContent.appendChild(eventList);
                }
            })
            .catch((error) => {
                console.error('Error getting events: ', error);
            });
    }

    function updateCalendarEvents(events) {
        // Clear previous event indicators and titles
        const dayCells = document.querySelectorAll('.day');
        dayCells.forEach((dayCell) => {
            dayCell.classList.remove('day-with-events');
            const eventIndicator = dayCell.querySelector('.event-count');
            if (eventIndicator) {
                eventIndicator.textContent = '';
            }
        });

        events.forEach((eventData) => {
            const eventDate = new Date(eventData.date);
            const dayNumber = eventDate.getDate();
            const dayCell = document.querySelector(`.day[data-day="${dayNumber}"]`);

            if (dayCell) {
                const eventIndicator = document.createElement('span');
                eventIndicator.classList.add('event-count');
                eventIndicator.textContent = eventData.title;

                dayCell.classList.add('day-with-events');

                dayCell.appendChild(eventIndicator);
            }
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

        // Add empty cells before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day');
            emptyCell.textContent = '';
            calendarGrid.appendChild(emptyCell);
        }

        // Fill in the day cells with correct day numbers and indicators
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');

        // Check if there are events for this date and add an indicator class
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const events = getEventsForDate(formattedDate);

        // Create the day number text element
        const dayTextSpan = document.createElement('span');
        dayTextSpan.textContent = day;

        // Append both spans to the dayCell
        dayCell.appendChild(dayTextSpan);

        if (events.length > 0) {
            dayCell.classList.add('day-with-events');
        }

        // Fetch events for this date and add them to the day cell
        if (Array.isArray(events)) {
            events.forEach((eventData) => {
                console.log(eventData);
                const eventTitle = eventData.title;
                const eventIndicator = document.createElement('span');
                eventIndicator.classList.add('event-title');
                eventIndicator.textContent = eventTitle;

                dayCell.appendChild(eventIndicator);
            });
        }
        

        // Attach click event listener to each day cell
        dayCell.addEventListener('click', () => {
            const selectedDateElement = document.getElementById('selected-day');
            const selectedDay = parseInt(dayCell.textContent);
            if (!isNaN(selectedDay)) {
                selectedDateElement.textContent = selectedDay;
                displayEventsForSelectedDay(new Date(year, month, selectedDay));
                const displayEventModal = document.getElementById('display-event-modal');
                displayEventModal.style.display = 'block'; // Show the display event modal
            }
        });

        calendarGrid.appendChild(dayCell);
    }

        // Add empty cells after the last day of the month
        const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
        for (let i = lastDayOfMonth + 1; i < 7; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day');
            emptyCell.textContent = '';
            calendarGrid.appendChild(emptyCell);
        }

        // Fetch and display events for the initial selected day
        const selectedDay = parseInt(document.getElementById('selected-day').textContent);
        if (!isNaN(selectedDay)) {
            displayEventsForSelectedDay(new Date(year, month, selectedDay));
        }
    }

    // Function to get the event count for a given date
    async function getEventsForDate(date) {
        try {
            const snapshot = await db.collection('events')
                .where('date', '==', date)
                .get();

            const events = [];
            snapshot.forEach((doc) => {
                const eventData = doc.data();
                events.push(eventData);
            });

            console.log(`Event count for ${date}:`, events); // Log event count

            return events;
        } catch (error) {
            console.error('Error getting event count: ', error);
            return []; // Handle the error as needed
        }
    }

    // Initial display of the calendar (for example, for the current month)
    displayEventsOnCalendar(currentYear, currentMonth);
});