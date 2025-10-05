document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);

    displayApplicationDetails(urlParams);
});

function displayApplicationDetails(params) {
    const detailsContainer = document.getElementById("application-details");

    if (!detailsContainer) return;

    // Get data from URL parameters
    const firstName = params.get("firstName") || "Not provided";
    const lastName = params.get("lastName") || "Not provided";
    const email = params.get("email") || "Not provided";
    const phone = params.get("phone") || "Not provided";
    const businessName = params.get("businessName") || "Not provided";
    const timestamp = params.get("timestamp") || new Date().toISOString();

    // Format timestamp
    const applicationDate = new Date(timestamp);
    const formattedDate = applicationDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    // HTML structure
    detailsContainer.innerHTML = `
        <div class="detail-item">
            <strong>Name:</strong> ${firstName} ${lastName}
        </div>
        <div class="detail-item">
            <strong>Email:</strong> ${email}
        </div>
        <div class="detail-item">
            <strong>Phone:</strong> ${phone}
        </div>
        <div class="detail-item">
            <strong>Business Name:</strong> ${businessName}
        </div>
        <div class="detail-item">
            <strong>Application Date:</strong> ${formattedDate}
        </div>
    `;
}
