const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const eventsList = document.querySelector("#events");
const newEventForm = document.querySelector("#addEvent");
const removeBtn = document.querySelector("#remove");

// === State ===

const state = {
  events: [],
};

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (err) {
    console.error(err);
  }
}

async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
  }
}

async function removeEvent(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete object");
    }

    state.events = state.events.filter((event) => event.id !== eventId);

    renderEvents();
  } catch (err) {
    console.error("error deleting item:", error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventsList.innerHTML = "<p>Sorry, no events</p>";
    return;
  }
  const eventHTML = state.events.map((event) => {
    const newListing = document.createElement("li");
    const newListingContent = `<h2> ${event.name}</h2><p>${event.description}</p><p>${event.date}</p><p>${event.location}</p><p><button class ="remove" data-id="${event.id}">Delete</button></p>`;
    newListing.innerHTML = newListingContent;

    const deleteBtn = newListing.querySelector(".remove");
    deleteBtn.addEventListener("click", function () {
      removeEvent(event.id);
    });

    return newListing;
  });

  console.log(eventHTML);
  eventsList?.replaceChildren(...eventHTML);
}

async function render() {
  await getEvents();
  renderEvents();
}

newEventForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const dateInput = newEventForm.datetime.value;
  const date = new Date(dateInput).toISOString();

  const newEvent = {
    name: newEventForm.eventName.value,
    description: newEventForm.description.value,
    date,
    location: newEventForm.location.value,
  };

  const result = await addEvent(newEvent);
  console.log(result);
  if (result.success) {
    await getEvents();
    renderEvents();
  }
});

render();
