let allLinks = document.querySelectorAll(".nav-link");
let allSections = document.querySelectorAll(".app-section");
let apodDate = document.getElementById("apod-date");
let loadBtn = document.getElementById("load-date-btn");
let todayBtn = document.getElementById("today-apod-btn");
let apodImage = document.getElementById("apod-image");
let apodTitle = document.getElementById("apod-title");
let apodExplanation = document.getElementById("apod-explanation");
let apodDateDetail = document.getElementById("apod-date-detail");
let apodDateInfo = document.getElementById("apod-date-info");
let apodMediaType = document.getElementById("apod-media-type");
let apodCopyright = document.getElementById("apod-copyright");
let apodDateInput = document.getElementById("apod-date-input");
let apodLoading = document.getElementById("apod-loading");
let apodImageContainer = document.getElementById("apod-image-container");
let apodDateLabel = document.querySelector('label[for="apod-date-input"] span');

for (let i = 0; i < allLinks.length; i++) {
  allLinks[i].addEventListener("click", (e) => {
    e.preventDefault();

    for (let j = 0; j < allSections.length; j++) {
      allSections[j].classList.add("hidden");
    }
    allSections[i].classList.remove("hidden");

    for (let k = 0; k < allLinks.length; k++) {
      allLinks[k].classList.replace("text-blue-400", "text-slate-300");
      allLinks[k].classList.replace("bg-blue-500/10", "hover:bg-slate-800");
    }

    allLinks[i].classList.replace("text-slate-300", "text-blue-400");
    allLinks[i].classList.replace("hover:bg-slate-800", "bg-blue-500/10");
  });
}

async function getData() {
  await getToday();
  await getLaunches();
  await getPlant();
}

getData();

async function getToday() {
  let response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=wN96twHmqGBfWLjqCWtBWHCDJBdrB9WRcC88TpkQ`,
  );
  if (!response.ok) {
    console.log("Request failed:", response.status);
    return;
  }
  let data = await response.json();

  displayData(data);
}

async function getLaunches() {
  let response = await fetch(
    `https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?format=json&limit=10`,
  );
  if (!response.ok) {
    console.log("Request failed: ", response.status);
    return;
  }
  let data = await response.json();

  bigCard(data.results[0]);
  smallCards(data.results);
}

async function getPlant() {
  let response = await fetch(
    `https://solar-system-opendata-proxy.vercel.app/api/planets`,
  );
  if (!response.ok) {
    console.log("Request failed", response.status);
    return;
  }

  let data = await response.json();
  displayPlant(data.bodies);
  displayplanData(data.bodies[6]);
  displaycomTable(data.bodies);
}

async function getspecificDay(date) {
  let response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=wN96twHmqGBfWLjqCWtBWHCDJBdrB9WRcC88TpkQ&date=${date}`,
  );
  if (!response.ok) {
    console.log("Request failed:", response.status);
    return;
  }
  let data = await response.json();
  displayData(data);
}

function dataFormat(date) {
  let ddate = new Date(date);
  let dataFormat = ddate.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dataFormat;
}

function displayData(data) {
  let date = dataFormat(data.date);
  apodDate.textContent = `Astronomy Picture of the Day - ${date}`;
  apodDateLabel.textContent = date;
  apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${data.date}`;
  apodDateInfo.textContent = data.date;
  apodDateInput.value = data.date;
  apodImage.src = data.hdurl || data.url;
  apodTitle.textContent = data.title;
  apodExplanation.textContent = data.explanation;
  apodMediaType.textContent = data.media_type;
  apodCopyright.textContent = data.copyright ? `© ${data.copyright}` : "";
}

apodDateInput.addEventListener("change", () => {
  let dataspan = dataFormat(apodDateInput.value);
  apodDateLabel.textContent = dataspan;
});

loadBtn.addEventListener("click", async () => {
  await getspecificDay(apodDateInput.value);
});

todayBtn.addEventListener("click", getToday);
apodDateInput.max = new Date().toISOString().split("T")[0];

