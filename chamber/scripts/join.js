import { membershipLevels } from "../data/membership-levels.js";

const colorError = "#dc3545"; // red
const colorValid = "#28a745"; // green

document.addEventListener("DOMContentLoaded", function () {
    const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    /* Membership Level Options */
    const membershipLevelSelect = document.getElementById("membershipLevel");
    if (membershipLevelSelect) {
        membershipLevels.forEach((level) => {
            const option = document.createElement("option");
            option.value = level.level;
            option.textContent = level.label;
            membershipLevelSelect.appendChild(option);
        });
    }

    /* Membership Level Cards */
    const membershipSelect = document.getElementById("levelCards");
    if (membershipSelect) {
        membershipLevels.forEach((level) => {
            const card = document.createElement("div");
            card.className = "level-card";
            card.setAttribute("data-level", level.level);
            card.innerHTML = `
                <h3>${level.title}</h3>
                <p class="price">${level.price}</p>
                <p>${level.description}</p>
                <a href="#" class="benefits-link" data-modalId="${level.modalId}">View Benefits</a>
            `;

            membershipSelect.appendChild(card);
        });
    }

    /* Membership Level Modals */
    const dialogsContainer = document.getElementById("dialogsContainer");
    if (dialogsContainer) {
        membershipLevels.forEach((level) => {
            const dialog = document.createElement("dialog");
            dialog.id = `${level.level}-modal`;
            dialog.innerHTML = `
                <h3>${level.title} Benefits</h3>
                <ul>
                    ${level.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
                </ul>
                <button class="close-modal" data-modalId="${level.level}-modal">❌</button>
            `;
            dialogsContainer.appendChild(dialog);
        });
    }

    /* Modal functionality */
    const benefitLinks = document.querySelectorAll(".benefits-link");
    const closeButtons = document.querySelectorAll(".close-modal");
    const modals = document.querySelectorAll("dialog");

    // Open modals
    benefitLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const modalId = this.getAttribute("data-modalId");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    // Close modals
    closeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const modalId = this.getAttribute("data-modalId");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.close();
            }
        });
    });

    // Close modal when clicking outside
    modals.forEach((modal) => {
        modal.addEventListener("click", function (e) {
            if (e.target === this) {
                this.close();
            }
        });
    });

    /* Form Validation */
    const form = document.querySelector(".membership-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            // Basic validation
            const requiredFields = form.querySelectorAll("[required]");
            let isValid = true;

            requiredFields.forEach((field) => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = colorError;
                } else {
                    field.style.borderColor = colorValid;
                }
            });

            // Validate organizational title pattern
            const titleField = document.getElementById("title");
            if (titleField && titleField.value) {
                const pattern = /^[a-zA-Z\s\-]{7,}$/;
                if (!pattern.test(titleField.value)) {
                    isValid = false;
                    titleField.style.borderColor = "#dc3545";
                    alert(
                        "Organizational title must be at least 7 characters and contain only letters, spaces, and hyphens."
                    );
                }
            }

            if (!isValid) {
                e.preventDefault();
                alert("Please fill in all required fields correctly.");
            }
        });
    }

    // Real-time validation for required fields and email format
    const inputs = document.querySelectorAll("input, select, textarea");

    inputs.forEach(function (input) {
        input.addEventListener("blur", function () {
            const value = input.value.trim();
            const isRequired = input.hasAttribute("required");
            const isEmail = input.type === "email";



            if (isRequired && value === "") {
                input.style.borderColor = colorError;
            } else if (isEmail && value !== "") {
                const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (emailPattern.test(value)) {
                    input.style.borderColor = colorValid;
                } else {
                    input.style.borderColor = colorError;
                }
            } else if (value !== "") {
                input.style.borderColor = colorValid;
            } else {
                input.style.borderColor = ""; // reset if not required
            }
        });
    });

});
