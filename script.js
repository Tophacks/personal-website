const sections = [
  {
    id: "cover",
    left: `
      <p class="eyebrow">Field notebook · Vol. 01</p>
      <h1 class="display">Nate<br>Powell<span class="hero-stop">.</span></h1>
      <p class="lead">I build software for complex systems—where engineering meets the real world.</p><p class="cover-subline">Mathematical Physics · University of Waterloo</p>
      <div class="cover-actions"><button type="button" data-section-jump="projects">Explore my work ↗</button><a href="engineering.html">Engineering case studies →</a></div>
      <p class="hand">From the model to the people using it.</p>
    `,
    right: `
      <p class="eyebrow">Contents</p>
      <h2>A notebook of ideas turned into working systems.</h2>
      <p class="lead">I like understanding how systems work, pulling apart difficult problems, and building things that can have a real-world impact. My interests span technology, economics, and business, particularly how systems affect the people who use them.</p>
      <div class="index-list">
        <button type="button" class="index-item" data-section-jump="about"><span>About</span><span>02</span></button>
        <button type="button" class="index-item" data-section-jump="projects"><span>Selected projects</span><span>03</span></button>
        <button type="button" class="index-item" data-section-jump="work"><span>Work + experience</span><span>04</span></button>
        <button type="button" class="index-item" data-section-jump="notes"><span>Notes / questions</span><span>05</span></button>
        <button type="button" class="index-item" data-section-jump="contact"><span>Contact</span><span>06</span></button>
      </div>
    `
  },
  {
    id: "about",
    left: `
      <p class="eyebrow">02 · About</p>
      <h2>I like figuring out how things connect.</h2>
      <p class="lead">I study Mathematical Physics at the University of Waterloo, with interests in software, engineering, economics, and business.</p>
      <p>I’m especially drawn to problems where software meets the physical world — transportation, robotics, infrastructure, autonomy, and products that help people coordinate better. I like learning how the whole system works, not just the part on the screen.</p>
    `,
    right: `
      <p class="eyebrow">How I work</p>
      <div class="note-list">
        <div class="note"><div class="meta"><span>01</span><span>Build</span></div><h3>Make it real early</h3><p>I’d rather have a rough prototype I can test than a perfect idea sitting in a document.</p></div>
        <div class="note"><div class="meta"><span>02</span><span>Question</span></div><h3>Keep asking why</h3><p>I like finding the constraint underneath the obvious problem — what breaks, what scales, and what everyone assumed would just work.</p></div>
        <div class="note"><div class="meta"><span>03</span><span>Connect</span></div><h3>Move between disciplines</h3><p>Technical choices quickly become product, financial, operational, and human decisions. That overlap is usually the interesting part.</p></div>
      </div>
      <p class="quote">I’m happiest when I’m learning something new, building with other people, and turning a complicated idea into something useful.</p>
    `
  },
  {
    id: "projects",
    left: `
      <p class="eyebrow">03 · Selected projects</p>
      <h2>Four systems.<br>Different constraints.</h2>
      <p>Select a project to preview its purpose, then explore the underlying engineering.</p>
      <div class="project-list">
        <div class="project" data-project="quadmates">
          <div class="meta"><span>Quadmates</span><span>Product prototype</span></div>
          <h3>Campus coordination</h3>
          <p>A platform that helps students find study partners and coordinate sessions.</p>
          <div class="project-links">
            <a href="https://quadmates.ca" target="_blank" rel="noreferrer" data-stop-project>Live ↗</a>
            <a href="projects/quadmates.html" data-stop-project>Case study ↗</a>
          </div>
        </div>
        <div class="project" data-project="transit">
          <div class="meta"><span>TransitOps</span><span>Simulation prototype</span></div>
          <h3>Adaptive transit operations</h3>
          <p>A simulation exploring how buses, stations, and traffic signals can respond to changing passenger demand.</p>
          <div class="project-links">
            <a href="https://transitops-phi.vercel.app" target="_blank" rel="noreferrer" data-stop-project>Live ↗</a>
            <a href="projects/transitops.html" data-stop-project>Case study ↗</a>
          </div>
        </div>
        <div class="project" data-project="staff">
          <div class="meta"><span>Staffflow</span><span>Internal product · Operations</span></div>
          <h3>A people-operations control centre</h3>
          <p>A workforce application built around Quadmates, including hiring, candidate assessments, onboarding, shifts and permissions.</p>
          <div class="project-links">
            <a href="https://staff-management-app-da8r.vercel.app/" target="_blank" rel="noreferrer" data-stop-project>Live ↗</a>
            <a href="projects/staffflow.html" data-stop-project>Case study ↗</a>
          </div>
        </div>
        <div class="project" data-project="neurosim">
          <div class="meta"><span>NeuroSim 2.0</span><span>Research experiment</span></div>
          <h3>Learning to control a landing</h3>
          <p>A custom Gymnasium environment with PPO training and separate policy evaluation.</p>
          <div class="project-links"><a href="projects/neurosim.html" data-stop-project>Case study ↗</a></div>
        </div>
      </div>
    `,
    right: `
      <p class="eyebrow">Supporting + earlier work</p>
      <h2>The wider notebook.</h2>
      <p>Explore the engineering details behind each project: implementation, evidence, constraints, and what comes next.</p>
      <div class="note-list">
        <div class="note"><h3><a href="projects/transitops-m.html">TransitOps-M ↗</a></h3><p>Fleet state transitions, depot interlocks, and a conceptual HO-scale layout.</p></div>
        <div class="note"><h3><a href="projects/vision.html">Person detection ↗</a></h3><p>An earlier OpenCV and Tkinter experiment in camera capture and bounded processing.</p></div>

      </div>
      <div class="cover-actions"><a href="engineering.html">All case studies →</a><a href="projects/transitops.html#replay">Play a simulation →</a></div>
    `
  },
  {
    id: "work",
    left: `
      <p class="eyebrow">04 · Work + experience</p>
      <h2>Different roles, same curiosity.</h2>
      <div class="work-list">
        <div class="work-item"><div class="meta"><span>Infosys InStep · Bengaluru, India</span><span>Incoming · Winter 2027</span></div><h3>Computer Engineer (Software)</h3><p>Incoming co-op placement · January–April 2027.</p></div>
        <div class="work-item"><div class="meta"><span>UW Orbital</span><span>Business + Finance</span></div><h3>Student satellite design team</h3><p>Support expense tracking, financial-data organization, and external outreach for a multidisciplinary satellite team.</p></div>
        <div class="work-item"><div class="meta"><span>City of Ottawa</span><span>Aquatics</span></div><h3>Lifeguard + swim instructor</h3><p>A very different kind of systems job: communicate clearly, make decisions quickly, manage risk, and stay calm when the situation changes.</p></div>
      </div>
    `,
    right: `
      <p class="eyebrow">Next chapter · Winter 2027</p>
      <h2>Incoming at Infosys InStep.</h2>
      <p class="lead">Computer Engineer (Software) · Bengaluru, India</p>
      <p>Incoming co-op placement · January–April 2027.</p>
      <p class="eyebrow">What transfers</p>
      <h3>Operations matter.</h3>
      <p class="lead">A good technical solution still has to work with budgets, operations, deadlines, teams, and real people.</p>
      <p>Working on student projects and financial operations has taught me to value clear communication and careful execution alongside technical ideas.</p>
      <p class="hand">Still learning. Preferably by building.</p>
    `
  },
  {
    id: "notes",
    left: `
      <p class="eyebrow">05 · Open notebook</p>
      <h2>Things I can’t stop thinking about.</h2>
      <div class="note-list">
        <div class="note"><div class="meta"><span>Autonomy</span><span>01</span></div><p>How should autonomous systems reason when the environment stops matching the training distribution?</p></div>
        <div class="note"><div class="meta"><span>Transit</span><span>02</span></div><p>What if intersections and stations could negotiate service dynamically instead of following a static plan?</p></div>
        <div class="note"><div class="meta"><span>Products</span><span>03</span></div><p>Why do some coordination tools become habits while technically better ones get abandoned?</p></div>
      </div>
    `,
    right: `
      <p class="eyebrow">Marginalia</p>
      <h2>A portfolio should show unfinished thinking too.</h2>
      <p class="lead">Most of my interests start as a rabbit hole: autonomy, transportation, national security, history, space, robotics, or some system that seems more complicated the longer you look at it.</p>
      <p>This page is for the questions, sketches, and half-formed ideas that sit in the background before they become something more concrete.</p>
      <p class="hand">Some rabbit holes become repos.</p>
    `
  },
  {
    id: "contact",
    left: `
      <p class="eyebrow">06 · Contact</p>
      <h2>Let's connect.</h2>
      <p class="lead">I’m interested in software, AI, robotics, economics, finance, product, and infrastructure — especially where those areas overlap.</p>
      <p>If you’re recruiting, building something ambitious, collaborating on a project, or just have a question worth chasing, feel free to reach out.</p>
    `,
    right: `
      <p class="eyebrow">Find me</p>
      <div class="links">
        <a href="https://github.com/Tophacks" target="_blank" rel="noreferrer"><span>GitHub</span><span>↗</span></a>
        <a href="mailto:n2powell@uwaterloo.ca"><span>n2powell@uwaterloo.ca</span><span>↗</span></a>
      </div>
      <p class="hand">Let’s build something useful.</p>
    `
  }
];