function bigCard(data) {
  let allInfo = allData(data);
  let cartona = `<div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-${allInfo.statusColor}-500/20 text-${allInfo.statusColor}-400 rounded-full text-sm font-semibold"
                      >
                        ${allInfo.status}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${allInfo.name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${allInfo.provider}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${allInfo.roc}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">${allInfo.day}</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${allInfo.lunDate}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${allInfo.lunTime}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${allInfo.location}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${allInfo.country}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${allInfo.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                      <img src="${allInfo.image}" alt="${allInfo.name}" class="w-full h-full object-cover" />
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
    </div>`;

  document.getElementById("featured-launch").innerHTML = cartona;
}

function allData(lun) {
  let tripTime = new Date(lun.net);
  let day = Math.ceil((tripTime - new Date()) / (24 * 60 * 60 * 1000));
  let status = lun.status.abbrev;

  return {
    name: lun.name,
    provider: lun.launch_service_provider.name,
    roc: lun.rocket.configuration.name,
    description: lun.mission?.description || lun.status.description,
    location: lun.pad.location.name,
    country: lun.pad.country.name,
    image: lun.image?.image_url || "./assets/images/placeholder.webp",
    status,
    statusColor: { Go: "green", TBD: "red", TBC: "yellow" }[status] || "slate",
    day,
    lunDate: tripTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }),
    lunTime:
      tripTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }) + " UTC",
  };
}

function smallCards(res) {
  let cartona = "";

  for (let i = 1; i < res.length; i++) {
    let info = allData(res[i]);
    cartona += `
                <div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                <img src="${info.image}" alt="${info.name}" class="w-full h-full object-cover" />
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-${info.statusColor}-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    ${info.status}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${info.name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${info.provider}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${info.lunDate}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${info.lunTime}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${info.roc}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${info.location}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`;
  }

  document.getElementById("launches-grid").innerHTML = cartona;
}

function displayPlant(plants) {
  let color = {
    mercury: "#eab308",
    venus: "#f97316",
    earth: "#3b82f6",
    mars: "#ef4444",
    jupiter: "#fb923c",
    saturn: "#facc15",
    uranus: "#06b6d4",
    neptune: "#2563eb",
  };

  let images = {
    mercury: "./assets/images/mercury.png",
    venus: "./assets/images/venus.png",
    earth: "./assets/images/earth.png",
    mars: "./assets/images/mars.png",
    jupiter: "./assets/images/jupiter.png",
    saturn: "./assets/images/saturn.png",
    uranus: "./assets/images/uranus.png",
    neptune: "./assets/images/neptune.png",
  };

  let cartona = "";

  for (let i = 0; i < plants.length; i++) {
    cartona += `
    <div
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="${[plants[i].englishName.toLowerCase()]}"
              style="--planet-color: ${color[plants[i].englishName.toLowerCase()]}"
              onmouseover="this.style.borderColor = '${color[plants[i].englishName.toLowerCase()]}80'"
              onmouseout="this.style.borderColor = '#334155'"
            >
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                  src="${images[plants[i].englishName.toLowerCase()]}"
                  alt="${plants[i].englishName}"
                />
              </div>
              <h4 class="font-semibold text-center text-sm">${plants[i].englishName}</h4>
              <p class="text-xs text-slate-400 text-center">${((plants[i].semimajorAxis / 1000000).toFixed(2) / 149.6).toFixed(2)} AU</p>
    </div>`;
  }

  document.getElementById("planets-grid").innerHTML = cartona;

  let allPlants = document.querySelectorAll(".planet-card");

  allPlants.forEach((planet) => {
    planet.addEventListener("click", () => {
      let currentPlant = planet.getAttribute("data-planet-id");

      let plantSelected = "";
      for (let i = 0; i < plants.length; i++) {
        if (plants[i].englishName.toLowerCase() === currentPlant) {
          plantSelected = plants[i];
        }
      }
      displayplanData(plantSelected);
    });
  });
}

