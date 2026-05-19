//state
const state = {
  parties: [],
  selectedParty: null,
};
//link API
const API_BASE_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2603-FTB-CT-WEB-PT";

//API FECTH
//FETCHING ALL UPCOMING PARTIES
async function fetchAllParties() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error("Failed to fect parties.");
    }
    const result = await response.json();
    state.parties = result.data || result;
  } catch (error) {
    console.error("Error fetching all aprties:", error);
    alert("could not load parties. Please try again!");
  }
}
//fetching details for a single party
async function fetchingSingleParty(partyId) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${partyId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch party with ID ${partyId}`);
    }
    const result = await response.json();
    state.selectedParty = result.data || result;
  } catch (error) {
    console.error(`Error fetching party #${partyId}:`, error);
    alert("could not load party details.");
  }
}
//UI component functions
function renderPartyList() {
  const listContainer = document.createElement("section");
  listContainer.id = "party-list-container";

  const title = document.createElement("h2");
  title.textContent = "Upcoming Parties";
  listContainer.appendChild(title);

  const ul = document.createElement("ul");
  ul.style.listStyleType = "none";
  ul.style.padding = "0";

  state.parties.forEach((party) => {
    const li = document.createElement("li");
    li.textContent = party.name;
    li.style.cursor = "pointer";
    li.style.border = "1px solid #ccc";
    li.style.borderRadius = "5px";
    li.style.padding = "10px 15px";
    li.style.marginBottom = "10px";
    li.style.backgroundColor = "#f9f9f9";
    li.style.transition = "all 0.2s ease";

    if (state.selectedParty && state.selectedParty.id === party.id) {
      li.style.fontWeight = "bold";
      li.style.color = "#007bff";
    }
    //triger state update and render
    li.addEventListener("click", async () => {
      await fetchingSingleParty(party.id);
      renderApp();
    });
    ul.appendChild(li);
  });
  listContainer.appendChild(ul);
  return listContainer;
}
//build party details view component
function renderPartyDetails() {
  const detailsContainer = document.createElement("section");
  detailsContainer.id = "party-details-container";

  const title = document.createElement("h2");
  title.textContent = "Party Details";

  if (!state.selectedParty) {
    const placeholder = document.createElement("p");
    placeholder.textContent =
      "Please, select party from the list to view details";
    detailsContainer.appendChild(placeholder);
    return detailsContainer;
  }
  const party = state.selectedParty;

  const partyName = document.createElement("h3");
  partyName.textContent = party.name;

  const partyLocation = document.createElement("p");
  partyLocation.innerHTML = `<strong>Location:</strong> ${party.location}`;

  const partyId = document.createElement("p");
  partyId.innerHTML = `<strong>ID:</strong> ${party.id}`;

  const partyDate = document.createElement("p");
  const formattedDate = new Date(party.date).toLocaleString();
  partyDate.innerHTML = `<strong>Date:</strong> ${formattedDate}`;

  const partyDesc = document.createElement("p");
  partyDesc.innerHTML = `<strong>Description</strong> ${party.description}`;

  detailsContainer.appendChild(partyName);
  detailsContainer.appendChild(partyId);
  detailsContainer.appendChild(partyDate);
  detailsContainer.appendChild(partyLocation);
  detailsContainer.appendChild(partyDesc);

  return detailsContainer;
}
//main render
function renderApp() {
  const root = document.getElementById("root");
  root.innerHTML = "";
  const appLayout = document.createElement("div");
  appLayout.style.display = "flex";
  appLayout.style.gap = "40px";

  const mainHeading = document.createElement("h1");
  mainHeading.textContent = "Party Planner";
  mainHeading.style.textAlign = "center";
  mainHeading.style.marginBottom = "30px";
  mainHeading.style.color = "#333";

  appLayout.appendChild(renderPartyList());
  appLayout.appendChild(renderPartyDetails());

  root.appendChild(mainHeading);
  root.appendChild(appLayout);
}
//initial init entry point
async function init() {
  if (!document.getElementById("root")) {
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);
  }
  await fetchAllParties();
  renderApp();
}
init();