const projects = {
  quadmates: {
    title: "Quadmates",
    copy: "A platform helping students find study partners and make plans to study together.",
    terminal: "matching people → coordinating plans",
    live: "https://quadmates.ca",
    repo: ""
  },
  transit: {
    title: "TransitOps",
    copy: "A transit-operations simulation exploring dispatch and coordination among buses, stations, and signals.",
    terminal: "demand → negotiate → dispatch → adapt",
    live: "https://transitops-phi.vercel.app",
    repo: "https://github.com/Tophacks/TransitOps"
  },
  staff: {
    title: "Staffflow",
    copy: "A staff-management application with role-specific workflows and access controls.",
    terminal: "staff → schedule → coordinate → operate",
    live: "https://staff-management-app-da8r.vercel.app/",
    repo: "",
    caseStudy: "projects/staffflow.html"
  },
  vision: {
    title: "Vision Lab",
    copy: "Computer-vision experiments for detecting people in camera footage.",
    terminal: "capture → bounded queue → HOG + SVM",
    live: "",
    repo: "https://github.com/Tophacks/Real-Time-Person-Detection"
  }
};

projects.miniature = {
  title: "TransitOps-M",
  copy: "A hardware-independent fleet model with depot reservations, docking confirmation, interlocks, and conceptual CAD.",
  terminal: "reserve → confirm → release",
  live: "", repo: "https://github.com/Tophacks/TransitOps-M"
};
projects.neurosim = {
  title: "NeuroSim 2.0",
  copy: "An experimental landing environment with PPO training and outcome-based evaluation tooling. Implementation gaps remain.",
  terminal: "environment → policy → evaluate",
  live: "", repo: "https://github.com/Tophacks/NeuroSim-2.0"
};
const appEntries = [
  { key: "miniature", label: "TransitOps-M", keywords: "depot miniature fleet cad state machine" },
  { key: "neurosim", label: "NeuroSim 2.0", keywords: "rocket reinforcement learning ppo control" },
  { key: "staff", label: "Staffflow", keywords: "hiring people operations workforce scheduling candidate assessments" },
  { key: "quadmates", label: "Quadmates", keywords: "study campus matching students" },
  { key: "transit", label: "TransitOps", keywords: "transit bus simulation operations" },
  { key: "staff", label: "Staff Management", keywords: "staff workforce management operations" },
  { key: "vision", label: "Vision Lab", keywords: "ai computer vision autonomy" }
];

