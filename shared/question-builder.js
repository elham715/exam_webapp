// Question Builder functionality
class QuestionBuilder {
    constructor() {
        this.questions = [];
        this.currentEditIndex = -1;
        
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            if (this.initializeElements()) {
                this.bindEvents();
                this.updatePreview(); // Initial preview
                console.log('Question Builder initialized successfully');
            } else {
                console.error('Failed to initialize Question Builder - missing elements');
            }
        }, 100);
    }

    initializeElements() {
        console.log('Initializing elements...');
        
        // Form elements with validation
        this.questionText = document.getElementById('questionText');
        this.questionTopic = document.getElementById('questionTopic');
        this.questionDifficulty = document.getElementById('questionDifficulty');
        this.questionImage = document.getElementById('questionImage');
        this.videoLink = document.getElementById('videoLink');
        
        // Option inputs
        this.optionA = document.getElementById('optionA');
        this.optionB = document.getElementById('optionB');
        this.optionC = document.getElementById('optionC');
        this.optionD = document.getElementById('optionD');
        
        // Correct answer radio
        this.correctAnswers = document.querySelectorAll('input[name="correctAnswer"]');
        
        // Buttons
        this.addQuestionBtn = document.getElementById('addQuestionBtn');
        this.clearFormBtn = document.getElementById('clearFormBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.saveBtn = document.getElementById('saveBtn');
        
        // Containers
        this.previewContainer = document.getElementById('previewContainer');
        this.questionsListContainer = document.getElementById('questionsListContainer');
        this.messageContainer = document.getElementById('messageContainer');
        
        // Image upload
        this.imageUpload = document.getElementById('imageUpload');
        this.imagePreview = document.getElementById('imagePreview');

        // Debug: Log which elements were found
        const elements = {
            questionText: !!this.questionText,
            questionTopic: !!this.questionTopic,
            optionA: !!this.optionA,
            previewContainer: !!this.previewContainer,
            correctAnswers: this.correctAnswers.length > 0
        };
        console.log('Elements found:', elements);

        // Check critical elements
        if (!this.questionText) {
            console.error('Question text input not found!');
            return false;
        }
        if (!this.previewContainer) {
            console.error('Preview container not found!');
            return false;
        }

        return true;
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Add null checks before binding events
        if (this.questionText) {
            this.questionText.addEventListener('input', () => {
                console.log('Question text changed:', this.questionText.value);
                this.updatePreview();
            });
        }
        
        if (this.questionTopic) {
            this.questionTopic.addEventListener('input', () => this.updatePreview());
        }
        
        if (this.questionDifficulty) {
            this.questionDifficulty.addEventListener('change', () => this.updatePreview());
        }
        
        if (this.optionA) {
            this.optionA.addEventListener('input', () => this.updatePreview());
        }
        if (this.optionB) {
            this.optionB.addEventListener('input', () => this.updatePreview());
        }
        if (this.optionC) {
            this.optionC.addEventListener('input', () => this.updatePreview());
        }
        if (this.optionD) {
            this.optionD.addEventListener('input', () => this.updatePreview());
        }
        
        // Correct answer radio buttons
        this.correctAnswers.forEach(radio => {
            radio.addEventListener('change', () => this.updatePreview());
        });

        // Button events with null checks
        if (this.addQuestionBtn) {
            this.addQuestionBtn.addEventListener('click', () => this.addQuestion());
        }
        if (this.clearFormBtn) {
            this.clearFormBtn.addEventListener('click', () => this.clearForm());
        }
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportQuestions());
        }
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveQuestions());
        }

        // Image upload events
        if (this.questionImage) {
            this.questionImage.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        if (this.imageUpload) {
            this.imageUpload.addEventListener('click', () => {
                if (this.questionImage) this.questionImage.click();
            });
            this.imageUpload.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.imageUpload.addEventListener('drop', (e) => this.handleDrop(e));
        }

        console.log('Events bound successfully');
    }

    updatePreview() {
        console.log('Updating preview...');
        
        if (!this.previewContainer) {
            console.error('Preview container not available');
            return;
        }

        try {
            const questionData = this.getFormData();
            console.log('Preview data:', questionData);
            
            if (!questionData.text.trim()) {
                this.previewContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #7f8c8d; border: 2px dashed #ecf0f1; border-radius: 10px;">
                        <span style="font-size: 3em; display: block; margin-bottom: 15px;">📝</span>
                        <h3 style="margin: 0 0 10px 0;">Start typing your question</h3>
                        <p style="margin: 0; font-size: 0.9em;">Your preview will appear here as you type</p>
                    </div>
                `;
                return;
            }

            const previewHTML = this.generatePreviewHTML(questionData, 1);
            this.previewContainer.innerHTML = previewHTML;
            
            // Render MathJax if available
            setTimeout(() => {
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([this.previewContainer]).catch((err) => {
                        console.log('MathJax render error: ', err);
                    });
                }
            }, 100);
            
            console.log('Preview updated successfully');
        } catch (error) {
            console.error('Error updating preview:', error);
            this.previewContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #e74c3c;">
                    <p>Error updating preview. Check console for details.</p>
                </div>
            `;
        }
    }

    getFormData() {
        const correctAnswer = document.querySelector('input[name="correctAnswer"]:checked');
        
        // Handle image with better error checking
        let imageUrl = '';
        if (this.questionImage && this.questionImage.files && this.questionImage.files[0]) {
            try {
                imageUrl = URL.createObjectURL(this.questionImage.files[0]);
            } catch (error) {
                console.error('Error creating image URL:', error);
            }
        }
        
        return {
            text: this.questionText ? this.questionText.value.trim() : '',
            topic: this.questionTopic ? this.questionTopic.value.trim() : '',
            difficulty: this.questionDifficulty ? this.questionDifficulty.value : 'beginner',
            image: imageUrl,
            video: this.videoLink ? this.videoLink.value.trim() : '',
            options: {
                A: this.optionA ? this.optionA.value.trim() : '',
                B: this.optionB ? this.optionB.value.trim() : '',
                C: this.optionC ? this.optionC.value.trim() : '',
                D: this.optionD ? this.optionD.value.trim() : ''
            },
            correct: correctAnswer ? correctAnswer.value : 'A'
        };
    }

    generatePreviewHTML(question, questionNumber) {
        const hasImage = question.image && question.image !== '';
        const hasAllOptions = Object.values(question.options).every(opt => opt.trim() !== '');
        
        return `
            <div class="question-preview">
                <div class="preview-header">
                    <span class="preview-number">Question ${questionNumber}</span>
                    <span class="preview-topic">${question.topic || 'No Topic Set'}</span>
                </div>
                <div class="preview-text">${question.text}</div>
                ${hasImage ? `
                    <div class="preview-image">
                        <img src="${question.image}" alt="Question image" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
                    </div>
                ` : ''}
                <div class="preview-options">
                    ${Object.entries(question.options).map(([key, value]) => `
                        <div class="preview-option ${key === question.correct ? 'correct' : ''} ${!value.trim() ? 'empty' : ''}">
                            <input type="radio" disabled ${key === question.correct ? 'checked' : ''}>
                            <label><strong>${key})</strong> ${value || '(empty option)'}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="preview-info" style="margin-top: 15px; padding: 12px; background: #f8f9fa; border-radius: 8px; font-size: 0.9em; color: #7f8c8d;">
                    <strong>✓ Correct Answer:</strong> ${question.correct} | 
                    <strong>📊 Difficulty:</strong> ${question.difficulty} | 
                    <strong>🎥 Video:</strong> ${question.video ? 'Added' : 'None'} |
                    <strong>📷 Image:</strong> ${hasImage ? 'Added' : 'None'}
                    ${!hasAllOptions ? '<br><span style="color: #e74c3c;">⚠️ Some options are empty</span>' : ''}
                </div>
            </div>
        `;
    }

    // ... (rest of your methods remain the same until exportQuestions)

    validateQuestion(questionData) {
        const errors = [];

        if (!questionData.text) {
            errors.push("Question text is required");
        }

        if (!questionData.topic) {
            errors.push("Topic is required");
        }

        // Check if all options are filled
        const emptyOptions = Object.entries(questionData.options)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (emptyOptions.length > 0) {
            errors.push(`Options ${emptyOptions.join(', ')} cannot be empty`);
        }

        // Check if correct answer option has text
        if (!questionData.options[questionData.correct]) {
            errors.push("The selected correct answer option is empty");
        }

        return errors;
    }

    addQuestion() {
        const questionData = this.getFormData();
        const errors = this.validateQuestion(questionData);

        if (errors.length > 0) {
            this.showMessage(errors.join('<br>'), 'error');
            return;
        }

        // Generate unique ID
        const questionId = this.currentEditIndex >= 0 ? 
            this.questions[this.currentEditIndex].id : 
            'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const question = {
            id: questionId,
            text: questionData.text,
            topic: questionData.topic,
            difficulty: questionData.difficulty,
            image: questionData.image,
            video: questionData.video || `https://www.youtube.com/watch?v=example_${questionData.topic.toLowerCase()}`,
            options: questionData.options,
            correct: questionData.correct
        };

        if (this.currentEditIndex >= 0) {
            // Update existing question
            this.questions[this.currentEditIndex] = question;
            this.showMessage('Question updated successfully!', 'success');
            this.currentEditIndex = -1;
            this.addQuestionBtn.textContent = '➕ Add Question';
        } else {
            // Add new question
            this.questions.push(question);
            this.showMessage('Question added successfully!', 'success');
        }

        this.clearForm();
        this.updateQuestionsList();
        this.updateExportButton();
    }

    editQuestion(index) {
        const question = this.questions[index];
        
        // Fill form with question data
        this.questionText.value = question.text;
        this.questionTopic.value = question.topic;
        this.questionDifficulty.value = question.difficulty;
        this.videoLink.value = question.video;
        
        this.optionA.value = question.options.A;
        this.optionB.value = question.options.B;
        this.optionC.value = question.options.C;
        this.optionD.value = question.options.D;
        
        // Set correct answer
        document.querySelector(`input[name="correctAnswer"][value="${question.correct}"]`).checked = true;
        
        // Set edit mode
        this.currentEditIndex = index;
        this.addQuestionBtn.textContent = '💾 Update Question';
        
        // Update preview
        this.updatePreview();
        
        // Scroll to form
        document.querySelector('.builder-content').scrollIntoView({ behavior: 'smooth' });
        
        this.showMessage('Question loaded for editing', 'warning');
    }

    deleteQuestion(index) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.questions.splice(index, 1);
            this.updateQuestionsList();
            this.updateExportButton();
            this.showMessage('Question deleted successfully!', 'success');
            
            // Reset edit mode if we were editing this question
            if (this.currentEditIndex === index) {
                this.currentEditIndex = -1;
                this.addQuestionBtn.textContent = '➕ Add Question';
                this.clearForm();
            } else if (this.currentEditIndex > index) {
                this.currentEditIndex--;
            }
        }
    }

    clearForm() {
        if (this.questionText) this.questionText.value = '';
        if (this.questionTopic) this.questionTopic.value = '';
        if (this.questionDifficulty) this.questionDifficulty.value = 'beginner';
        if (this.questionImage) this.questionImage.value = '';
        if (this.videoLink) this.videoLink.value = '';
        
        if (this.optionA) this.optionA.value = '';
        if (this.optionB) this.optionB.value = '';
        if (this.optionC) this.optionC.value = '';
        if (this.optionD) this.optionD.value = '';
        
        const firstRadio = document.querySelector('input[name="correctAnswer"][value="A"]');
        if (firstRadio) firstRadio.checked = true;
        
        if (this.imagePreview) this.imagePreview.innerHTML = '';
        this.currentEditIndex = -1;
        if (this.addQuestionBtn) this.addQuestionBtn.textContent = '➕ Add Question';
        
        this.updatePreview();
    }

    updateQuestionsList() {
        if (!this.questionsListContainer) return;
        
        if (this.questions.length === 0) {
            this.questionsListContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No questions added yet</p>';
            return;
        }

        const listHTML = this.questions.map((question, index) => `
            <div class="question-item">
                <div class="question-item-header">
                    <span class="question-item-number">${index + 1}</span>
                    <div class="question-item-actions">
                        <button class="edit-question-btn" onclick="questionBuilder.editQuestion(${index})">✏️ Edit</button>
                        <button class="delete-question-btn" onclick="questionBuilder.deleteQuestion(${index})">🗑️ Delete</button>
                    </div>
                </div>
                <div class="question-item-text">${question.text.substring(0, 100)}${question.text.length > 100 ? '...' : ''}</div>
                <div class="question-item-topic">Topic: ${question.topic} | Difficulty: ${question.difficulty}</div>
            </div>
        `).join('');

        this.questionsListContainer.innerHTML = listHTML;
    }

    updateExportButton() {
        if (!this.exportBtn || !this.saveBtn) return;
        
        this.exportBtn.disabled = this.questions.length === 0;
        this.saveBtn.disabled = this.questions.length === 0;
        
        if (this.questions.length > 0) {
            this.exportBtn.textContent = `📦 Export Package (${this.questions.length})`;
        } else {
            this.exportBtn.textContent = '📦 Export Package';
        }
    }

    // Continue with the rest of your methods (exportQuestions, saveQuestions, etc.)
    // I'll fix the exportQuestions method syntax error:

    exportQuestions() {
        console.log('Export button clicked');
        
        if (this.questions.length === 0) {
            this.showMessage('No questions to export!', 'error');
            return;
        }
    
        // Get exam data from localStorage (set in question-maker.html)
        const examData = localStorage.getItem("examMakerData");
        console.log('Exam data from localStorage:', examData);
        
        if (!examData) {
            this.showMessage('Exam details not found. Please go back to the maker page and enter exam details.', 'error');
            return;
        }
    
        let parsedExamData;
        try {
            parsedExamData = JSON.parse(examData);
        } catch (error) {
            console.error('Error parsing exam data:', error);
            this.showMessage('Invalid exam data. Please go back to the maker page.', 'error');
            return;
        }
    
        const examName = parsedExamData.name;
        const examTitle = parsedExamData.title;
        const examDescription = parsedExamData.description;
    
        console.log('Exam details:', { examName, examTitle, examDescription });
    
        // Show export modal with copy-paste content
        try {
            this.showExportModal(examName, examTitle, examDescription);
        } catch (error) {
            console.error('Error showing export modal:', error);
            this.showMessage('Error creating export modal. Check console for details.', 'error');
        }
    }
    
    
    showExportModal(examName, examTitle, examDescription) {
        console.log('Creating export modal with:', { examName, examTitle, examDescription });
        
        // Remove any existing modal first
        const existingModal = document.getElementById('exportModal');
        if (existingModal) {
            existingModal.remove();
        }
    
        // Generate the question file content using simple string concatenation
        const questionFileContent = "// " + examTitle + " exam questions\n" +
            "// Generated on " + new Date().toLocaleDateString() + "\n" +
            "// Total questions: " + this.questions.length + "\n\n" +
            "const questions = " + JSON.stringify(this.questions, null, 4) + ";";
    
        // Generate landing page content using simple string concatenation
        const landingPageHTML = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <title>" + examTitle + "</title>\n" +
            "    <link rel=\"stylesheet\" href=\"shared/style.css\">\n" +
            "</head>\n" +
            "<body>\n" +
            "    <div class=\"landing-container\">\n" +
            "        <div class=\"landing-card\">\n" +
            "            <span class=\"exam-icon\">📚</span>\n" +
            "            <h1>" + examTitle + "</h1>\n" +
            "            <p class=\"exam-description\">\n" +
            "                " + examDescription + "\n" +
            "            </p>\n" +
            "\n" +
            "            <div class=\"exam-info\">\n" +
            "                <h3>📋 Exam Details</h3>\n" +
            "                <div class=\"info-item\">\n" +
            "                    <span class=\"info-label\">Questions:</span>\n" +
            "                    <span class=\"info-value\">" + this.questions.length + " Multiple Choice</span>\n" +
            "                </div>\n" +
            "                <div class=\"info-item\">\n" +
            "                    <span class=\"info-label\">Time Limit:</span>\n" +
            "                    <span class=\"info-value\">30 minutes</span>\n" +
            "                </div>\n" +
            "                <div class=\"info-item\">\n" +
            "                    <span class=\"info-label\">Difficulty:</span>\n" +
            "                    <span class=\"info-value\">Mixed</span>\n" +
            "                </div>\n" +
            "                <div class=\"info-item\">\n" +
            "                    <span class=\"info-label\">Passing Score:</span>\n" +
            "                    <span class=\"info-value\">60%</span>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "\n" +
            "            <div class=\"email-section\">\n" +
            "                <h3>📧 Enter Your Email</h3>\n" +
            "                <input type=\"email\" id=\"emailInput\" class=\"email-input\" placeholder=\"your.email@example.com\" required>\n" +
            "                <div id=\"emailError\" class=\"error-message\"></div>\n" +
            "            </div>\n" +
            "\n" +
            "            <button id=\"startBtn\" class=\"start-btn\" disabled>\n" +
            "                🚀 Start Timed Exam\n" +
            "            </button>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "\n" +
            "    <script src=\"shared/landing.js\"></script>\n" +
            "</body>\n" +
            "</html>";
    
        // Generate exam page content using simple string concatenation
        const examPageHTML = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <title>" + examTitle + "</title>\n" +
            "    <link rel=\"stylesheet\" href=\"shared/style.css\">\n" +
            "    \n" +
            "    <!-- MathJax Configuration -->\n" +
            "    <script>\n" +
            "        window.MathJax = {\n" +
            "            tex: {\n" +
            "                inlineMath: [['$', '$'], ['\\\KATEX_INLINE_OPEN', '\\\KATEX_INLINE_CLOSE']],\n" +
            "                displayMath: [['$$', '$$'], ['\\[', '\\]']]],\n" +
            "                processEscapes: true,\n" +
            "                processEnvironments: true\n" +
            "            },\n" +
            "            options: {\n" +
            "                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']\n" +
            "            }\n" +
            "        };\n" +
            "    </script>\n" +
            "    <script src=\"https://polyfill.io/v3/polyfill.min.js?features=es6\"></script>\n" +
            "    <script id=\"MathJax-script\" async src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\"></script>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <div class=\"exam-container\">\n" +
            "        <div class=\"exam-header\">\n" +
            "            <h1>📚 " + examTitle + "</h1>\n" +
            "            <p>Answer all questions to the best of your ability</p>\n" +
            "\n" +
            "            <div class=\"progress-section\">\n" +
            "                <div class=\"progress-text\" id=\"progressText\">0 of " + this.questions.length + " questions answered (0%)</div>\n" +
            "                <div class=\"progress-bar\">\n" +
            "                    <div class=\"progress-fill\" id=\"progressFill\"></div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "\n" +
            "        <div class=\"exam-content\">\n" +
            "            <form id=\"examForm\">\n" +
            "                <div id=\"questionsContainer\"></div>\n" +
            "\n" +
            "                <div class=\"exam-actions\">\n" +
            "                    <button type=\"button\" id=\"submitBtn\" class=\"submit-btn\">📝 Submit Exam</button>\n" +
            "                    <a href=\"" + examName + ".html\" class=\"back-btn\">← Back to Start</a>\n" +
            "                </div>\n" +
            "            </form>\n" +
            "\n" +
            "            <div id=\"result\" class=\"result-section\" style=\"display:none;\">\n" +
            "                <div id=\"resultContent\"></div>\n" +
            "                <div style=\"text-align: center; margin-top: 30px;\">\n" +
            "                    <a href=\"" + examName + ".html\" class=\"start-btn\">Take Again</a>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "\n" +
            "<!-- Timer Configuration -->\n" +
            "<script>\n" +
            "    window.TIMER_CONFIG = {\n" +
            "        enabled: true,\n" +
            "        totalMinutes: 30,\n" +
            "        warningAtMinutes: 5,\n" +
            "        criticalAtMinutes: 2,\n" +
            "        autoSubmit: true\n" +
            "    };\n" +
            "</script>\n" +
            "\n" +
            "<!-- Load " + examName + " questions -->\n" +
            "<script src=\"questions/" + examName + ".js\"></script>\n" +
            "<!-- Load exam engine -->\n" +
            "<script src=\"shared/exam-engine.js\"></script>\n" +
            "\n" +
            "</body>\n" +
            "</html>";
    
        // Create modal using DOM methods
        const modalDiv = document.createElement('div');
        modalDiv.className = 'export-modal';
        modalDiv.id = 'exportModal';
    
        const modalContent = document.createElement('div');
        modalContent.className = 'export-modal-content';
    
        // Header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'export-modal-header';
        modalHeader.innerHTML = '<h2>📦 Export Complete Package</h2><button class="close-modal" onclick="closeExportModal()">✕</button>';
    
        // Tabs
        const tabsDiv = document.createElement('div');
        tabsDiv.className = 'export-tabs';
        tabsDiv.innerHTML = '<button class="export-tab active" onclick="showExportTab(\'questions\')">questions/' + examName + '.js</button>' +
            '<button class="export-tab" onclick="showExportTab(\'landing\')">' + examName + '.html</button>' +
            '<button class="export-tab" onclick="showExportTab(\'exam\')">' + examName + '-exam.html</button>';
    
        // Instructions
        const instructionsDiv = document.createElement('div');
        instructionsDiv.className = 'export-instructions';
        instructionsDiv.innerHTML = '<p><strong>📁 Instructions:</strong></p><ol><li>Copy the content from each tab</li><li>Create the corresponding files in your project</li><li>Place files in the correct folders as shown in tab names</li></ol>';
    
        // Content area
        const contentAreaDiv = document.createElement('div');
        contentAreaDiv.className = 'export-content-area';
    
        // Questions tab
        const questionsTab = document.createElement('div');
        questionsTab.id = 'questionsTab';
        questionsTab.className = 'export-tab-content active';
        const questionsHeader = document.createElement('div');
        questionsHeader.className = 'export-file-header';
        questionsHeader.innerHTML = '<strong>📄 questions/' + examName + '.js</strong><button onclick="copyToClipboard(\'questionsContent\')" class="copy-btn">📋 Copy</button>';
        const questionsTextarea = document.createElement('textarea');
        questionsTextarea.id = 'questionsContent';
        questionsTextarea.readOnly = true;
        questionsTextarea.value = questionFileContent;
        questionsTab.appendChild(questionsHeader);
        questionsTab.appendChild(questionsTextarea);
    
        // Landing tab
        const landingTab = document.createElement('div');
        landingTab.id = 'landingTab';
        landingTab.className = 'export-tab-content';
        const landingHeader = document.createElement('div');
        landingHeader.className = 'export-file-header';
        landingHeader.innerHTML = '<strong>📄 ' + examName + '.html</strong><button onclick="copyToClipboard(\'landingContent\')" class="copy-btn">📋 Copy</button>';
        const landingTextarea = document.createElement('textarea');
        landingTextarea.id = 'landingContent';
        landingTextarea.readOnly = true;
        landingTextarea.value = landingPageHTML;
        landingTab.appendChild(landingHeader);
        landingTab.appendChild(landingTextarea);
    
        // Exam tab
        const examTab = document.createElement('div');
        examTab.id = 'examTab';
        examTab.className = 'export-tab-content';
        const examHeader = document.createElement('div');
        examHeader.className = 'export-file-header';
        examHeader.innerHTML = '<strong>📄 ' + examName + '-exam.html</strong><button onclick="copyToClipboard(\'examContent\')" class="copy-btn">📋 Copy</button>';
        const examTextarea = document.createElement('textarea');
        examTextarea.id = 'examContent';
        examTextarea.readOnly = true;
        examTextarea.value = examPageHTML;
        examTab.appendChild(examHeader);
        examTab.appendChild(examTextarea);
    
        contentAreaDiv.appendChild(questionsTab);
        contentAreaDiv.appendChild(landingTab);
        contentAreaDiv.appendChild(examTab);
    
        // Actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'export-actions';
        actionsDiv.innerHTML = '<button onclick="downloadAllFiles()" class="download-all-btn">💾 Download All Files</button>' +
            '<button onclick="closeExportModal()" class="close-btn">✅ Done</button>';
    
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(tabsDiv);
        modalContent.appendChild(instructionsDiv);
        modalContent.appendChild(contentAreaDiv);
        modalContent.appendChild(actionsDiv);
        modalDiv.appendChild(modalContent);
    
        // Add to page
        document.body.appendChild(modalDiv);
    
        // Store data for download function
        window.exportData = {
            examName: examName,
            questionContent: questionFileContent,
            landingContent: landingPageHTML,
            examContent: examPageHTML
        };
    
        console.log('Modal created successfully');
        this.showMessage('Export modal opened! Copy files or download them.', 'success');
    }
    
    saveQuestions() {
        if (this.questions.length === 0) {
            this.showMessage('No questions to save!', 'error');
            return;
        }

        const savedData = {
            questions: this.questions,
            savedAt: new Date().toISOString(),
            questionCount: this.questions.length
        };

        localStorage.setItem('questionBuilderData', JSON.stringify(savedData));
        this.showMessage('Questions saved to browser storage!', 'success');
    }

    loadSavedQuestions() {
        const savedData = localStorage.getItem('questionBuilderData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.questions && Array.isArray(data.questions)) {
                    this.questions = data.questions;
                    this.updateQuestionsList();
                    this.updateExportButton();
                    this.showMessage(`Loaded ${data.questions.length} saved questions!`, 'success');
                }
            } catch (error) {
                console.error('Error loading saved questions:', error);
                this.showMessage('Error loading saved questions', 'error');
            }
        }
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            } else {
                this.showMessage('Please select a valid image file', 'error');
                this.questionImage.value = '';
            }
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.imageUpload.style.borderColor = '#c0392b';
        this.imageUpload.style.background = 'rgba(231, 76, 60, 0.1)';
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        
        this.imageUpload.style.borderColor = '#e74c3c';
        this.imageUpload.style.background = 'transparent';
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.questionImage.files = files;
            this.handleImageUpload({ target: { files: files } });
        }
    }

    showMessage(message, type) {
        if (!this.messageContainer) return;
        
        this.messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => {
            this.messageContainer.innerHTML = '';
        }, 5000);
    }
}

// Initialize when DOM is loaded
let questionBuilder;
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Question Builder...');
    questionBuilder = new QuestionBuilder();
    
    // Load saved questions on startup
    setTimeout(() => {
        if (questionBuilder && questionBuilder.loadSavedQuestions) {
            questionBuilder.loadSavedQuestions();
        }
    }, 500);
});

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