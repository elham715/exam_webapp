// Enhanced Landing page functionality with better email validation
const emailInput = document.getElementById("emailInput");
const emailError = document.getElementById("emailError");
const startBtn = document.getElementById("startBtn");

// Get exam name from the current page filename
const examName = window.location.pathname.split('/').pop().replace('.html', '');

// Enhanced email validation
function validateEmail(email) {
    // Basic format check
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
        return { valid: false, message: "⚠️ Please enter a valid email format" };
    }
    
    // Check for common issues
    if (email.length > 254) {
        return { valid: false, message: "⚠️ Email address is too long" };
    }
    
    if (email.includes('..')) {
        return { valid: false, message: "⚠️ Email cannot contain consecutive dots" };
    }
    
    // Block obvious fake emails
    const fakeDomains = ['test.com', 'example.com', 'fake.com', 'invalid.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (fakeDomains.includes(domain)) {
        return { valid: false, message: "⚠️ Please use a real email address" };
    }
    
    // Check for minimum domain length
    if (domain && domain.length < 4) {
        return { valid: false, message: "⚠️ Domain name seems too short" };
    }
    
    return { valid: true, message: "" };
}

// Real-time email validation with better feedback
emailInput.addEventListener("input", function() {
    const email = this.value.trim();

    if (email === "") {
        startBtn.disabled = true;
        emailError.style.display = "none";
        this.style.borderColor = "#ddd";
        return;
    }

    const validation = validateEmail(email);
    
    if (validation.valid) {
        startBtn.disabled = false;
        emailError.style.display = "none";
        this.style.borderColor = "#27ae60";
        // Save email for exam page
        localStorage.setItem("examUserEmail", email);
    } else {
        startBtn.disabled = true;
        emailError.style.display = "block";
        emailError.textContent = validation.message;
        this.style.borderColor = "#e74c3c";
    }
});

// Handle start exam button with confirmation
startBtn.addEventListener("click", function() {
    const email = emailInput.value.trim();
    const validation = validateEmail(email);

    if (validation.valid) {
        localStorage.setItem("examUserEmail", email);
        // Add loading state
        this.innerHTML = "🚀 Starting exam...";
        this.disabled = true;
        
        // Small delay for better UX
        setTimeout(() => {
            window.location.href = examName + "-exam.html";
        }, 500);
    }
});

// Check if email is already saved and validate it
window.addEventListener("DOMContentLoaded", function() {
    const savedEmail = localStorage.getItem("examUserEmail");
    if (savedEmail) {
        emailInput.value = savedEmail;
        const validation = validateEmail(savedEmail);
        if (validation.valid) {
            startBtn.disabled = false;
            emailInput.style.borderColor = "#27ae60";
        }
    }
});

// Add Enter key support
emailInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter" && !startBtn.disabled) {
        startBtn.click();
    }
});