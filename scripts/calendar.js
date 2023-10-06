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
                checkUserPermission();
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

    function checkUserPermission() {
        const user = firebase.auth().currentUser;
        if (user && user.uid === 'JY1cGAur3TN71XyOLqs5fOZYTgD3') {
            addEventButton.disabled = false;
            addEventButton.style.display = 'block';
        } else {
            addEventButton.disabled = true;
            addEventButton.style.display = 'none';
        }
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            checkUserPermission();
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
        displayEventModal.style.display = 'none';
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.key ==='Esc') {
            eventModal.style.display = 'none';
            displayEventModal.style.display = 'none';
        }
    })

    // closeDisplayModalButton.addEventListener('click', () => {
    //     displayEventModal.style.display = 'none';
    // });

    window.addEventListener('click', function(event) {
        if (event.target === eventModal) {
            eventModal.style.display = 'none';
        } else if (event.target === displayEventModal) {
            displayEventModal.style.display = 'none';
        }
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
            userName: firebase.auth().currentUser.displayName,
        })
        .then(() => {
            alert('Event added successfully!');
            eventModal.style.display = 'none';
            eventTitleInput.value = '';
            eventDateInput.value = '';

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
    
        db.collection('events').where('date', '==', formattedDate).get()
            .then((querySnapshot) => {
                const events = [];
    
                querySnapshot.forEach((doc) => {
                    const eventData = doc.data();
                    // Add event data to the events array
                    events.push(eventData);
                });
    
                // Rest of your code to display events in the modal
                const modalContent = document.getElementById('display-event-modal-content');
                modalContent.innerHTML = '';
                const modalTitle = document.createElement('h2');
                modalTitle.textContent = selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
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
                        const userNameItem = document.createElement('span');
                        eventItem.textContent = `${event.title}`;
                        userNameItem.textContent = `Added by ${event.userName}`;
                        userNameItem.classList.add('user-name');
                        eventList.appendChild(eventItem);
                        eventList.appendChild(userNameItem);
                    });
                    modalContent.appendChild(eventList);
                }
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
        let events = getEventsForDate(formattedDate);
    
        // Create the day number text element
        const dayTextSpan = document.createElement('span');
        dayTextSpan.textContent = day;
    
        // Append both spans to the dayCell
        dayCell.appendChild(dayTextSpan);
    
        // Attach click event listener to each day cell
        dayCell.addEventListener('click', () => {
            const selectedDateElement = document.getElementById('selected-day');
            const eventCountElement = document.getElementById('event-count');
        
            // Use regular expression to find the first number in dayCell's content
            const dayCellContent = dayCell.textContent;
            const selectedDayMatch = dayCellContent.match(/\d{1,2}/);
            const selectedDay = selectedDayMatch ? parseInt(selectedDayMatch[0]) : NaN;
        
            if (!isNaN(selectedDay)) {
                const selectedDate = new Date(year, month, selectedDay);
                
                displayEventsForSelectedDay(selectedDate);

                // Get the event count for the selected date
                getEventsForDate(selectedDate.toISOString().split('T')[0]).then((events) => {
                    const eventCount = events.length;
        
                    // Update the 'selected-day' element with the day
                    selectedDateElement.textContent = `${selectedDay}`;
                });
        
                const displayEventModal = document.getElementById('display-event-modal');
                displayEventModal.style.display = 'block';
            }
        });

        getEventsForDate(formattedDate).then((events) => {
            const eventIndicator = document.createElement('span');
            eventIndicator.classList.add('event-title-on-calendar');
        
            if (events.length === 1) {
                eventIndicator.textContent = `${events.length} Event`;
            } else if (events.length > 1) {
                eventIndicator.textContent = `${events.length} Events`;
            } else {
                return;
            }
            dayCell.appendChild(eventIndicator);
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

        const currentDate = new Date();
        if (currentDate.getFullYear() === currentYear && currentDate.getMonth() === currentMonth) {
            const currentDay = currentDate.getDate();
            const dayCells = calendarGrid.querySelectorAll('.day');
            dayCells.forEach((dayCell) => {
                if (dayCell.textContent === String(currentDay)) {
                    dayCell.classList.add('current-day');
                } else {
                    dayCell.classList.remove('current-day');
                }
            });
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
            return events; // Return the events array
        } catch (error) {
            console.error('Error getting events: ', error);
            return []; // Handle the error as needed and return an empty array
        }
    }

    // Initial display of the calendar (for example, for the current month)
    displayEventsOnCalendar(currentYear, currentMonth);
});