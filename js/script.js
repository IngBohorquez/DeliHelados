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

  const detailName = document.querySelector("#detailName");
  if (detailName) {
    const products = {
      fresa: {
        name: "Helado de Fresa Silvestre", category: "Helados", flavor: "Con trozos de fresa natural",
        price: "$12.500", image: "../assets/images/helado_fresas.png", alt: "Helado de fresa con fresas",
        description: "Helado de fresa con una textura cremosa, suave y agradable, acompañado de un sabor frutal refrescante. Consulta con el negocio las presentaciones disponibles."
      },
      mango: {
        name: "Paleta de Mango y Kiwi", category: "Paletas", flavor: "Mezcla frutal tropical",
        price: "$6.000", image: "../assets/images/paleta_mangokiwi.png", alt: "Paleta de mango y kiwi",
        description: "Una paleta de inspiración tropical que combina sabores frutales y una sensación refrescante. Consulta disponibilidad y presentación por WhatsApp."
      },
      chocolate: {
        name: "Helado de Chocolate", category: "Helados", flavor: "Intenso sabor a cacao",
        price: "$15.000", image: "../assets/images/helado_chocolate.png", alt: "Helado de chocolate",
        description: "Una opción cremosa para quienes disfrutan el sabor profundo del chocolate. Confirma con DeliHelados el tamaño y la presentación disponibles."
      },
      mora: {
        name: "Paleta de Yogur y Moras", category: "Paletas", flavor: "Suave combinación frutal",
        price: "$9.000", image: "../assets/images/paleta_morayogurt.png", alt: "Paleta de yogur y moras",
        description: "Una combinación frutal de aspecto suave y refrescante. Consulta directamente por disponibilidad y presentaciones."
      },
      turron: {
        name: "Turrón Crocante de Almendras", category: "Turrones", flavor: "Textura crocante",
        price: "$11.000", image: "../assets/images/turron_almendras.png", alt: "Ilustración de turrón",
        description: "Una alternativa dulce con una textura crocante. La fotografía y los datos finales deben actualizarse con el producto real del negocio."
      },
      vainilla: {
        name: "Helado de Vainilla", category: "Helados", flavor: "Clásico suave y cremoso",
        price: "$9.000", image: "../assets/images/helado_vainilla.png", alt: "Ilustración de helado de vainilla",
        description: "Un sabor clásico, suave y versátil para disfrutar en distintos momentos. Consulta las presentaciones disponibles."
      },
      coco: {
        name: "Paleta de Coco", category: "Paletas", flavor: "Cremosa y refrescante",
        price: "$7.500", image: "../assets/images/paleta_coco.png", alt: "Ilustración de paleta de coco",
        description: "Una opción refrescante con sabor a coco. Confirma disponibilidad y presentación directamente con DeliHelados."
      },
      pistacho: {
        name: "Helado de Pistacho", category: "Helados", flavor: "Notas suaves de frutos secos",
        price: "$18.000", image: "../assets/images/helado_pistacho.png", alt: "Ilustración de helado de pistacho",
        description: "Un sabor de perfil delicado para quienes buscan probar algo diferente. Consulta ingredientes y disponibilidad con el negocio."
      }
    };
    const params = new URLSearchParams(window.location.search);
    const key = params.get("product") || "fresa";
    const product = products[key] || products.fresa;
    const photo = document.querySelector("#detailPhoto");
    const imageBox = document.querySelector("#detailImage");
    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };
    setText("detailName", product.name);
    setText("detailCategory", product.category.toUpperCase());
    setText("detailFlavor", product.flavor);
    setText("detailPrice", product.price);
    setText("detailDescription", product.description);
    if (photo) {
      if (product.image) {
        photo.src = product.image;
        photo.alt = product.alt;
        photo.hidden = false;
        if (imageBox) imageBox.className = "detail-image";
      } else {
        photo.hidden = true;
        if (imageBox) {
          imageBox.className = `detail-image ${product.visualClass}`;
          imageBox.innerHTML = `<div class="detail-art" aria-label="${product.alt}"><i class="bi bi-stars" aria-hidden="true"></i></div>`;
        }
      }
    }
    const whatsapp = document.querySelector("#detailWhatsApp");
    if (whatsapp) {
      const message = encodeURIComponent(`Hola, DeliHelados. Quisiera consultar por ${product.name} (${product.price}). ¿Me comparten disponibilidad y presentaciones?`);
      whatsapp.href = `https://wa.me/573243122025?text=${message}`;
    }
    document.title = `${product.name} | DeliHelados`;
  }

  const weatherTemperature = document.getElementById("weatherTemperature");

  if (weatherTemperature) {
    const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=8.94944&longitude=-75.44778&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=America%2FBogota";

    const weatherIcon = document.getElementById("weatherIcon");
    const weatherCondition = document.getElementById("weatherCondition");
    const weatherTitle = document.getElementById("weatherTitle");
    const weatherMessage = document.getElementById("weatherMessage");
    const weatherUpdated = document.getElementById("weatherUpdated");

    function getWeatherDescription(code) {

      if (code === 0) return {
        description: "Cielo despejado",
        icon: "bi-sun-fill"
      };

      if ([1, 2].includes(code)) return {
        description: "Parcialmente nublado",
        icon: "bi-cloud-sun-fill"
      };

      if (code === 3) return {
        description: "Cielo nublado",
        icon: "bi-clouds-fill"
      };

      if ([45, 48].includes(code)) return {
        description: "Neblina",
        icon: "bi-cloud-fog-fill"
      };

      if ([51, 53, 55, 56, 57].includes(code)) return {
        description: "Llovizna",
        icon: "bi-cloud-drizzle-fill"
      };

      if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return {
        description: "Lluvia",
        icon: "bi-cloud-rain-heavy-fill"
      };

      if ([71, 73, 75, 77, 85, 86].includes(code)) return {
        description: "Nieve",
        icon: "bi-cloud-snow-fill"
      };

      if ([95, 96, 99].includes(code)) return {
        description: "Tormenta eléctrica",
        icon: "bi-cloud-lightning-rain-fill"
      };

      return {
        description: "Condiciones variables",
        icon: "bi-cloud-fill"
      };
    }

    function getWeatherMessage(temperature) {

      if (temperature >= 32) {
        return {
          title: "¡Uff, qué calor hace!",
          message: "El calor está con toda en Sahagún. ¡Ven por tu helado favorito y date un gustico refrescante con DeliHelados!"
        };
      }

      if (temperature >= 28) {
        return {
          title: "Un dia soleado",
          message: "¿Qué tal una paleta bien deliciosa para disfrutar el día?"
        };
      }

      if (temperature >= 20) {
        return {
          title: "El clima es agradable",
          message: "Disfruta de nuestros deliciosos turrones"
        };
      }

    }

    async function loadWeather() {

      try {
        weatherCondition.textContent = "Actualizando información...";

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Error al consultar Open-Meteo");
        }

        const data = await response.json();
        const current = data.current;
        const temperature = current.temperature_2m;
        const apparentTemperature = current.apparent_temperature;
        const weatherCode = current.weather_code;
        const weather = getWeatherDescription(weatherCode);
        const recommendation = getWeatherMessage(temperature);

        weatherTemperature.textContent = `${Math.round(temperature)}°`;

        weatherIcon.className = `bi ${weather.icon}`;

        weatherCondition.textContent = `${weather.description} · Sensación térmica: ${Math.round(apparentTemperature)} °C`;

        weatherTitle.textContent = recommendation.title;
        weatherMessage.textContent = recommendation.message;

        const updateTime = new Date(current.time);

        weatherUpdated.textContent =
          `Actualizado a las ${updateTime.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          })}`;

      } catch (error) {

        console.error("Error al consultar el clima:", error);

        weatherTemperature.textContent = "--°";
        weatherCondition.textContent = "Clima temporalmente no disponible";

        weatherTitle.textContent = "¡Siempre es buen momento para un postre!";

        weatherMessage.textContent = "No pudimos consultar la temperatura en este momento.";

        weatherUpdated.textContent = "Intenta nuevamente más tarde.";
      }
    }

    loadWeather();
    setInterval(loadWeather, 30 * 60 * 1000);
  }
});
