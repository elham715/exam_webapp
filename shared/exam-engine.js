// Exam engine functionality with MathJax, image support, and timer
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfisy5lKuRWsDepuGnqBvZBnHfi3e969zAA12YYRqfDTzIoIZ2w15wf8C5f30y-AFc/exec"; // Replace when ready

const examForm = document.getElementById("examForm");
const questionsContainer = document.getElementById("questionsContainer");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const submitBtn = document.getElementById("submitBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Timer variables
let examTimer = null;
let timeRemaining = 0; // Will be set from exam config
let timerDisplay = null;
let timerProgressBar = null;
let timerStatus = null;
let warningShown = false;
let autoSubmitWarning = null;

// Default timer settings (can be overridden in individual exam files)
let timerConfig = {
    enabled: false,
    totalMinutes: 30, // Default 30 minutes
    warningAtMinutes: 5, // Show warning when 5 minutes left
    criticalAtMinutes: 2, // Show critical warning when 2 minutes left
    autoSubmit: true // Auto submit when time runs out
};

// Initialize timer from global config if available
function initializeTimer() {
    if (window.TIMER_CONFIG) {
        timerConfig = { ...timerConfig, ...window.TIMER_CONFIG };
    }

    if (timerConfig.enabled) {
        timeRemaining = timerConfig.totalMinutes * 60; // Convert to seconds
        createTimerUI();
        startTimer();
    }
}

// Create timer UI elements
function createTimerUI() {
    const examHeader = document.querySelector('.exam-header');
    if (!examHeader) return;

    const timerHTML = `
        <div class="exam-timer">
            <div class="timer-header">
                <span class="timer-icon">⏱️</span>
                <h3 class="timer-title">Time Remaining</h3>
            </div>
            <div class="timer-display normal" id="timerDisplay">${formatTime(timeRemaining)}</div>
            <div class="timer-progress-container">
                <div class="timer-progress-bar" id="timerProgressBar"></div>
            </div>
            <div class="timer-status" id="timerStatus">You have plenty of time</div>
        </div>
    `;

    examHeader.insertAdjacentHTML('afterend', timerHTML);

    // Get references to timer elements
    timerDisplay = document.getElementById('timerDisplay');
    timerProgressBar = document.getElementById('timerProgressBar');
    timerStatus = document.getElementById('timerStatus');

    // Create auto-submit warning modal
    createAutoSubmitWarning();
}

// Create auto-submit warning modal
function createAutoSubmitWarning() {
    const warningHTML = `
        <div class="auto-submit-warning" id="autoSubmitWarning">
            <div class="warning-modal">
                <h3>⚠️ Time Almost Up!</h3>
                <p>Your exam will be automatically submitted in:</p>
                <div class="warning-countdown" id="warningCountdown">30</div>
                <p>You can submit now to save your current answers, or continue working.</p>
                <div class="warning-actions">
                    <button class="submit-now-btn" onclick="submitFromWarning()">Submit Now</button>
                    <button class="continue-btn" onclick="closeWarning()">Continue</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', warningHTML);
    autoSubmitWarning = document.getElementById('autoSubmitWarning');
}

// Start the timer
function startTimer() {
    examTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        updateTimerProgress();
        checkTimerWarnings();

        if (timeRemaining <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay() {
    if (!timerDisplay) return;

    timerDisplay.textContent = formatTime(timeRemaining);

    // Update timer color based on remaining time
    const totalSeconds = timerConfig.totalMinutes * 60;
    const warningSeconds = timerConfig.warningAtMinutes * 60;
    const criticalSeconds = timerConfig.criticalAtMinutes * 60;

    timerDisplay.className = 'timer-display';
    if (timeRemaining <= criticalSeconds) {
        timerDisplay.classList.add('critical');
    } else if (timeRemaining <= warningSeconds) {
        timerDisplay.classList.add('warning');
    } else {
        timerDisplay.classList.add('normal');
    }
}

// Update timer progress bar
function updateTimerProgress() {
    if (!timerProgressBar) return;

    const totalSeconds = timerConfig.totalMinutes * 60;
    const percentage = Math.max(0, (timeRemaining / totalSeconds) * 100);
    
    timerProgressBar.style.width = percentage + '%';

    // Update progress bar color
    const warningSeconds = timerConfig.warningAtMinutes * 60;
    const criticalSeconds = timerConfig.criticalAtMinutes * 60;

    timerProgressBar.className = 'timer-progress-bar';
    if (timeRemaining <= criticalSeconds) {
        timerProgressBar.classList.add('critical');
    } else if (timeRemaining <= warningSeconds) {
        timerProgressBar.classList.add('warning');
    }
}

// Check for timer warnings
function checkTimerWarnings() {
    if (!timerStatus) return;

    const warningSeconds = timerConfig.warningAtMinutes * 60;
    const criticalSeconds = timerConfig.criticalAtMinutes * 60;

    timerStatus.className = 'timer-status';

    if (timeRemaining <= 30 && !warningShown && timerConfig.autoSubmit) {
        // Show 30-second warning
        showAutoSubmitWarning();
        warningShown = true;
    } else if (timeRemaining <= criticalSeconds) {
        timerStatus.textContent = `⚠️ Only ${Math.floor(timeRemaining / 60)} minute(s) left!`;
        timerStatus.classList.add('critical');
    } else if (timeRemaining <= warningSeconds) {
        timerStatus.textContent = `⏰ ${Math.floor(timeRemaining / 60)} minute(s) remaining`;
        timerStatus.classList.add('warning');
    } else {
        const minutes = Math.floor(timeRemaining / 60);
        timerStatus.textContent = `✅ ${minutes} minute(s) remaining`;
    }
}

// Show auto-submit warning
function showAutoSubmitWarning() {
    if (!autoSubmitWarning) return;

    autoSubmitWarning.style.display = 'flex';
    
    let countdown = 30;
    const warningCountdown = document.getElementById('warningCountdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (warningCountdown) {
            warningCountdown.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            if (autoSubmitWarning.style.display === 'flex') {
                // Auto submit if warning is still showing
                processResults();
            }
        }
    }, 1000);
}

// Close warning modal
function closeWarning() {
    if (autoSubmitWarning) {
        autoSubmitWarning.style.display = 'none';
    }
}

// Submit from warning modal
function submitFromWarning() {
    closeWarning();
    processResults();
}

// Handle time up
function handleTimeUp() {
    clearInterval(examTimer);
    
    if (timerConfig.autoSubmit) {
        // Show "Time's Up" message briefly, then auto-submit
        if (timerDisplay) {
            timerDisplay.textContent = "00:00";
            timerDisplay.className = 'timer-display critical';
        }
        if (timerStatus) {
            timerStatus.textContent = "⏰ Time's up! Auto-submitting...";
            timerStatus.className = 'timer-status critical';
        }
        
        setTimeout(() => {
            processResults();
        }, 1000);
    } else {
        // Just show time's up message
        if (timerDisplay) {
            timerDisplay.textContent = "00:00";
            timerDisplay.className = 'timer-display critical';
        }
        if (timerStatus) {
            timerStatus.textContent = "⏰ Time's up! Please submit your exam.";
            timerStatus.className = 'timer-status critical';
        }
    }
}

// Stop timer
function stopTimer() {
    if (examTimer) {
        clearInterval(examTimer);
        examTimer = null;
    }
}

// MathJax rendering function
function renderMathJax() {
    if (window.MathJax && window.MathJax.typesetPromise) {
        return window.MathJax.typesetPromise().then(() => {
            console.log('MathJax rendered successfully');
        }).catch((err) => {
            console.log('MathJax render error: ', err);
        });
    }
    return Promise.resolve();
}

// Check if user has email
function checkUserEmail() {
    const email = localStorage.getItem("examUserEmail");
    if (!email) {
        alert("⚠️ Please go back and enter your email address first.");
        window.history.back();
        return false;
    }
    return true;
}

// Function to render a question with an image (if available)
function renderQuestionWithImage(question, index) {
    const hasImage = question.image && question.image !== "";
    
    return `
        <div class="question">
            <div class="question-header">
                <span class="question-number">Question ${index + 1}</span>
                <span class="question-topic">${question.topic}</span>
            </div>
            <div class="question-text">${question.text}</div>
            ${hasImage ? `<div class="question-image"><img src="${question.image}" alt="Question diagram"></div>` : ''}
            <div class="options">
                ${Object.entries(question.options).map(([key, value]) => `
                    <div class="option">
                        <input type="radio" name="${question.id}" value="${key}" id="${question.id}_${key}">
                        <label for="${question.id}_${key}">${value}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Render questions with MathJax and image support
function renderQuestions() {
    if (!questions || questions.length === 0) {
        questionsContainer.innerHTML = "<p>No questions available for this exam.</p>";
        return;
    }

    questionsContainer.innerHTML = "";

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = renderQuestionWithImage(question, index);
        questionsContainer.appendChild(questionDiv);
    });

    // Add event listeners
    addOptionListeners();
    updateProgress();
    
    // Render MathJax after questions are loaded
    setTimeout(() => renderMathJax(), 100);
}

// Add option selection listeners
function addOptionListeners() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Update visual selection
            const questionDiv = this.closest('.question');
            const allOptions = questionDiv.querySelectorAll('.option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            this.closest('.option').classList.add('selected');
            
            // Update progress
            updateProgress();
        });
    });
}

// Update progress bar
function updateProgress() {
    const totalQuestions = questions.length;
    const answeredQuestions = getAnsweredCount();
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${answeredQuestions} of ${totalQuestions} questions answered (${percentage}%)`;
}

// Get number of answered questions
function getAnsweredCount() {
    let count = 0;
    questions.forEach(question => {
        const selected = document.querySelector(`input[name="${question.id}"]:checked`);
        if (selected) count++;
    });
    return count;
}

// Process exam results with topic-based grouping
function processResults() {
    // Stop the timer
    stopTimer();
    
    const email = localStorage.getItem("examUserEmail");
    let score = 0;
    let mistakesByTopic = {}; // Group mistakes by topic
    let responses = [];

    // Calculate time taken
    const totalSeconds = timerConfig.enabled ? timerConfig.totalMinutes * 60 : 0;
    const timeTaken = timerConfig.enabled ? totalSeconds - timeRemaining : 0;

    questions.forEach((question, questionIndex) => {
        const selected = document.querySelector(`input[name="${question.id}"]:checked`);
        let chosenAnswer = "Not answered";
        let isCorrect = false;

        if (selected) {
            chosenAnswer = question.options[selected.value];
            if (selected.value === question.correct) {
                score++;
                isCorrect = true;
            }
        }

        if (!isCorrect) {
            // Group mistakes by topic
            if (!mistakesByTopic[question.topic]) {
                mistakesByTopic[question.topic] = {
                    video: question.video,
                    questions: [],
                    count: 0
                };
            }
            
            mistakesByTopic[question.topic].questions.push({
                text: question.text,
                image: question.image,
                chosen: chosenAnswer,
                correct: question.options[question.correct],
                questionId: question.id,
                originalIndex: questionIndex
            });
            
            mistakesByTopic[question.topic].count++;
        }

        responses.push({
            question: question.text,
            chosen: chosenAnswer,
            correct: question.options[question.correct],
            isCorrect: isCorrect,
            topic: question.topic
        });
    });

    // Show results
    displayResults(score, mistakesByTopic, timeTaken);

    // Save to Google Sheets (if configured)
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL") {
        saveToGoogleSheets(email, score, responses, timeTaken);
    }

    // Hide exam form and show results
    examForm.style.display = "none";
    result.style.display = "block";
}

// Display results with topic-based grouping and MathJax support
function displayResults(score, mistakesByTopic, timeTaken) {
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    let scoreClass = "needs-improvement";
    let message = "Keep practicing! You'll improve with more study.";

    if (percentage >= 80) {
        scoreClass = "excellent";
        message = "🎉 Excellent work! You've mastered this topic!";
    } else if (percentage >= 60) {
        scoreClass = "good";
        message = "👍 Good job! A little more practice and you'll be perfect!";
    }

    let resultHTML = `
        <div class="score-display ${scoreClass}">
            ${score}/${totalQuestions} (${percentage}%)
        </div>
        <div class="result-message">${message}</div>
    `;

    // Add time taken if timer was enabled
    if (timerConfig.enabled && timeTaken > 0) {
        const timeFormatted = formatTime(timeTaken);
        resultHTML += `
            <div class="time-taken" style="text-align: center; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <strong>⏱️ Time Taken: ${timeFormatted}</strong>
            </div>
        `;
    }

    // Check if there are any mistakes
    const topicsWithMistakes = Object.keys(mistakesByTopic);
    
    if (topicsWithMistakes.length > 0) {
        resultHTML += `
            <div class="mistakes-overview">
                <h3>📊 Topics to Review</h3>
                <div class="topic-summary">
        `;

        // Show topic summary first
        topicsWithMistakes.forEach(topic => {
            const topicData = mistakesByTopic[topic];
            resultHTML += `
                <div class="topic-summary-item">
                    <span class="topic-name">${topic}</span>
                    <span class="mistake-count">${topicData.count} mistake${topicData.count > 1 ? 's' : ''}</span>
                </div>
            `;
        });

        resultHTML += `</div></div>`;

        // Show detailed mistakes grouped by topic
        resultHTML += `<div class="mistakes-by-topic">`;

        topicsWithMistakes.forEach(topic => {
            const topicData = mistakesByTopic[topic];
            
            resultHTML += `
                <div class="topic-box">
                    <div class="topic-header">
                        <h4>📚 ${topic}</h4>
                        <span class="topic-mistake-count">${topicData.count} question${topicData.count > 1 ? 's' : ''} to review</span>
                    </div>
                    
                    <div class="topic-questions">
            `;

            // Add all questions from this topic
            topicData.questions.forEach((mistake, index) => {
                const hasImage = mistake.image && mistake.image !== "";
                resultHTML += `
                    <div class="topic-question-item">
                        <div class="question-number-small">Q${index + 1}</div>
                        <div class="question-details">
                            <div class="question-text-small">${mistake.text}</div>
                            ${hasImage ? `<div class="question-image-small"><img src="${mistake.image}" alt="Question diagram"></div>` : ''}
                            <div class="answer-comparison">
                                <div class="wrong-answer">❌ Your answer: ${mistake.chosen}</div>
                                <div class="correct-answer">✅ Correct answer: ${mistake.correct}</div>
                            </div>
                        </div>
                    </div>
                `;
            });

            resultHTML += `
                    </div>
                    
                    <div class="topic-video">
                        <a href="${topicData.video}" target="_blank" class="topic-video-link">
                            📺 Watch ${topic} Tutorial
                        </a>
                    </div>
                </div>
            `;
        });

        resultHTML += `</div>`;

    } else {
        // Perfect score message
        resultHTML += `
            <div class="perfect-score">
                <h3>🌟 Perfect Score!</h3>
                <p>You got every question right! You've mastered all the topics in this exam.</p>
            </div>
        `;
    }

    resultContent.innerHTML = resultHTML;
    
    // Render MathJax for results
    setTimeout(() => renderMathJax(), 100);
}

// Save results to Google Sheets with exam URL and time data
function saveToGoogleSheets(email, score, responses, timeTaken) {
    const currentURL = window.location.href;
    const examName = window.location.pathname.split('/').pop().replace('.html', '').replace('-exam', '');
    
    const data = {
        timestamp: new Date().toISOString(),
        examURL: currentURL,
        examName: examName,
        email: email,
        examTitle: document.title,
        score: score,
        totalQuestions: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        timeTaken: timeTaken,
        timeLimit: timerConfig.enabled ? timerConfig.totalMinutes * 60 : null,
        timerEnabled: timerConfig.enabled,
        responses: responses,
        userAgent: navigator.userAgent,
        completionTime: new Date().toLocaleString()
    };

    console.log("Sending data to Google Sheets:", data);

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then(() => {
        console.log("Data sent to Google Sheets successfully");
    }).catch(error => {
        console.error("Error sending to Google Sheets:", error);
    });
}

// Event listeners
submitBtn.addEventListener("click", function() {
    const answeredCount = getAnsweredCount();
    const totalQuestions = questions.length;
    
    if (answeredCount < totalQuestions) {
        const unanswered = totalQuestions - answeredCount;
        const confirmMessage = `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`;
        
        if (!confirm(confirmMessage)) {
            return;
        }
    }
    
    processResults();
});

// Initialize exam
window.addEventListener("DOMContentLoaded", function() {
    if (checkUserEmail()) {
        // Wait longer for MathJax to be ready
        setTimeout(() => {
            renderQuestions();
            initializeTimer();
        }, 2000); // Wait 2 seconds for MathJax to load
    }
});

// Handle page visibility changes (pause timer when tab is not active)
document.addEventListener("visibilitychange", function() {
    if (timerConfig.enabled && examTimer) {
        if (document.hidden) {
            // Page is hidden - could pause timer or show warning
            console.log("Tab became inactive");
        } else {
            // Page is visible again
            console.log("Tab became active");
        }
    }
});

// Prevent accidental page refresh/close
window.addEventListener("beforeunload", function(e) {
    if (examTimer && timeRemaining > 0) {
        e.preventDefault();
        e.returnValue = "You have an exam in progress. Are you sure you want to leave?";
        return e.returnValue;
    }
});
