document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.quiz-container').forEach(container => {
        const quizBody = container.querySelector('.quiz-body');
        const quizDataElement = container.querySelector('.quiz-data');
        const questions = JSON.parse(quizDataElement.textContent);
        const assetPath = container.dataset.assetPath;

        if (!quizBody || !questions || questions.length === 0) return;

        let quizHtml = '';
        questions.forEach((q, qIndex) => {
            quizHtml += `<div class="question" id="q-${q.id}-${qIndex}">`;

            let questionImage = q.imageUrl ? `<img src="${assetPath}${q.imageUrl}" class="question-image" alt="Question image">` : '';
            quizHtml += `<div class="question-text"><p><strong>${qIndex + 1}. ${q.questionText}</strong></p></div>${questionImage}`;

            q.options.forEach((opt, oIndex) => {
                let optionImage = opt.imageUrl ? `<img src="${assetPath}${opt.imageUrl}" class="option-image" alt="Option image">` : '';
                quizHtml += `<label><input type="radio" name="q${q.id}-${qIndex}" value="${oIndex}"> ${opt.optionText} ${optionImage}</label>`;
            });

            quizHtml += `<button type="button" class="check-btn" data-question-index="${qIndex}">Check Answer</button>`;
            quizHtml += `<div class="result"></div></div>`;
        });
        quizBody.innerHTML = quizHtml;

        quizBody.querySelectorAll('.check-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const qIndex = parseInt(e.target.dataset.questionIndex, 10);
                const question = questions[qIndex];
                const questionDiv = document.getElementById(`q-${question.id}-${qIndex}`);
                const resultDiv = questionDiv.querySelector('.result');
                const selected = questionDiv.querySelector(`input[name="q${question.id}-${qIndex}"]:checked`);

                if (selected) {
                    const selectedIndex = parseInt(selected.value, 10);
                    if (question.options[selectedIndex].correct) {
                        resultDiv.innerHTML = '<p class="correct">Correct!</p>';
                    } else {
                        resultDiv.innerHTML = '<p class="incorrect">Incorrect. Try again!</p>';
                    }
                } else {
                    resultDiv.innerHTML = '<p class="incorrect">Please select an answer.</p>';
                }
            });
        });
    });
});
