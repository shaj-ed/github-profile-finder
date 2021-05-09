// ==== Select DOM ==== //
const searchIcon = document.querySelector("#search-icon");
const searchContainer = document.querySelector(".header__search");
const searchInput = document.querySelector("#search-input");

const viewRepo = document.querySelector(".view-repo");
const repoButton = document.querySelector("abbr");
const repo = document.querySelector(".repo");

let url = "https://api.github.com/users/";

// ==== Events ==== //

// Show search input
searchIcon.addEventListener("click", () => {
  searchContainer.classList.toggle("show-input");
});

// Show Repos
viewRepo.addEventListener("click", () => {
  repo.classList.toggle("view");
});

// Search Input
searchInput.addEventListener("keypress", getProfile);

// ==== Functions ==== //

// Get profile
async function getProfile(e) {
  // init some variables
  let inputValue = searchInput.value;

  if (e.keyCode === 13) {
    viewRepo.classList.add("visible");

    const response = await fetch(url + inputValue);
    const profile = await response.json();

    // Show profile
    showProfile(profile);

    // Get profile repos
    getRepos(inputValue);

    // Clear the input field
    searchInput.value = "";
  }
}

// Show profile
function showProfile(data) {
  const profileSection = document.querySelector(".profile");

  profileSection.innerHTML = `
              <div class="profile__image">
                <img src="${data.avatar_url}" alt="" />
              </div>

            <div class="profile__info">
              <h3 class="profile__name">${data.name}</h3>
              <span class="profile__area"
                ><i class="fas fa-map-marker-alt"></i>${data.location}</span
              >
              <p class="profile__bio">${data.bio}</p>
            </div>

            <div class="profile__stats">
              <p>Followers<br /><strong>${data.followers}</strong></p>
              <p>Following<br /><strong>${data.following}</strong></p>
              <p>Repos<br /><strong>${data.public_repos}</strong></p>
            </div>
  `;
  // Visit button
  const visitProfile = document.querySelector(".visit-button");
  visitProfile.href = `${data.html_url}`;
}

// Get Repos
async function getRepos(user) {
  const response = await fetch(url + user + "/repos");
  const allRepo = await response.json();

  // Add repos
  addRepos(allRepo);
}

// Add repos to html docs
function addRepos(repos) {
  let output = "";
  let reposArray = Array.from(repos);
  reposArray
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .forEach((item) => {
      output += `<a href="${item.html_url}" class="repo__link" target="_blank">${item.name}</a>`;
      repo.innerHTML = `<h3>Repos:</h3><br>${output}`;
    });
}
