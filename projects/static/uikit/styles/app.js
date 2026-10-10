const tabs = document.querySelectorAll(".tab");
const dishes = document.querySelectorAll(".dish");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const filter = tab.dataset.filter;

    dishes.forEach((dish) => {
      if (filter === "all" || dish.dataset.cat === filter) {
        dish.style.display = "flex";
      } else {
        dish.style.display = "none";
      }
    });
  });
});

function openModal() {
  document.getElementById("modal").classList.add("open");
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
}

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") {
    closeModal();
  }
});
