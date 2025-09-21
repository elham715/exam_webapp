// // // Exam engine functionality
// // const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Replace when ready

// // const examForm = document.getElementById("examForm");
// // const questionsContainer = document.getElementById("questionsContainer");
// // const result = document.getElementById("result");
// // const resultContent = document.getElementById("resultContent");
// // const submitBtn = document.getElementById("submitBtn");
// // const progressFill = document.getElementById("progressFill");
// // const progressText = document.getElementById("progressText");

// // // Check if user has email
// // function checkUserEmail() {
// //     const email = localStorage.getItem("examUserEmail");
// //     if (!email) {
// //         alert("⚠️ Please go back and enter your email address first.");
// //         window.history.back();
// //         return false;
// //     }
// //     return true;
// // }

// // // Render questions
// // function renderQuestions() {
// //     if (!questions || questions.length === 0) {
// //         questionsContainer.innerHTML = "<p>No questions available for this exam.</p>";
// //         return;
// //     }

// //     questionsContainer.innerHTML = "";
    
// //     questions.forEach((question, index) => {
// //         const questionDiv = document.createElement("div");
// //         questionDiv.className = "question";
        
// //         questionDiv.innerHTML = `
// //             <div class="question-header">
// //                 <span class="question-number">Question ${index + 1}</span>
// //                 <span class="question-topic">${question.topic}</span>
// //             </div>
// //             <div class="question-text">${question.text}</div>
// //             <div class="options">
// //                 ${Object.entries(question.options).map(([key, value]) => `
// //                     <div class="option">
// //                         <input type="radio" name="${question.id}" value="${key}" id="${question.id}_${key}">
// //                         <label for="${question.id}_${key}">${value}</label>
// //                     </div>
// //                 `).join('')}
// //             </div>
// //         `;
        
// //         questionsContainer.appendChild(questionDiv);
// //     });

// //     // Add event listeners
// //     addOptionListeners();
// //     updateProgress();
// // }

// // // Add option selection listeners
// // function addOptionListeners() {
// //     const radioButtons = document.querySelectorAll('input[type="radio"]');
// //     radioButtons.forEach(radio => {
// //         radio.addEventListener('change', function() {
// //             // Update visual selection
// //             const questionDiv = this.closest('.question');
// //             const allOptions = questionDiv.querySelectorAll('.option');
// //             allOptions.forEach(opt => opt.classList.remove('selected'));
// //             this.closest('.option').classList.add('selected');
            
// //             // Update progress
// //             updateProgress();
// //         });
// //     });
// // }

// // // Update progress bar
// // function updateProgress() {
// //     const totalQuestions = questions.length;
// //     const answeredQuestions = getAnsweredCount();
// //     const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
// //     progressFill.style.width = percentage + '%';
// //     progressText.textContent = `${answeredQuestions} of ${totalQuestions} questions answered (${percentage}%)`;
// // }

// // // Get number of answered questions
// // function getAnsweredCount() {
// //     let count = 0;
// //     questions.forEach(question => {
// //         const selected = document.querySelector(`input[name="${question.id}"]:checked`);
// //         if (selected) count++;
// //     });
// //     return count;
// // }

// // // Process exam results with topic-based grouping
// // function processResults() {
// //     const email = localStorage.getItem("examUserEmail");
// //     let score = 0;
// //     let mistakesByTopic = {}; // Group mistakes by topic
// //     let responses = [];

// //     questions.forEach((question, questionIndex) => {
// //         const selected = document.querySelector(`input[name="${question.id}"]:checked`);
// //         let chosenAnswer = "Not answered";
// //         let isCorrect = false;

// //         if (selected) {
// //             chosenAnswer = question.options[selected.value];
// //             if (selected.value === question.correct) {
// //                 score++;
// //                 isCorrect = true;
// //             }
// //         }

// //         if (!isCorrect) {
// //             // Group mistakes by topic
// //             if (!mistakesByTopic[question.topic]) {
// //                 mistakesByTopic[question.topic] = {
// //                     video: question.video,
// //                     questions: [],
// //                     count: 0
// //                 };
// //             }
            
// //             mistakesByTopic[question.topic].questions.push({
// //                 text: question.text,
// //                 chosen: chosenAnswer,
// //                 correct: question.options[question.correct],
// //                 questionId: question.id,
// //                 originalIndex: questionIndex
// //             });
            
// //             mistakesByTopic[question.topic].count++;
// //         }

