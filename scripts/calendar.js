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

// Firebase Firestore reference
const db = firebase.firestore();

// DOM Elements
const eventList = document.getElementById('event-list');
const addEventButton = document.getElementById('add-event');
const eventModal = document.getElementById('event-modal');
const eventForm = document.getElementById('event-form');
const eventTitle = document.getElementById('event-title');
const eventDate = document.getElementById('event-date');
const closeModal = document.querySelector('.close');



// Function to display the calendar grid for a given year and month
function displayCalendar(year, month) {
  const calendarGrid = document.getElementById('calendar-grid');
  calendarGrid.innerHTML = '';

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Create day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (const dayHeader of dayHeaders) {
      const header = document.createElement('div');
      header.classList.add('day-header');
      header.textContent = dayHeader;
      calendarGrid.appendChild(header);
  }

  // Create empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.classList.add('day', 'empty-day');
      calendarGrid.appendChild(emptyDay);
  }

  // Create cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
      const calendarDay = document.createElement('div');
      calendarDay.classList.add('day');
      calendarDay.textContent = day;
      calendarGrid.appendChild(calendarDay);
  }

  // Update the displayed month and year in the header
  document.getElementById('calendar-month-year').textContent = `${getMonthName(month)} ${year}`;
}

// Helper function to get the name of the month
function getMonthName(month) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[month];
}

// Event listener for changing to the previous month
document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
      currentMonth = 11; // December
      currentYear--;
  }
  displayCalendar(currentYear, currentMonth);
  displayEventsOnCalendar(currentYear, currentMonth); // Call this to display events for the new month
});

// Event listener for changing to the next month
document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
      currentMonth = 0; // January
      currentYear++;
  }
  displayCalendar(currentYear, currentMonth);
  displayEventsOnCalendar(currentYear, currentMonth); // Call this to display events for the new month
});

// Event listener for adding events
eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = eventTitle.value;
  const date = new Date(eventDate.value);

  if (title && date) {
    // Save the event to Firebase
    db.collection('events').add({
        title,
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }).then(() => {
        // Event saved successfully, close the modal
        eventModal.style.display = 'none';
        eventForm.reset();
    }).catch((error) => {
        console.error('Error adding event: ', error);
    });
}
});

// Function to display events on the calendar for a given year and month
function displayEventsOnCalendar(year, month) {
  const calendarGrid = document.getElementById('calendar-grid');
  
  // Fetch events from Firebase for the specified year and month
  db.collection('events')
      .where('date', '>=', new Date(year, month, 1))
      .where('date', '<=', new Date(year, month + 1, 0))
      .get()
      .then((querySnapshot) => {
          // Clear any previously displayed events
          const eventDivs = calendarGrid.querySelectorAll('.event');
          eventDivs.forEach((eventDiv) => {
              eventDiv.remove();
          });

          querySnapshot.forEach((doc) => {
              const eventData = doc.data();
              const day = eventData.date.toDate().getDate();
              const eventDiv = document.createElement('div');
              eventDiv.classList.add('event');
              eventDiv.textContent = eventData.title;

              // Find the day cell in the calendar grid and append the event if it exists
              const dayCell = calendarGrid.querySelector(`.day:nth-child(${day + 1})`);
              if (dayCell) {
                  dayCell.appendChild(eventDiv);
              } else {
                  console.error('Day cell not found for date:', eventData.date.toDate());
              }
          });
      })
      .catch((error) => {
          console.error('Error getting events: ', error);
      });
}

// document.getElementById('add-event-button').addEventListener('click', () => {
//   eventModal.style.display = 'block';
// });

// Call the initial displayCalendar function
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
displayCalendar(currentYear, currentMonth);

// Call the initial displayEventsOnCalendar function
displayEventsOnCalendar(currentYear, currentMonth);