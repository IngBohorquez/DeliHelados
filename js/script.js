document.addEventListener("DOMContentLoaded", () => {
  const topButton = document.querySelector(".back-to-top");
  const year = document.querySelector("[data-current-year]");

  if (year) year.textContent = new Date().getFullYear();

  const updateTopButton = () => {
    if (topButton) topButton.classList.toggle("is-visible", window.scrollY > 320);
  };
  updateTopButton();
  window.addEventListener("scroll", updateTopButton, { passive: true });

  if (topButton) {
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const grid = document.querySelector("#productGrid");
  if (grid) {
    const cards = [...grid.querySelectorAll(".product-item")];
    const filterButtons = [...document.querySelectorAll("[data-filter]")];
    const searchInput = document.querySelector("#productSearch");
    const resultsLabel = document.querySelector("#resultsLabel");
    const emptyState = document.querySelector("#emptyProducts");
    let activeFilter = "todos";

    const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const applyFilters = () => {
      const query = normalize(searchInput ? searchInput.value.trim() : "");
      let visible = 0;
      cards.forEach((card) => {
        const matchesCategory = activeFilter === "todos" || card.dataset.category === activeFilter;
        const matchesSearch = normalize(`${card.dataset.name} ${card.textContent}`).includes(query);
        const show = matchesCategory && matchesSearch;
        card.classList.toggle("d-none", !show);
        if (show) visible += 1;
      });
      if (resultsLabel) resultsLabel.textContent = `${visible} ${visible === 1 ? "producto encontrado" : "productos encontrados"}`;
      if (emptyState) emptyState.classList.toggle("d-none", visible !== 0);
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        applyFilters();
      });
    });
    if (searchInput) searchInput.addEventListener("input", applyFilters);

    const categoryParam = new URLSearchParams(window.location.search).get("categoria");
    if (categoryParam && ["helados", "paletas", "turrones"].includes(categoryParam)) {
      const categoryButton = filterButtons.find((button) => button.dataset.filter === categoryParam);
      if (categoryButton) categoryButton.click();
    } else {
      applyFilters();
    }
  }

  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const feedback = document.querySelector("#formFeedback");
      if (feedback) {
        feedback.textContent = "Mensaje enviado con éxito.";
        feedback.classList.add("text-success");
      }
    });
  }
});