// //         responses.push({
// //             question: question.text,
// //             chosen: chosenAnswer,
// //             correct: question.options[question.correct],
// //             isCorrect: isCorrect,
// //             topic: question.topic
// //         });
// //     });

// //     // Show results
// //     displayResults(score, mistakesByTopic);

// //     // Save to Google Sheets (if configured)
// //     if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL") {
// //         saveToGoogleSheets(email, score, responses);
// //     }

// //     // Hide exam form and show results
// //     examForm.style.display = "none";
// //     result.style.display = "block";
// // }

// // // Display results with topic-based grouping
// // function displayResults(score, mistakesByTopic) {
// //     const totalQuestions = questions.length;
// //     const percentage = Math.round((score / totalQuestions) * 100);

// //     let scoreClass = "needs-improvement";
// //     let message = "Keep practicing! You'll improve with more study.";

// //     if (percentage >= 80) {
// //         scoreClass = "excellent";
// //         message = "🎉 Excellent work! You've mastered this topic!";
// //     } else if (percentage >= 60) {
// //         scoreClass = "good";
// //         message = "👍 Good job! A little more practice and you'll be perfect!";
// //     }

// //     let resultHTML = `
// //         <div class="score-display ${scoreClass}">
// //             ${score}/${totalQuestions} (${percentage}%)
// //         </div>
// //         <div class="result-message">${message}</div>
// //     `;

// //     // Check if there are any mistakes
// //     const topicsWithMistakes = Object.keys(mistakesByTopic);
    
// //     if (topicsWithMistakes.length > 0) {
// //         resultHTML += `
// //             <div class="mistakes-overview">
// //                 <h3>📊 Topics to Review</h3>
// //                 <div class="topic-summary">
// //         `;

// //         // Show topic summary first
// //         topicsWithMistakes.forEach(topic => {
// //             const topicData = mistakesByTopic[topic];
// //             resultHTML += `
// //                 <div class="topic-summary-item">
// //                     <span class="topic-name">${topic}</span>
// //                     <span class="mistake-count">${topicData.count} mistake${topicData.count > 1 ? 's' : ''}</span>
// //                 </div>
// //             `;
// //         });

// //         resultHTML += `</div></div>`;

// //         // Show detailed mistakes grouped by topic
// //         resultHTML += `<div class="mistakes-by-topic">`;

// //         topicsWithMistakes.forEach(topic => {
// //             const topicData = mistakesByTopic[topic];
            
// //             resultHTML += `
// //                 <div class="topic-box">
// //                     <div class="topic-header">
// //                         <h4>📚 ${topic}</h4>
// //                         <span class="topic-mistake-count">${topicData.count} question${topicData.count > 1 ? 's' : ''} to review</span>
// //                     </div>
                    
// //                     <div class="topic-questions">
// //             `;

// //             // Add all questions from this topic
// //             topicData.questions.forEach((mistake, index) => {
// //                 resultHTML += `
// //                     <div class="topic-question-item">
// //                         <div class="question-number-small">Q${index + 1}</div>
// //                         <div class="question-details">
// //                             <div class="question-text-small">${mistake.text}</div>
// //                             <div class="answer-comparison">
// //                                 <div class="wrong-answer">❌ Your answer: ${mistake.chosen}</div>
// //                                 <div class="correct-answer">✅ Correct answer: ${mistake.correct}</div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 `;
// //             });

// //             resultHTML += `
// //                     </div>
                    
// //                     <div class="topic-video">
// //                         <a href="${topicData.video}" target="_blank" class="topic-video-link">
// //                             📺 Watch ${topic} Tutorial
// //                         </a>
// //                     </div>
// //                 </div>
// //             `;
// //         });

// //         resultHTML += `</div>`;

// //     } else {
// //         // Perfect score message
// //         resultHTML += `
// //             <div class="perfect-score">
// //                 <h3>🌟 Perfect Score!</h3>
// //                 <p>You got every question right! You've mastered all the topics in this exam.</p>
// //             </div>
// //         `;
// //     }

// //     resultContent.innerHTML = resultHTML;
// // }

// // // Save results to Google Sheets
// // function saveToGoogleSheets(email, score, responses) {
// //     const data = {
// //         timestamp: new Date().toISOString(),
// //         email: email,
// //         exam: document.title,
// //         score: score,
// //         total: questions.length,
// //         responses: responses
// //     };

// //     fetch(GOOGLE_SCRIPT_URL, {
// //         method: "POST",
// //         mode: "no-cors",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(data)
// //     }).catch(error => {
// //         console.log("Google Sheets integration not configured yet.");
// //     });
// // }

