const sections = [
  {
    id: "cover",
    left: `
      <p class="eyebrow">Field notebook · Vol. 01</p>
      <h1 class="display">Nate<br>Powell</h1>
      <p class="hand">Software, systems, and things I’m building.</p>
    `,
    right: `
      <p class="eyebrow">Contents</p>
      <h2>Start anywhere.</h2>
      <p class="lead">I like problems where software has to survive contact with the real world: people, infrastructure, messy constraints, and changing information.</p>
      <div class="index-list">
        <div class="index-item"><span>About</span><span>02</span></div>
        <div class="index-item"><span>Selected projects</span><span>03</span></div>
        <div class="index-item"><span>Work + experience</span><span>04</span></div>
        <div class="index-item"><span>Notes / questions</span><span>05</span></div>
        <div class="index-item"><span>Contact</span><span>06</span></div>
      </div>
    `
  },
  {
    id: "about",
    left: `
      <p class="eyebrow">02 · About</p>
      <h2>I’m interested in systems, not just screens.</h2>
      <p class="lead">I’m a University of Waterloo student who moves between software, economics, product thinking, and operations.</p>
      <p>I’m most interested in technology that coordinates the physical world: transportation, robotics, infrastructure, finance, and tools that make groups of people work better together.</p>
    `,
    right: `
      <p class="eyebrow">How I work</p>
      <div class="note-list">
        <div class="note"><div class="meta"><span>01</span><span>Build</span></div><h3>Prototype the idea</h3><p>Get something tangible working before polishing the story around it.</p></div>
        <div class="note"><div class="meta"><span>02</span><span>Question</span></div><h3>Pull the system apart</h3><p>What actually constrains it? What changes at scale? What happens when assumptions fail?</p></div>
        <div class="note"><div class="meta"><span>03</span><span>Connect</span></div><h3>Cross disciplines</h3><p>Engineering decisions become product, economic, and operational decisions surprisingly quickly.</p></div>
      </div>
      <p class="quote">“Make the complicated thing understandable — then make it useful.”</p>
    `
  },
  {
    id: "projects",
    left: `
      <p class="eyebrow">03 · Selected projects</p>
      <h2>Things I’ve been building.</h2>
      <p>Click a project to move it onto the laptop.</p>
      <div class="project-list">
        <div class="project" data-project="quadmates"><div class="meta"><span>Quadmates</span><span>Product / Full-stack</span></div><h3>Campus coordination</h3><p>A study-matching product designed around turning intent into actual plans.</p></div>
        <div class="project" data-project="transit"><div class="meta"><span>TransitOps</span><span>Simulation / Systems</span></div><h3>Adaptive transit operations</h3><p>Exploring how distributed infrastructure could coordinate buses, stations, signals, and demand.</p></div>
        <div class="project" data-project="staff"><div class="meta"><span>Staff Management</span><span>Full-stack / Operations</span></div><h3>Workforce coordination</h3><p>A live management app for organizing staff and operational information.</p></div>
        <div class="project" data-project="vision"><div class="meta"><span>Vision experiments</span><span>AI / Computer vision</span></div><h3>Machines that interpret scenes</h3><p>Experiments around perception, autonomy, and real-world decision making.</p></div>
      </div>
    `,
    right: `
      <p class="eyebrow">Project principle</p>
      <h2>Show the system.</h2>
      <p class="lead">A project is more interesting when you can see the decisions inside it—not only the final interface.</p>
      <p>This portfolio will grow into interactive case studies: architecture, constraints, discarded ideas, demos, and what I’d change next.</p>
      <div class="quote">The laptop beside the book is intentionally part of the navigation. Projects should feel like software, not résumé bullets.</div>
    `
  },
  {
    id: "work",
    left: `
      <p class="eyebrow">04 · Work + experience</p>
      <h2>Different environments. Same instinct.</h2>
      <div class="work-list">
        <div class="work-item"><div class="meta"><span>UW Orbital</span><span>Business + Finance</span></div><h3>Student satellite design team</h3><p>Sponsor outreach, budget tracking, operations, and web updates.</p></div>
        <div class="work-item"><div class="meta"><span>City of Ottawa</span><span>Aquatics</span></div><h3>Lifeguard + swim instructor</h3><p>Real-time judgement, instruction, safety, and operating under clear procedures.</p></div>
      </div>
    `,
    right: `
      <p class="eyebrow">What transfers</p>
      <h2>Operations matter.</h2>
      <p class="lead">Software doesn’t exist in isolation. The human process around a system often determines whether the technology actually works.</p>
      <p>That’s why I’m drawn to product and engineering work where reliability, coordination, economics, and implementation matter as much as the code.</p>
      <p class="hand">Next: deeper software + product experience.</p>
    `
  },
  {
    id: "notes",
    left: `
      <p class="eyebrow">05 · Open notebook</p>
      <h2>Questions I keep coming back to.</h2>
      <div class="note-list">
        <div class="note"><div class="meta"><span>Autonomy</span><span>01</span></div><p>How should autonomous systems reason when the environment stops matching the training distribution?</p></div>
        <div class="note"><div class="meta"><span>Transit</span><span>02</span></div><p>What if intersections and stations could negotiate service dynamically instead of following a static plan?</p></div>
        <div class="note"><div class="meta"><span>Products</span><span>03</span></div><p>Why do some coordination tools become habits while technically better ones get abandoned?</p></div>
      </div>
    `,
    right: `
      <p class="eyebrow">Marginalia</p>
      <h2>A portfolio should show unfinished thinking too.</h2>
      <p class="lead">This page is deliberately less polished. Good projects usually begin as an annoying question, a sketch, or an assumption that doesn’t quite make sense.</p>
      <p>Eventually this section can hold short technical notes, diagrams, experiments, and postmortems.</p>
      <p class="hand">Not everything needs to become a startup.</p>
    `
  },
  {
    id: "contact",
    left: `
      <p class="eyebrow">06 · Contact</p>
      <h2>Let’s build something difficult.</h2>
      <p class="lead">I’m interested in software, AI, product, infrastructure, finance, and engineering problems where there’s a real system underneath the interface.</p>
      <p>For internships, projects, collaborations, or a good technical question:</p>
    `,
    right: `
      <p class="eyebrow">Find me</p>
      <div class="links">
        <a href="https://github.com/Tophacks" target="_blank" rel="noreferrer"><span>GitHub</span><span>↗</span></a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><span>LinkedIn</span><span>↗</span></a>
        <a href="mailto:"><span>Email</span><span>↗</span></a>
      </div>
      <p class="hand">More links soon.</p>
    `
  }
];