document.querySelectorAll("[data-select]").forEach(button => {
  button.addEventListener("click", () => showProject(button.dataset.select));
});
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
  leftPage.innerHTML = section.left;
  rightPage.innerHTML = section.right;
  attachProjects();

  current = index;
  pageNumber.textContent = `${String(index + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;
  prev.disabled = index === 0;
  next.disabled = index === sections.length - 1;
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.section === section.id));
  tabs.forEach(tab => tab.setAttribute("aria-current", tab.dataset.section === section.id ? "page" : "false"));
  history.replaceState(null, "", `#${section.id}`);
}

function attachProjects() {
  document.querySelectorAll("[data-section-jump]").forEach(button => {
    button.addEventListener("click", () => {
      const index = sections.findIndex(section => section.id === button.dataset.sectionJump);
      if (index >= 0) render(index);
    });
  });
  document.querySelectorAll("[data-project]").forEach(el => {
    el.tabIndex = 0;
    el.setAttribute("role", "group");
    el.setAttribute("aria-label", `Select ${projects[el.dataset.project]?.title || "project"}`);
    el.addEventListener("keydown", event => {
      if (event.target === el && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault(); showProject(el.dataset.project);
      }
    });
    el.addEventListener("click", event => {
      if (event.target.closest("[data-stop-project]")) return;
      showProject(el.dataset.project);
      if (window.innerWidth <= 820) {
        document.querySelector(".laptop")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}

function showProject(key) {
  const project = projects[key];
  if (!project) return;
  currentProjectKey = key;
  const casePaths = {quadmates:"quadmates", transit:"transitops", miniature:"transitops-m", neurosim:"neurosim", vision:"vision", staff:"staffflow"};
  const caseLink = document.getElementById("caseStudyLink");
  caseLink.hidden = !casePaths[key];
  if (casePaths[key]) caseLink.href = `projects/${casePaths[key]}.html`;
  document.querySelectorAll("[data-select]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.select === key)));
  document.getElementById("deviceTitle").textContent = project.title;
  document.getElementById("deviceCopy").textContent = project.copy;
  const liveLink = document.getElementById("liveAppLink");
  const repoLink = document.getElementById("repoLink");
  if (project.live) {
    liveLink.href = project.live;
    liveLink.style.display = "inline-flex";
  } else {
    liveLink.style.display = "none";
  }
  if (project.repo) { repoLink.href = project.repo; repoLink.style.display = "inline-flex"; } else { repoLink.removeAttribute("href"); repoLink.style.display = "none"; }
  typeText(project.terminal);
}

let typingTimer;
function typeText(text) {
  clearInterval(typingTimer);
  const target = document.getElementById("typedText");
  target.textContent = "";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { target.textContent = text; return; }
  let i = 0;
  typingTimer = setInterval(() => {
    target.textContent += text[i] || "";
    i++;
    if (i >= text.length) clearInterval(typingTimer);
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
  if (e.target.closest("input, textarea, select, [contenteditable]")) return;
  if (e.key === "ArrowRight" && current < sections.length - 1) render(current + 1);
  if (e.key === "ArrowLeft" && current > 0) render(current - 1);
});


document.getElementById("year").textContent = new Date().getFullYear();

const hash = location.hash.replace("#", "");
const initial = sections.findIndex(s => s.id === hash);
render(initial >= 0 ? initial : 0, false);
showProject("quadmates");

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