function displayplanData(plant) {
  let information = infoPlants(plant);
  let color = {
    mercury: "#eab308",
    venus: "#f97316",
    earth: "#3b82f6",
    mars: "#ef4444",
    jupiter: "#fb923c",
    saturn: "#facc15",
    uranus: "#06b6d4",
    neptune: "#2563eb",
  };

  let images = {
    mercury: "./assets/images/mercury.png",
    venus: "./assets/images/venus.png",
    earth: "./assets/images/earth.png",
    mars: "./assets/images/mars.png",
    jupiter: "./assets/images/jupiter.png",
    saturn: "./assets/images/saturn.png",
    uranus: "./assets/images/uranus.png",
    neptune: "./assets/images/neptune.png",
  };

  let cartona = `
  <div
              class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8"
            >
              <div
                class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0"
              >
                <div
                  class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6"
                >
                  <img
                    id="planet-detail-image"
                    class="w-full h-full object-contain"
                    src="${images[information.name.toLowerCase()]}"
                    alt="${information.name}"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3 md:mb-4">
                    <h3
                      id="planet-detail-name"
                      class="text-2xl md:text-3xl font-space font-bold"
                    >
                      ${information.name}
                    </h3>
                    <button
                      class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <i class="far fa-heart"></i>
                    </button>
                  </div>
                  <p
                    id="planet-detail-description"
                    class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
                  >
                  ${information.description}
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
                <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-ruler text-xs"></i>
                    <span class="text-xs">Semimajor Axis</span>
                  </p>
                  <p
                    id="planet-distance"
                    class="text-sm md:text-lg font-semibold"
                  >
                    ${information.jorAxis} km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-circle"></i>
                    Mean Radius
                  </p>
                  <p id="planet-radius" class="text-lg font-semibold">
                    ${information.meanRadius.toFixed(0)} km
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-weight"></i>
                    Mass
                  </p>
                  <p id="planet-mass" class="text-lg font-semibold">
                    ${information.massValue} × 10^${information.massExponent} kg
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-compress"></i>
                    Density
                  </p>
                  <p id="planet-density" class="text-lg font-semibold">
                    ${information.density.toFixed(2)} g/cm³
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-sync-alt"></i>
                    Orbital Period
                  </p>
                  <p id="planet-orbital-period" class="text-lg font-semibold">
                    ${information.orbitalPeriod.toFixed(2)} days
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-redo"></i>
                    Rotation Period
                  </p>
                  <p id="planet-rotation" class="text-lg font-semibold">
                    ${information.rotationPeriod.toFixed(2)} hours
                  </p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-moon"></i>
                    Moons
                  </p>
                  <p id="planet-moons" class="text-lg font-semibold">${information.moons}</p>
                </div>
                <div class="bg-slate-900/50 rounded-lg p-4">
                  <p
                    class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                  >
                    <i class="fas fa-arrows-alt-v"></i>
                    Gravity
                  </p>
                  <p id="planet-gravity" class="text-lg font-semibold">
                    ${information.gravity.toFixed(2)} m/s²
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
                  Discovery Info
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Discovered By</span>
                    <span
                      id="planet-discoverer"
                      class="font-semibold text-right"
                      >${information.discoverBy}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Discovery Date</span>
                    <span id="planet-discovery-date" class="font-semibold"
                      >${information.discoverDate}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Body Type</span>
                    <span id="planet-body-type" class="font-semibold"
                      >${information.type}</span
                    >
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Volume</span>
                    <span id="planet-volume" class="font-semibold">${information.volValue} × 10^${information.volExponent}  km³</span>
                  </div>
                </div>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
                  Quick Facts
                </h4>
                <ul id="planet-facts" class="space-y-3 text-sm">
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Mass: ${information.massValue} × 10^${information.massExponent} kg</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Surface gravity: ${information.gravity} m/s²</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Density: ${information.density} g/cm³</span
                    >
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300"
                      >Axial tilt: ${information.axialTilt}</span
                    >
                  </li>
                </ul>
              </div>
              <div
                class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <h4 class="font-semibold mb-4 flex items-center">
                  <i class="fas fa-satellite text-blue-400 mr-2"></i>
                  Orbital Characteristics
                </h4>
                <div class="space-y-3 text-sm">
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Perihelion</span>
                    <span id="planet-perihelion" class="font-semibold"
                      >${information.perihelion}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Aphelion</span>
                    <span id="planet-aphelion" class="font-semibold"
                      >${information.aphelion}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Eccentricity</span>
                    <span id="planet-eccentricity" class="font-semibold"
                      >${information.eccentricity}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Inclination</span>
                    <span id="planet-inclination" class="font-semibold"
                      >${information.inclination}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Axial Tilt</span>
                    <span id="planet-axial-tilt" class="font-semibold"
                      >${information.axialTilt}</span
                    >
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-slate-700"
                  >
                    <span class="text-slate-400">Avg Temperature</span>
                    <span id="planet-temp" class="font-semibold">${information.avgTemp}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-slate-400">Escape Velocity</span>
                    <span id="planet-escape" class="font-semibold"
                      >${information.escape}</span
                    >
                  </div>
                </div>
              </div>
              <button
                class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                <i class="fas fa-book mr-2"></i>Learn More
              </button>
  </div>`;

  document.getElementById("data-plan").innerHTML = cartona;
}