const projects = {
  quadmates: {
    title: "Quadmates",
    copy: "A campus product for turning “we should study sometime” into an actual plan.",
    terminal: "matching people → coordinating plans",
    live: "https://quadmates.vercel.app",
    repo: "https://github.com/Tophacks/quadmates"
  },
  transit: {
    title: "TransitOps",
    copy: "A systems concept for adaptive transit operations using stations, signals, and shared intelligence.",
    terminal: "demand → negotiate → dispatch → adapt",
    live: "https://transitops-phi.vercel.app",
    repo: "https://github.com/Tophacks/TransitOps"
  },
  staff: {
    title: "Staff Management",
    copy: "A live full-stack app for organizing staff and operational information.",
    terminal: "staff → schedule → coordinate → operate",
    live: "https://staff-management-app-five.vercel.app",
    repo: "https://github.com/Tophacks/staff-management-app"
  },
  vision: {
    title: "Vision Lab",
    copy: "Computer-vision experiments focused on how software interprets messy physical environments.",
    terminal: "scene → features → context → action",
    live: "",
    repo: "https://github.com/Tophacks"
  }
};

const appEntries = [
  { key: "quadmates", label: "Quadmates", keywords: "study campus matching students" },
  { key: "transit", label: "TransitOps", keywords: "transit bus simulation operations" },
  { key: "staff", label: "Staff Management", keywords: "staff workforce management operations" },
  { key: "vision", label: "Vision Lab", keywords: "ai computer vision autonomy" }
];

let currentProjectKey = "quadmates";
let current = 0;
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const pageNumber = document.getElementById("pageNumber");
const book = document.getElementById("book");
const prev = document.getElementById("prevPage");
const next = document.getElementById("nextPage");
const tabs = [...document.querySelectorAll(".tab")];

function render(index, animate = true) {
  const section = sections[index];
  if (animate) {
    book.classList.remove("turning");
    void book.offsetWidth;
    book.classList.add("turning");
  }
  setTimeout(() => {
    leftPage.innerHTML = section.left;
    rightPage.innerHTML = section.right;
    attachProjects();
  }, animate ? 160 : 0);

  current = index;
  pageNumber.textContent = `${String(index + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;
  prev.disabled = index === 0;
  next.disabled = index === sections.length - 1;
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.section === section.id));
  history.replaceState(null, "", `#${section.id}`);
}

