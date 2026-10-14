document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".tab");
    const dishes = document.querySelectorAll(".dish");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((item) => item.classList.remove("active"));
            tab.classList.add("active");

            const filter = tab.dataset.filter;

            dishes.forEach((dish) => {
                dish.style.display =
                    filter === "all" || dish.dataset.cat === filter
                        ? "flex"
                        : "none";
            });
        });
    });

    const modal = document.getElementById("modal");

    window.openModal = function () {
        modal?.classList.add("open");
    };

    window.closeModal = function () {
        modal?.classList.remove("open");
    };

    modal?.addEventListener("click", (event) => {
        if (event.target === modal) {
            window.closeModal();
        }
    });

    const cards = document.querySelectorAll(".booking-table");
    const tableInput = document.getElementById("bookingTableId");
    const guestsInput = document.getElementById("bookingGuests");
    const dateInput = document.getElementById("bookingDate");
    const timeInput = document.getElementById("bookingTime");
    const form = document.getElementById("quickBooking");
    const hint = document.getElementById("bookingHint");
    const summaryTitle = document.getElementById("bookingSummaryTitle");
    const summaryText = document.getElementById("bookingSummaryText");
    const error = document.getElementById("bookingError");

    if (!form || !tableInput) return;

    let selected = null;

    const today = new Date();
    const localDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (dateInput) {
        dateInput.min = localDate;
    }

    function updateSummary() {
        if (summaryTitle) {
            summaryTitle.textContent = selected
                ? `Столик №${selected.dataset.number} выбран`
                : "Твой столик ждёт выбора";
        }

        const parts = [];

        if (dateInput?.value) {
            parts.push(
                new Date(dateInput.value + "T12:00:00")
                    .toLocaleDateString("ru-RU")
            );
        }

        if (timeInput?.value) {
            parts.push(timeInput.value);
        }

        if (guestsInput?.value) {
            parts.push(`${guestsInput.value} гостей`);
        }

        if (summaryText) {
            summaryText.textContent = parts.length
                ? parts.join(" · ")
                : "Выбери место, дату и время";
        }
    }

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            selected = card;
            tableInput.value = card.dataset.id;

            cards.forEach((item) => {
                const active = item === card;
                item.classList.toggle("selected", active);
                item.setAttribute("aria-pressed", String(active));
            });

            const seats = Number(card.dataset.seats);

            if (guestsInput && seats > 0) {
                guestsInput.max = seats;

                if (Number(guestsInput.value) > seats) {
                    guestsInput.value = seats;
                }
            }

            if (hint) {
                hint.textContent =
                    `Выбран столик №${card.dataset.number} · ${seats} мест`;
            }

            updateSummary();
        });
    });

    [dateInput, timeInput, guestsInput].forEach((input) => {
        input?.addEventListener("input", updateSummary);
        input?.addEventListener("change", updateSummary);
    });

    form.addEventListener("submit", (event) => {
        if (error) error.textContent = "";

        if (!tableInput.value || !selected) {
            event.preventDefault();

            if (error) {
                error.textContent = "Сначала выбери столик.";
            }

            hint?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }

        const guests = Number(guestsInput?.value || 0);
        const seats = Number(selected.dataset.seats || 0);

        if (guests < 1 || guests > seats) {
            event.preventDefault();

            if (error) {
                error.textContent =
                    `За этим столиком помещается от 1 до ${seats} гостей.`;
            }

            return;
        }

        if (dateInput?.value && dateInput.value < localDate) {
            event.preventDefault();

            if (error) {
                error.textContent =
                    "Выбери сегодняшнюю или будущую дату.";
            }
        }
    });

    updateSummary();
});