function infoPlants(plant) {
  let mass = plant.mass?.massValue;
  let massExponent = plant.mass?.massExponent;
  let massEarth = mass
    ? ((mass * 10 ** massExponent) / 5.97237e24).toFixed(3)
    : "-";

  return {
    name: plant.englishName,
    description: plant.description || "",
    jorAxis: (plant.semimajorAxis / 1e6).toFixed(1) + "M",
    au: (plant.semimajorAxis / 149597870.7).toFixed(2),
    meanRadius: plant.meanRadius,
    massValue: mass,
    massExponent,
    massEarth,
    density: plant.density,
    orbitalPeriod: plant.sideralOrbit,
    rotationPeriod: plant.sideralRotation,
    moons: plant.moons?.length || 0,
    gravity: plant.gravity,
    volValue: plant.vol?.volValue,
    volExponent: plant.vol?.volExponent,
    discoverBy: plant.discoveredBy || "Known since antiquity",
    discoverDate: plant.discoveryDate || "Ancient times",
    type: plant.type,

    axialTilt: plant.axialTilt ? plant.axialTilt.toFixed(2) + "°" : "N/A",
    perihelion: plant.perihelion
      ? (plant.perihelion / 1e6).toFixed(1) + "M km"
      : "N/A",
    aphelion: plant.aphelion
      ? (plant.aphelion / 1e6).toFixed(1) + "M km"
      : "N/A",
    eccentricity: plant.eccentricity ? plant.eccentricity : "N/A",
    inclination: plant.inclination ? plant.inclination.toFixed(2) + "°" : "N/A",
    avgTemp: plant.avgTemp ? plant.avgTemp.toFixed(0) + "°C" : "N/A",
    escape: plant.escape ? (plant.escape / 1000).toFixed(2) + " km/s" : "N/A",
  };
}

function displaycomTable(plants) {
  let cartona = "";

  let color = {
    mercury: "#6b7280",
    venus: "#f97316",
    earth: "#3b82f6",
    mars: "#ef4444",
    jupiter: "#fb923c",
    saturn: "#facc15",
    uranus: "#06b6d4",
    neptune: "#2563eb",
  };

  let typeColors = {
    "Ice Giant": "bg-blue-500/50 text-blue-200",
    "Gas Giant": "bg-purple-500/50 text-purple-200",
    Terrestrial: "bg-orange-500/50 text-orange-200",
  };

  for (let i = 0; i < plants.length; i++) {
    let data = infoPlants(plants[i]);
    cartona += `
    <tr class="hover:bg-slate-800/30 transition-colors">
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
                      >
                        <div class="flex items-center space-x-2 md:space-x-3">
                          <div
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                            style="background-color: ${color[data.name.toLowerCase()]}"
                          ></div>
                          <span
                            class="font-semibold text-sm md:text-base whitespace-nowrap"
                            >${data.name}</span
                          >
                        </div>
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${data.au}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${Math.round(data.meanRadius * 2).toLocaleString("en-US")}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${data.massEarth}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${data.orbitalPeriod >= 365 ? (data.orbitalPeriod / 365.25).toFixed(1) + " years" : Math.round(data.orbitalPeriod) + " days"}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${data.moons}
                      </td>
                      <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded text-xs ${typeColors[data.type] || "bg-slate-500/50 text-slate-200"}"
                          >${data.type}</span
                        >
                      </td>
                    </tr>
    `;
  }

  document.getElementById("planet-comparison-tbody").innerHTML = cartona;
}