// // // Event listeners
// // submitBtn.addEventListener("click", function() {
// //     const answeredCount = getAnsweredCount();
// //     const totalQuestions = questions.length;
    
// //     if (answeredCount < totalQuestions) {
// //         const unanswered = totalQuestions - answeredCount;
// //         const confirmMessage = `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`;
        
// //         if (!confirm(confirmMessage)) {
// //             return;
// //         }
// //     }
    
// //     processResults();
// // });

// // // Initialize exam
// // window.addEventListener("DOMContentLoaded", function() {
// //     if (checkUserEmail()) {
// //         renderQuestions();
// //     }
// // });

// // Exam engine functionality with MathJax support
// const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Replace when ready

// const examForm = document.getElementById("examForm");
// const questionsContainer = document.getElementById("questionsContainer");
// const result = document.getElementById("result");
// const resultContent = document.getElementById("resultContent");
// const submitBtn = document.getElementById("submitBtn");
// const progressFill = document.getElementById("progressFill");
// const progressText = document.getElementById("progressText");

// // MathJax rendering function
// function renderMathJax() {
//     if (window.MathJax && window.MathJax.typesetPromise) {
//         return window.MathJax.typesetPromise().then(() => {
//             console.log('MathJax rendered successfully');
//         }).catch((err) => {
//             console.log('MathJax render error: ', err);
//         });
//     }
//     return Promise.resolve();
// }

// // Check if user has email
// function checkUserEmail() {
//     const email = localStorage.getItem("examUserEmail");
//     if (!email) {
//         alert("⚠️ Please go back and enter your email address first.");
//         window.history.back();
//         return false;
//     }
//     return true;
// }

// // Render questions with MathJax support
// function renderQuestions() {
//     if (!questions || questions.length === 0) {
//         questionsContainer.innerHTML = "<p>No questions available for this exam.</p>";
//         return;
//     }

//     questionsContainer.innerHTML = "";
    
//     questions.forEach((question, index) => {
//         const questionDiv = document.createElement("div");
//         questionDiv.className = "question";
        
//         questionDiv.innerHTML = `
//             <div class="question-header">
//                 <span class="question-number">Question ${index + 1}</span>
//                 <span class="question-topic">${question.topic}</span>
//             </div>
//             <div class="question-text">${question.text}</div>
//             <div class="options">
//                 ${Object.entries(question.options).map(([key, value]) => `
//                     <div class="option">
//                         <input type="radio" name="${question.id}" value="${key}" id="${question.id}_${key}">
//                         <label for="${question.id}_${key}">${value}</label>
//                     </div>
//                 `).join('')}
//             </div>
//         `;
        
//         questionsContainer.appendChild(questionDiv);
//     });

//     // Add event listeners
//     addOptionListeners();
//     updateProgress();
    
//     // Render MathJax after questions are loaded
//     setTimeout(() => renderMathJax(), 100);
// }

// // Add option selection listeners
// function addOptionListeners() {
//     const radioButtons = document.querySelectorAll('input[type="radio"]');
//     radioButtons.forEach(radio => {
//         radio.addEventListener('change', function() {
//             // Update visual selection
//             const questionDiv = this.closest('.question');
//             const allOptions = questionDiv.querySelectorAll('.option');
//             allOptions.forEach(opt => opt.classList.remove('selected'));
//             this.closest('.option').classList.add('selected');
            
//             // Update progress
//             updateProgress();
//         });
//     });
// }

// // Update progress bar
// function updateProgress() {
//     const totalQuestions = questions.length;
//     const answeredQuestions = getAnsweredCount();
//     const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
    
//     progressFill.style.width = percentage + '%';
//     progressText.textContent = `${answeredQuestions} of ${totalQuestions} questions answered (${percentage}%)`;
// }

// // Get number of answered questions
// function getAnsweredCount() {
//     let count = 0;
//     questions.forEach(question => {
//         const selected = document.querySelector(`input[name="${question.id}"]:checked`);
//         if (selected) count++;
//     });
//     return count;
// }

// // Process exam results with topic-based grouping
// function processResults() {
//     const email = localStorage.getItem("examUserEmail");
//     let score = 0;
//     let mistakesByTopic = {}; // Group mistakes by topic
//     let responses = [];

//     questions.forEach((question, questionIndex) => {
//         const selected = document.querySelector(`input[name="${question.id}"]:checked`);
//         let chosenAnswer = "Not answered";
//         let isCorrect = false;

