$(document).ready(function () {
    const initialWords = [
        { en: "apple", ua: ["яблуко"] },
        { en: "water", ua: ["вода"] },
        { en: "house", ua: ["будинок", "дім"] },
        { en: "friend", ua: ["друг", "подруга"] },
        { en: "book", ua: ["книга", "книжка"] },
        { en: "city", ua: ["місто"] },
        { en: "time", ua: ["час"] },
        { en: "morning", ua: ["ранок"] },
        { en: "night", ua: ["ніч"] },
        { en: "work", ua: ["робота", "праця"] },
        { en: "school", ua: ["школа"] },
        { en: "family", ua: ["сім'я", "родина"] },
        { en: "street", ua: ["вулиця"] },
        { en: "happy", ua: ["щасливий", "щаслива"] },
        { en: "fast", ua: ["швидкий", "швидко"] }
    ];

    let words = [];
    let currentIndex = 0;
    let correctCount = 0;
    let wrongCount = 0;

    function shuffleArray(array) {
        const copy = array.map(item => ({
            en: item.en,
            ua: item.ua,
            answered: false,
            isCorrect: null,
            userAnswer: ""
        }));

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function initGame() {
        words = shuffleArray(initialWords);
        currentIndex = 0;
        correctCount = 0;
        wrongCount = 0;

        $("#correctCount").text(correctCount);
        $("#wrongCount").text(wrongCount);
        $("#resultModal").fadeOut(200);

        renderCard();
    }

    function renderCard() {
        const currentWord = words[currentIndex];
        const $card = $("#wordCard");
        const $input = $("#translationInput");

        $("#wordDisplay").text(currentWord.en);
        $("#stepCounter").text((currentIndex + 1) + "/" + words.length);

        const progressPercent = ((currentIndex + 1) / words.length) * 100;
        $("#progressFill").css("width", progressPercent + "%");

        $input.removeClass("input-error");
        $("#errorMessage").text("");
        $card.removeClass("is-correct is-wrong");

        if (currentWord.answered) {
            $input.val(currentWord.userAnswer).prop("disabled", true);
            $("#correctHint").text(currentWord.ua[0]);

            if (currentWord.isCorrect) {
                $card.addClass("is-correct");
                $("#cardStatus").text("Вірно");
            } else {
                $card.addClass("is-wrong");
                $("#cardStatus").text("Невірно");
            }
        } else {
            $input.val("").prop("disabled", false).focus();
            $("#correctHint").text("");
            $("#cardStatus").text("Перевірити");
        }

        $("#prevBtn").prop("disabled", currentIndex === 0);
        $("#nextBtn").prop("disabled", currentIndex === words.length - 1);
    }

    function checkTranslation() {
        const currentWord = words[currentIndex];

        if (currentWord.answered) {
            if (currentIndex < words.length - 1) {
                currentIndex++;
                renderCard();
            } else {
                showResultModal();
            }
            return;
        }

        const rawInput = $("#translationInput").val().trim();

        if (rawInput === "") {
            showValidationError("Введіть переклад");
            return;
        }

        const validLettersRegex = /^[а-яА-ЯіІїЇєЄґҐ'\-\s]+$/;
        if (!validLettersRegex.test(rawInput)) {
            showValidationError("Тільки українські літери");
            return;
        }

        const normalizedAnswer = rawInput.toLowerCase();
        const isMatch = currentWord.ua.includes(normalizedAnswer);

        currentWord.answered = true;
        currentWord.isCorrect = isMatch;
        currentWord.userAnswer = rawInput;

        if (isMatch) {
            correctCount++;
            $("#correctCount").text(correctCount);
        } else {
            wrongCount++;
            $("#wrongCount").text(wrongCount);
        }

        $("#wordCard").fadeOut(100, function () {
            renderCard();
            $(this).fadeIn(150);
        });

        const allAnswered = words.every(word => word.answered);
        if (allAnswered) {
            setTimeout(showResultModal, 1000);
        }
    }

    function showValidationError(message) {
        $("#translationInput").addClass("input-error").focus();
        $("#errorMessage").text(message);
    }

    function showResultModal() {
        const total = words.length;
        const percent = Math.round((correctCount / total) * 100);

        let level = "";
        let description = "";

        if (percent >= 90) {
            level = "Високий рівень (Advanced)";
            description = "Чудовий результат.";
        } else if (percent >= 65) {
            level = "Середній рівень (Intermediate)";
            description = "Гарний результат.";
        } else if (percent >= 40) {
            level = "Базовий рівень (Elementary)";
            description = "Базовий рівень знань.";
        } else {
            level = "Початковий рівень (Beginner)";
            description = "Початковий рівень знань.";
        }

        $("#finalPercent").text(percent + "%");
        $("#levelTitle").text(level);
        $("#levelDesc").text(description);
        $("#modalCorrect").text(correctCount);
        $("#modalWrong").text(wrongCount);

        $("#resultModal").css("display", "flex").hide().fadeIn(250);
    }

    $("#wordCard").on("click", function () {
        checkTranslation();
    });

    $("#translationInput").on("keypress", function (e) {
        if (e.which === 13) {
            checkTranslation();
        }
    });

    $("#translationInput").on("input", function () {
        $(this).removeClass("input-error");
        $("#errorMessage").text("");
    });

    $("#prevBtn").on("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            renderCard();
        }
    });

    $("#nextBtn").on("click", function () {
        if (currentIndex < words.length - 1) {
            currentIndex++;
            renderCard();
        }
    });

    $("#showModalBtn").on("click", function () {
        showResultModal();
    });

    $("#closeModalBtn").on("click", function () {
        $("#resultModal").fadeOut(200);
    });

    $("#resultModal").on("click", function (e) {
        if ($(e.target).is("#resultModal")) {
            $(this).fadeOut(200);
        }
    });

    $("#restartBtn").on("click", function () {
        initGame();
    });

    initGame();
});