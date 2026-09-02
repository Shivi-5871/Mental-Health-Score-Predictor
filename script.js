// ==============================
// API URL
// ==============================

const API_URL =
    // "http://127.0.0.1:8000/predict";
    "https://mental-health-score-predictor-mjw1.onrender.com";


// ==============================
// ELEMENTS
// ==============================

const form =
    document.getElementById(
        "predictionForm"
    );


const predictButton =
    document.getElementById(
        "predictButton"
    );


const resultCard =
    document.getElementById(
        "resultCard"
    );


const predictionResult =
    document.getElementById(
        "predictionResult"
    );


const errorMessage =
    document.getElementById(
        "errorMessage"
    );


// ==============================
// FORM SUBMISSION
// ==============================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Hide previous results
        resultCard.classList.add(
            "hidden"
        );


        errorMessage.classList.add(
            "hidden"
        );


        // Get form values
        const formData = {

            age:
                parseInt(
                    document.getElementById(
                        "age"
                    ).value
                ),

            gender:
                document.getElementById(
                    "gender"
                ).value,

            country:
                document.getElementById(
                    "country"
                ).value,

            academic_level:
                document.getElementById(
                    "academic_level"
                ).value,

            most_used_platform:
                document.getElementById(
                    "most_used_platform"
                ).value,

            purpose_of_use:
                document.getElementById(
                    "purpose_of_use"
                ).value,

            avg_daily_usage_hours:
                parseFloat(
                    document.getElementById(
                        "avg_daily_usage_hours"
                    ).value
                ),

            daily_unlocks:
                parseInt(
                    document.getElementById(
                        "daily_unlocks"
                    ).value
                ),

            study_hours:
                parseFloat(
                    document.getElementById(
                        "study_hours"
                    ).value
                ),

            physical_activity_hours:
                parseFloat(
                    document.getElementById(
                        "physical_activity_hours"
                    ).value
                ),

            sleep_hours_per_night:
                parseFloat(
                    document.getElementById(
                        "sleep_hours_per_night"
                    ).value
                ),

            stress_level:
                document.getElementById(
                    "stress_level"
                ).value

        };


        // Basic frontend validation
        if (
            !validateData(
                formData
            )
        ) {

            return;

        }


        // Show loading state
        setLoading(
            true
        );


        try {

            // ==========================
            // FETCH API REQUEST
            // ==========================

            const response =
                await fetch(
                    API_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                formData
                            )

                    }
                );


            // Convert response to JSON
            const data =
                await response.json();


            // ==========================
            // HANDLE ERRORS
            // ==========================

            if (
                !response.ok
            ) {

                let message =
                    "Something went wrong.";

                // FastAPI validation errors
                if (
                    data.detail
                ) {

                    if (
                        Array.isArray(
                            data.detail
                        )
                    ) {

                        message =
                            data.detail
                                .map(
                                    error =>
                                        `${error.loc.slice(-1)[0]}: ${error.msg}`
                                )
                                .join(
                                    ", "
                                );

                    }

                    else {

                        message =
                            data.detail;

                    }

                }


                throw new Error(
                    message
                );

            }


            // ==========================
            // DISPLAY RESULT
            // ==========================

            predictionResult.textContent =
                data.predicted_mental_health_score;


            resultCard.classList.remove(
                "hidden"
            );


            // Scroll result into view
            setTimeout(
                () => {

                    resultCard.scrollIntoView(
                        {

                            behavior:
                                "smooth",

                            block:
                                "center"

                        }
                    );

                },
                200
            );


        }


        catch (
            error
        ) {

            showError(
                error.message ||
                "Unable to connect to the prediction API. Please make sure your FastAPI server is running."
            );

        }


        finally {

            // Remove loading state
            setLoading(
                false
            );

        }

    }
);


// ==============================
// LOADING FUNCTION
// ==============================

function setLoading(
    isLoading
) {

    if (
        isLoading
    ) {

        predictButton.classList.add(
            "loading"
        );

        predictButton.disabled =
            true;

    }


    else {

        predictButton.classList.remove(
            "loading"
        );

        predictButton.disabled =
            false;

    }

}


// ==============================
// ERROR FUNCTION
// ==============================

function showError(
    message
) {

    errorMessage.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );


    errorMessage.scrollIntoView(
        {

            behavior:
                "smooth",

            block:
                "center"

        }
    );

}


// ==============================
// VALIDATION FUNCTION
// ==============================