//         if (selected) {
//             chosenAnswer = question.options[selected.value];
//             if (selected.value === question.correct) {
//                 score++;
//                 isCorrect = true;
//             }
//         }

//         if (!isCorrect) {
//             // Group mistakes by topic
//             if (!mistakesByTopic[question.topic]) {
//                 mistakesByTopic[question.topic] = {
//                     video: question.video,
//                     questions: [],
//                     count: 0
//                 };
//             }
            
//             mistakesByTopic[question.topic].questions.push({
//                 text: question.text,
//                 chosen: chosenAnswer,
//                 correct: question.options[question.correct],
//                 questionId: question.id,
//                 originalIndex: questionIndex
//             });
            
//             mistakesByTopic[question.topic].count++;
//         }

//         responses.push({
//             question: question.text,
//             chosen: chosenAnswer,
//             correct: question.options[question.correct],
//             isCorrect: isCorrect,
//             topic: question.topic
//         });
//     });

//     // Show results
//     displayResults(score, mistakesByTopic);

//     // Save to Google Sheets (if configured)
//     if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL") {
//         saveToGoogleSheets(email, score, responses);
//     }

//     // Hide exam form and show results
//     examForm.style.display = "none";
//     result.style.display = "block";
// }

// // Display results with topic-based grouping and MathJax support
// function displayResults(score, mistakesByTopic) {
//     const totalQuestions = questions.length;
//     const percentage = Math.round((score / totalQuestions) * 100);

//     let scoreClass = "needs-improvement";
//     let message = "Keep practicing! You'll improve with more study.";

//     if (percentage >= 80) {
//         scoreClass = "excellent";
//         message = "🎉 Excellent work! You've mastered this topic!";
//     } else if (percentage >= 60) {
//         scoreClass = "good";
//         message = "👍 Good job! A little more practice and you'll be perfect!";
//     }

//     let resultHTML = `
//         <div class="score-display ${scoreClass}">
//             ${score}/${totalQuestions} (${percentage}%)
//         </div>
//         <div class="result-message">${message}</div>
//     `;

//     // Check if there are any mistakes
//     const topicsWithMistakes = Object.keys(mistakesByTopic);
    
//     if (topicsWithMistakes.length > 0) {
//         resultHTML += `
//             <div class="mistakes-overview">
//                 <h3>📊 Topics to Review</h3>
//                 <div class="topic-summary">
//         `;

//         // Show topic summary first
//         topicsWithMistakes.forEach(topic => {
//             const topicData = mistakesByTopic[topic];
//             resultHTML += `
//                 <div class="topic-summary-item">
//                     <span class="topic-name">${topic}</span>
//                     <span class="mistake-count">${topicData.count} mistake${topicData.count > 1 ? 's' : ''}</span>
//                 </div>
//             `;
//         });

//         resultHTML += `</div></div>`;

//         // Show detailed mistakes grouped by topic
//         resultHTML += `<div class="mistakes-by-topic">`;

//         topicsWithMistakes.forEach(topic => {
//             const topicData = mistakesByTopic[topic];
            
//             resultHTML += `
//                 <div class="topic-box">
//                     <div class="topic-header">
//                         <h4>📚 ${topic}</h4>
//                         <span class="topic-mistake-count">${topicData.count} question${topicData.count > 1 ? 's' : ''} to review</span>
//                     </div>
                    
//                     <div class="topic-questions">
//             `;

//             // Add all questions from this topic
//             topicData.questions.forEach((mistake, index) => {
//                 resultHTML += `
//                     <div class="topic-question-item">
//                         <div class="question-number-small">Q${index + 1}</div>
//                         <div class="question-details">
//                             <div class="question-text-small">${mistake.text}</div>
//                             <div class="answer-comparison">
//                                 <div class="wrong-answer">❌ Your answer: ${mistake.chosen}</div>
//                                 <div class="correct-answer">✅ Correct answer: ${mistake.correct}</div>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//             });

//             resultHTML += `
//                     </div>
                    
//                     <div class="topic-video">
//                         <a href="${topicData.video}" target="_blank" class="topic-video-link">
//                             📺 Watch ${topic} Tutorial
//                         </a>
//                     </div>
//                 </div>
//             `;
//         });

//         resultHTML += `</div>`;

