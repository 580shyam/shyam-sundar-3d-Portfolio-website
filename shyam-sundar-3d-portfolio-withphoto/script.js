const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "✕" : "☰";
});
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "☰";
}));

// Interactive 3D cube: drag with a mouse or finger to rotate it.
const scene = document.querySelector("#scene");
const cube = document.querySelector("#cube");
let rotationX = -22, rotationY = -32, dragging = false, lastX = 0, lastY = 0;
function applyRotation() {
  cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}
scene.addEventListener("pointerdown", event => {
  dragging = true; lastX = event.clientX; lastY = event.clientY;
  scene.setPointerCapture(event.pointerId);
});
scene.addEventListener("pointermove", event => {
  if (!dragging) return;
  const dx = event.clientX - lastX, dy = event.clientY - lastY;
  rotationY += dx * 0.7; rotationX -= dy * 0.7;
  lastX = event.clientX; lastY = event.clientY;
  applyRotation();
});
scene.addEventListener("pointerup", () => dragging = false);
scene.addEventListener("pointercancel", () => dragging = false);

// Subtle 3D tilt on cards for pointer devices.
document.querySelectorAll("[data-tilt]").forEach(card => {
  card.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

// Highlight the current section in the navigation.
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