function validateData(
    data
) {

    // Age validation
    if (
        data.age < 10 ||
        data.age > 100
    ) {

        showError(
            "Age must be between 10 and 100."
        );

        return false;

    }


    // Hours validation
    const hourFields = [

        {
            name:
                "Average daily usage hours",

            value:
                data.avg_daily_usage_hours
        },

        {
            name:
                "Study hours",

            value:
                data.study_hours
        },

        {
            name:
                "Physical activity hours",

            value:
                data.physical_activity_hours
        },

        {
            name:
                "Sleep hours",

            value:
                data.sleep_hours_per_night
        }

    ];


    for (
        const field
        of
        hourFields
    ) {

        if (
            field.value < 0 ||
            field.value > 24
        ) {

            showError(
                `${field.name} must be between 0 and 24.`
            );

            return false;

        }

    }


    // Daily unlock validation
    if (
        data.daily_unlocks < 0
    ) {

        showError(
            "Daily unlocks cannot be negative."
        );

        return false;

    }


    return true;

}



// ==========================================
// AI SCORE VISUALIZER
// ADDITIONAL FUNCTIONALITY
// ==========================================


const animatedScore =
    document.getElementById(
        "animatedScore"
    );


const scoreStatus =
    document.getElementById(
        "scoreStatus"
    );


const analysisTitle =
    document.getElementById(
        "analysisTitle"
    );


const analysisText =
    document.getElementById(
        "analysisText"
    );


const scaleProgress =
    document.getElementById(
        "scaleProgress"
    );


const signalStrength =
    document.getElementById(
        "signalStrength"
    );


const progressCircle =
    document.querySelector(
        ".progress-value"
    );


// Circle circumference

const circleRadius = 95;

const circumference =
    2 *
    Math.PI *
    circleRadius;


// ==========================================
// WATCH EXISTING RESULT
// ==========================================

const scoreObserver =
    new MutationObserver(
        function () {

            const score =
                parseFloat(
                    predictionResult.textContent
                );


            if (
                !isNaN(score)
            ) {

                updateVisualizer(
                    score
                );

            }

        }
    );



scoreObserver.observe(
    predictionResult,
    {

        childList: true,

        characterData: true,

        subtree: true

    }
);


// ==========================================
// UPDATE VISUALIZER
// ==========================================

function updateVisualizer(
    score
) {

    // Determine percentage
    // Assumes score is out of 10

    const percentage =
        Math.min(
            Math.max(
                (score / 10) * 100,
                0
            ),
            100
        );


    // Update animated number

    animateScore(
        score
    );


    // Update circular progress

    const offset =
        circumference -
        (
            percentage / 100
        ) *
        circumference;


    progressCircle.style.strokeDashoffset =
        offset;


    // Update progress scale

    scaleProgress.style.width =
        `${percentage}%`;


    // Update text based on score

    updateScoreStatus(
        score
    );


    // Update AI analysis

    analysisTitle.textContent =
        "Analysis complete";


    analysisText.textContent =
        "The machine learning model has processed your academic, lifestyle and digital activity information.";


    signalStrength.textContent =
        "Strong Signal";

}


// ==========================================
// ANIMATE SCORE NUMBER
// ==========================================

function animateScore(
    finalScore
) {

    const duration =
        1200;


    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const currentScore =
            progress *
            finalScore;


        animatedScore.textContent =
            currentScore.toFixed(
                2
            );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );

        }

        else {

            animatedScore.textContent =
                finalScore.toFixed(
                    2
                );

        }

    }


    requestAnimationFrame(
        update
    );

}


// ==========================================
// SCORE STATUS
// ==========================================

function updateScoreStatus(
    score
) {

    if (
        score < 4
    ) {

        scoreStatus.textContent =
            "Needs attention";


        signalStrength.textContent =
            "Low Signal";

    }


    else if (
        score < 7
    ) {

        scoreStatus.textContent =
            "Moderate range";


        signalStrength.textContent =
            "Moderate Signal";

    }


    else {

        scoreStatus.textContent =
            "Strong mental wellness";


        signalStrength.textContent =
            "Strong Signal";

    }

}


// ==========================================
// DETECT LOADING STATE
// ==========================================

const buttonObserver =
    new MutationObserver(
        function () {

            if (
                predictButton.classList.contains(
                    "loading"
                )
            ) {

                showAnalyzingState();

            }

        }
    );


buttonObserver.observe(
    predictButton,
    {

        attributes: true,

        attributeFilter:
            [
                "class"
            ]

    }
);


// ==========================================
// SHOW ANALYZING STATE
// ==========================================

function showAnalyzingState() {

    animatedScore.textContent =
        "--";


    scoreStatus.textContent =
        "Reading the signal...";


    analysisTitle.textContent =
        "Running AI analysis";


    analysisText.textContent =
        "Running your habits through the machine learning model...";


    signalStrength.textContent =
        "Processing";


    scaleProgress.style.width =
        "0%";


    progressCircle.style.strokeDashoffset =
        circumference;

}