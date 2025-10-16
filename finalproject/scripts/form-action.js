import { formatDate, safeJsonParse } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const submissions = safeJsonParse(localStorage.getItem('tool-suggestions'));
    const formDataContainer = document.getElementById('form-data-container');
    const recentSubmissionsList = document.getElementById('recent-submissions-list');

    // Show the most recent submission details
    if (submissions.length > 0) {
        const latestSubmission = submissions[submissions.length - 1];

        formDataContainer.innerHTML = `
            <div class="card">
                <h3>${latestSubmission.name}</h3>
                <div class="tool-details">
                    <p><strong>Programming Language:</strong> ${latestSubmission.language}</p>
                    <p><strong>Category:</strong> ${latestSubmission.category}</p>
                    <p><strong>Difficulty Level:</strong> ${latestSubmission.difficulty}</p>
                    <p><strong>License:</strong> ${latestSubmission.license}</p>
                    <p><strong>Official Website:</strong> <a href="${latestSubmission.url}" target="_blank" rel="noopener">${latestSubmission.url}</a></p>
                    <p><strong>Description:</strong> ${latestSubmission.description}</p>
                    ${latestSubmission.additionalInfo ? `<p><strong>Additional Information:</strong> ${latestSubmission.additionalInfo}</p>` : ''}
                    <p><strong>Submitted:</strong> ${formatDate(latestSubmission.submittedAt)}</p>
                </div>
            </div>
        `;
    } else {
        formDataContainer.innerHTML = '<p>No submission data found.</p>';
    }

    if (submissions.length === 0) {
        recentSubmissionsList.innerHTML = '<p>No recent submissions found.</p>';
        return;
    }

    // Show last 5 submissions in the recent submissions section
    const recentSubmissions = submissions.slice(-5).reverse();
    let html = '';

    for (let i = 0; i < recentSubmissions.length; i++) {
        const submission = recentSubmissions[i];
        html += `
            <div class="submission-item">
                <h4>${submission.name}</h4>
                <p><strong>Category:</strong> ${submission.category} | <strong>Language:</strong> ${submission.language}</p>
                <p class="submission-date">Submitted: ${formatDate(submission.submittedAt)}</p>
            </div>
        `;
    }

    recentSubmissionsList.innerHTML = html;
});
