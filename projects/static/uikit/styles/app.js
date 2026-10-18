
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

    const cards = [...document.querySelectorAll(".booking-table")];
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

    const selectedTables = new Set();

    const today = new Date();
    const localDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (dateInput) {
        dateInput.min = localDate;
    }

    function updateBooking() {
        const selected = cards.filter((card) =>
            selectedTables.has(card.dataset.id)
        );

        // Передаём все ID через запятую
        tableInput.value = selected
            .map((card) => card.dataset.id)
            .join(",");

        const numbers = selected.map(
            (card) => card.dataset.number
        );

        const totalSeats = selected.reduce(
            (sum, card) => sum + Number(card.dataset.seats || 0),
            0
        );

        cards.forEach((card) => {
            const isSelected = selectedTables.has(card.dataset.id);
            card.classList.toggle("selected", isSelected);
            card.classList.toggle("active", isSelected);
            card.setAttribute("aria-pressed", String(isSelected));
        });

        if (hint) {
            hint.textContent = selected.length
                ? `Выбрано столиков: ${selected.length}`
                : "Нажми на столик, чтобы выбрать его";
        }

        if (summaryTitle) {
            summaryTitle.textContent = selected.length
                ? `Выбрано столиков: ${selected.length}`
                : "Твои столики ждут выбора";
        }

        const parts = [];

        if (numbers.length) {
            parts.push(`№ ${numbers.join(", ")}`);
            parts.push(`${totalSeats} мест всего`);
        }

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
                : "Выбери места слева";
        }

        if (guestsInput) {
            if (selected.length) {
                guestsInput.max = totalSeats;

                if (Number(guestsInput.value) > totalSeats) {
                    guestsInput.value = totalSeats;
                }
            } else {
                guestsInput.removeAttribute("max");
            }
        }
    }

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;

            if (!id) {
                console.error("У столика отсутствует data-id:", card);
                return;
            }

            if (selectedTables.has(id)) {
                selectedTables.delete(id);
            } else {
                selectedTables.add(id);
            }

            if (error) {
                error.textContent = "";
            }

            updateBooking();

            console.log(
                "Выбранные ID столиков:",
                tableInput.value
            );
        });
    });

    [dateInput, timeInput, guestsInput].forEach((input) => {
        input?.addEventListener("input", updateBooking);
        input?.addEventListener("change", updateBooking);
    });

    form.addEventListener("submit", (event) => {
        if (error) {
            error.textContent = "";
        }

        const selected = cards.filter((card) =>
            selectedTables.has(card.dataset.id)
        );

        if (!selected.length) {
            event.preventDefault();
            if (error) error.textContent = "Сначала выбери столик.";
            hint?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (
            !timeInput?.value ||
            timeInput.value < "07:00" ||
            timeInput.value > "21:00"
        ) {
            event.preventDefault();
            if (error) {
                error.textContent =
                    "Ресторан принимает бронирования с 07:00 до 21:00.";
            }
            return;
        }

        const guests = Number(guestsInput?.value || 0);
        const totalSeats = selected.reduce(
            (sum, card) => sum + Number(card.dataset.seats || 0),
            0
        );

        if (
            !Number.isInteger(guests) ||
            guests < 1 ||
            guests > totalSeats
        ) {
            event.preventDefault();
            if (error) {
                error.textContent =
                    `У выбранных столиков от 1 до ${totalSeats} мест.`;
            }
            return;
        }

        if (!dateInput?.value || !timeInput?.value) {
            event.preventDefault();
            if (error) {
                error.textContent =
                    "Выбери дату и время бронирования.";
            }
            return;
        }

        if (dateInput.value < localDate) {
            event.preventDefault();
            if (error) {
                error.textContent =
                    "Выбери сегодняшнюю или будущую дату.";
            }
        }
    });

    updateBooking();
});
