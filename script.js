// Progressive enhancements for the editorial portfolio.
// The main page, project cards, and navigation links remain usable without JavaScript.
(() => {
  "use strict";

  document.documentElement.classList.add("has-js");
  const currentYear = document.getElementById("year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());


  // Public, self-contained Infosys feature. No external post or private project data.
  const careerFeatures = {
    role: { label: "WHAT I'LL BE FOCUSING ON", title: "AI Agent Engineering", copy: "I'll be joining as a Computer Engineering Intern, working in AI Agent Engineering. Looking forward to learning a lot and contributing to the team." },
    program: { label: "THE INTERNSHIP", title: "Infosys InStep", copy: "I'll be joining through Infosys's InStep Internship Program for Winter 2027." },
    location: { label: "WHERE I'LL BE", title: "Bengaluru, India", copy: "I'll be based in Bengaluru and joining the team at the Infosys CTO office." }
  };
  const careerTabs = Array.from(document.querySelectorAll(".career-feature-tab"));
  const careerLabel = document.getElementById("careerFeatureLabel");
  const careerTitle = document.getElementById("careerFeatureTitle");
  const careerCopy = document.getElementById("careerFeatureCopy");
  function showCareerFeature(key) {
    const data = careerFeatures[key];
    if (!data) return;
    careerTabs.forEach(tab => {
      const active = tab.dataset.feature === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    if (careerLabel) careerLabel.textContent = data.label;
    if (careerTitle) careerTitle.textContent = data.title;
    if (careerCopy) careerCopy.textContent = data.copy;
  }
  careerTabs.forEach(tab => tab.addEventListener("click", () => showCareerFeature(tab.dataset.feature)));


  // Accessible four-sided project cube. Buttons rotate it; the link follows the visible side.
  const cube = document.getElementById("worldCube");
  const cubeLink = document.getElementById("worldProjectLink");
  const cubeProjects = [
    {name:"Quadmates",href:"projects/quadmates.html"},
    {name:"TransitOps",href:"projects/transitops.html"},
    {name:"NeuroSim",href:"neurosim-mission.html"},
    {name:"Staffflow",href:"projects/staffflow.html"}
  ];
  let cubeIndex = 0;
  let cubeTurns = 0;
  function rotateCube(delta) {
    if (!cube || !cubeLink) return;
    cubeTurns += delta;
    cubeIndex = ((cubeTurns % cubeProjects.length) + cubeProjects.length) % cubeProjects.length;
    cube.style.transform = "rotateX(-15deg) rotateY(" + (-25 - 90 * cubeTurns) + "deg)";
    const project = cubeProjects[cubeIndex];
    cubeLink.href = project.href;
    cubeLink.textContent = "Explore " + project.name + " ↗";
    cube.setAttribute("aria-label", "Showing " + project.name);
  }
  document.getElementById("worldPrev")?.addEventListener("click", () => rotateCube(-1));
  document.getElementById("worldNext")?.addEventListener("click", () => rotateCube(1));

  // Small-screen menu
  const menu = document.getElementById("mobileNav");
  const menuToggle = document.getElementById("menuToggle");
  function closeMenu() {
    if (!menu || !menuToggle) return;
    menu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
  if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !menu.hidden) {
        closeMenu();
        menuToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800 && !menu.hidden) closeMenu();
    });
  }

  // A project explainer is a controlled preview, not fabricated production telemetry.
  const metadata = {
    quadmates: {
      title: "Quadmates",
      copy: "Helping students discover people to study with, then turn a connection into a plan."
    },
    transit: {
      title: "TransitOps",
      copy: "Test dispatch decisions against outcomes across a simulated transit network."
    },
    staff: {
      title: "Staffflow",
      copy: "An internal people-operations workspace for hiring, onboarding and coordinating a team."
    },
    neurosim: {
      title: "NeuroSim 2.0",
      copy: "Training and evaluating reinforcement-learning policies for simulated landings."
    }
  };
  const consoleTabs = Array.from(document.querySelectorAll(".console-tab"));
  const consoleTitle = document.getElementById("consoleTitle");
  const consoleCopy = document.getElementById("consoleCopy");
  const caseLink = document.getElementById("consoleCase");
  const liveLink = document.getElementById("consoleLive");
  function activateTab(tab, moveFocus = false) {
    const sceneName = tab?.dataset.scene;
    if (!sceneName || !metadata[sceneName]) return;
    consoleTabs.forEach(button => {
      const active = button === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.hidden = !active;
    });
    if (consoleTitle) consoleTitle.textContent = metadata[sceneName].title;
    if (consoleCopy) consoleCopy.textContent = metadata[sceneName].copy;
    if (caseLink) caseLink.href = tab.dataset.case;
    if (liveLink) {
      const hasLive = Boolean(tab.dataset.live);
      liveLink.hidden = !hasLive;
      if (hasLive) liveLink.href = tab.dataset.live;
      else liveLink.removeAttribute("href");
    }
    if (moveFocus) tab.focus();
  }
  consoleTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", event => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % consoleTabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + consoleTabs.length) % consoleTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = consoleTabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(consoleTabs[next], true);
    });
  });
  if (consoleTabs.length) activateTab(consoleTabs.find(tab => tab.classList.contains("active")) || consoleTabs[0]);

  // Project filters work over the published HTML, including with no network connection.
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-project-card]"));
  const projectGrid = document.getElementById("projectGrid");
  const resultsCount = document.getElementById("resultsCount");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    cards.forEach(card => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (projectGrid) projectGrid.classList.toggle("is-filtered", filter !== "all");
    filterButtons.forEach(candidate => {
      const selected = candidate === button;
      candidate.classList.toggle("selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });
    if (resultsCount) resultsCount.textContent = "Showing " + visibleCount + " project" + (visibleCount === 1 ? "" : "s");
  }));

  // Non-essential scroll progress; passive + animation-frame throttled.
  const progress = document.getElementById("readingProgress");
  let scheduled = false;
  function updateProgress() {
    scheduled = false;
    if (!progress) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percent = total > 0 ? Math.min(100, Math.max(0, window.scrollY / total * 100)) : 0;
    progress.style.width = percent.toFixed(2) + "%";
  }
  if (progress && "requestAnimationFrame" in window) {
    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }
})();