function attachProjects() {
  document.querySelectorAll("[data-project]").forEach(el => {
    el.addEventListener("click", () => showProject(el.dataset.project));
  });
}

function showProject(key) {
  const project = projects[key];
  if (!project) return;
  currentProjectKey = key;
  document.getElementById("deviceTitle").textContent = project.title;
  document.getElementById("deviceCopy").textContent = project.copy;
  const liveLink = document.getElementById("liveAppLink");
  const repoLink = document.getElementById("repoLink");
  const previewButton = document.getElementById("previewAppButton");
  if (project.live) {
    liveLink.href = project.live;
    liveLink.style.display = "inline-flex";
    previewButton.style.display = "inline-flex";
  } else {
    liveLink.style.display = "none";
    previewButton.style.display = "none";
  }
  repoLink.href = project.repo;
  typeText(project.terminal);
}

function typeText(text) {
  const target = document.getElementById("typedText");
  target.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    target.textContent += text[i] || "";
    i++;
    if (i >= text.length) clearInterval(timer);
  }, 24);
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const index = sections.findIndex(s => s.id === tab.dataset.section);
    if (index >= 0) render(index);
  });
});
prev.addEventListener("click", () => current > 0 && render(current - 1));
next.addEventListener("click", () => current < sections.length - 1 && render(current + 1));
document.querySelectorAll("[data-jump]").forEach(el => {
  el.addEventListener("click", () => {
    const index = sections.findIndex(s => s.id === el.dataset.jump);
    if (index >= 0) render(index);
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" && current < sections.length - 1) render(current + 1);
  if (e.key === "ArrowLeft" && current > 0) render(current - 1);
});

document.getElementById("soundToggle").addEventListener("click", e => {
  e.currentTarget.textContent = e.currentTarget.textContent === "sound off" ? "sound on" : "sound off";
});

document.getElementById("year").textContent = new Date().getFullYear();

const hash = location.hash.replace("#", "");
const initial = sections.findIndex(s => s.id === hash);
render(initial >= 0 ? initial : 0, false);
typeText(projects.quadmates.terminal);

function renderSearchResults(query) {
  const box = document.getElementById("searchResults");
  const q = query.trim().toLowerCase();
  if (!q) {
    box.classList.remove("active");
    box.innerHTML = "";
    return;
  }
  const matches = appEntries.filter(app =>
    (app.label + " " + app.keywords).toLowerCase().includes(q)
  );
  if (!matches.length) {
    box.innerHTML = '<div class="search-result"><small>No matching apps</small></div>';
    box.classList.add("active");
    return;
  }
  box.innerHTML = matches.map(app => {
    const p = projects[app.key];
    return `<button class="search-result" data-search-project="${app.key}" type="button"><strong>${app.label}</strong><small>${p.live ? "Live app available" : "Project only"}</small></button>`;
  }).join("");
  box.classList.add("active");
  box.querySelectorAll("[data-search-project]").forEach(btn => {
    btn.addEventListener("click", () => {
      showProject(btn.dataset.searchProject);
      box.classList.remove("active");
      document.getElementById("appSearch").value = "";
    });
  });
}

function previewCurrentApp() {
  const project = projects[currentProjectKey];
  if (!project || !project.live) return;
  const preview = document.getElementById("sitePreview");
  const frame = document.getElementById("previewFrame");
  const label = document.getElementById("previewLabel");
  try {
    label.textContent = new URL(project.live).hostname;
  } catch {
    label.textContent = project.title;
  }
  frame.src = project.live;
  preview.hidden = false;
}

const searchInput = document.getElementById("appSearch");
document.getElementById("searchButton").addEventListener("click", () => renderSearchResults(searchInput.value));
searchInput.addEventListener("input", e => renderSearchResults(e.target.value));
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const q = e.currentTarget.value.trim().toLowerCase();
    const match = appEntries.find(app => (app.label + " " + app.keywords).toLowerCase().includes(q));
    if (match) {
      showProject(match.key);
      document.getElementById("searchResults").classList.remove("active");
      e.currentTarget.value = "";
    } else {
      renderSearchResults(q);
    }
  }
});
document.getElementById("previewAppButton").addEventListener("click", previewCurrentApp);
document.getElementById("closePreview").addEventListener("click", () => {
  document.getElementById("sitePreview").hidden = true;
  document.getElementById("previewFrame").src = "";
});