//     } else {
//         // Perfect score message
//         resultHTML += `
//             <div class="perfect-score">
//                 <h3>🌟 Perfect Score!</h3>
//                 <p>You got every question right! You've mastered all the topics in this exam.</p>
//             </div>
//         `;
//     }

//     resultContent.innerHTML = resultHTML;
    
//     // Render MathJax for results
//     setTimeout(() => renderMathJax(), 100);
// }

// // Save results to Google Sheets
// function saveToGoogleSheets(email, score, responses) {
//     const data = {
//         timestamp: new Date().toISOString(),
//         email: email,
//         exam: document.title,
//         score: score,
//         total: questions.length,
//         responses: responses
//     };

//     fetch(GOOGLE_SCRIPT_URL, {
//         method: "POST",
//         mode: "no-cors",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//     }).catch(error => {
//         console.log("Google Sheets integration not configured yet.");
//     });
// }

// // Event listeners
// submitBtn.addEventListener("click", function() {
//     const answeredCount = getAnsweredCount();
//     const totalQuestions = questions.length;
    
//     if (answeredCount < totalQuestions) {
//         const unanswered = totalQuestions - answeredCount;
//         const confirmMessage = `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`;
        
//         if (!confirm(confirmMessage)) {
//             return;
//         }
//     }
    
//     processResults();
// });

// // Initialize exam
// window.addEventListener("DOMContentLoaded", function() {
//     if (checkUserEmail()) {
//         // Wait for MathJax to load before rendering questions
//         if (window.MathJax) {
//             window.MathJax.startup.promise.then(() => {
//                 renderQuestions();
//             });
//         } else {
//             // Fallback if MathJax isn't loaded
//             setTimeout(() => renderQuestions(), 500);
//         }
//     }
// });




// // Add this function to your exam-engine.js file
// function renderQuestionWithImage(question, index) {
//     const hasImage = question.image && question.image !== "";
    
//     return `
//         <div class="question">
//             <div class="question-header">
//                 <span class="question-number">Question ${index + 1}</span>
//                 <span class="question-topic">${question.topic}</span>
//             </div>
//             <div class="question-text">${question.text}</div>
//             ${hasImage ? `<div class="question-image"><img src="${question.image}" alt="Question diagram"></div>` : ''}
//             <div class="options">
//                 ${Object.entries(question.options).map(([key, value]) => `
//                     <div class="option">
//                         <input type="radio" name="${question.id}" value="${key}" id="${question.id}_${key}">
//                         <label for="${question.id}_${key}">${value}</label>
//                     </div>
//                 `).join('')}
//             </div>
//         </div>
//     `;
// }

// // Then update the renderQuestions function:
// function renderQuestions() {
//     if (!questions || questions.length === 0) {
//         questionsContainer.innerHTML = "<p>No questions available for this exam.</p>";
//         return;
//     }

//     questionsContainer.innerHTML = "";

//     questions.forEach((question, index) => {
//         const questionDiv = document.createElement("div");
//         questionDiv.innerHTML = renderQuestionWithImage(question, index);
//         questionsContainer.appendChild(questionDiv);
//     });

//     // Add event listeners
//     addOptionListeners();
//     updateProgress();
// }




// Exam engine functionality with MathJax and image support
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Replace when ready

const examForm = document.getElementById("examForm");
const questionsContainer = document.getElementById("questionsContainer");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const submitBtn = document.getElementById("submitBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

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
    const email = localStorage.getItem("examUserEmail");
    let score = 0;
    let mistakesByTopic = {}; // Group mistakes by topic
    let responses = [];

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
    displayResults(score, mistakesByTopic);

    // Save to Google Sheets (if configured)
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "https://docs.google.com/spreadsheets/d/15DdCuUk-P8cc-GThI6T-l9IfmKLg0B7KrQEiXrpgt_8/edit?usp=sharing") {
        saveToGoogleSheets(email, score, responses);
    }

    // Hide exam form and show results
    examForm.style.display = "none";
    result.style.display = "block";
}

// Display results with topic-based grouping and MathJax support
function displayResults(score, mistakesByTopic) {
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

// Save results to Google Sheets with exam URL
function saveToGoogleSheets(email, score, responses) {
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
        responses: responses,
        userAgent: navigator.userAgent, // Device info
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
        // Wait for MathJax to load before rendering questions
        if (window.MathJax) {
            window.MathJax.startup.promise.then(() => {
                renderQuestions();
            });
        } else {
            // Fallback if MathJax isn't loaded
            setTimeout(() => renderQuestions(), 500);
        }
    }
});