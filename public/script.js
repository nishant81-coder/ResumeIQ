const resumeInput = document.getElementById("resume");
const fileName = document.getElementById("fileName");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusText = document.getElementById("status");


// Show selected file name
resumeInput.addEventListener("change", () => {

    const file = resumeInput.files[0];

    if (file) {
        fileName.textContent = `Selected: ${file.name}`;
    } else {
        fileName.textContent = "";
    }

});


// Analyze Resume
analyzeBtn.addEventListener("click", async () => {

    const file = resumeInput.files[0];

    // Check file
    if (!file) {

        statusText.textContent =
            "⚠️ Please select your resume first.";

        return;
    }


    // Check file type
    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {

        statusText.textContent =
            "⚠️ Please upload a PDF or DOCX file.";

        return;
    }


    // Create FormData
    const formData = new FormData();

    formData.append("resume", file);


    // Show loading message
    statusText.textContent =
        "⏳ Uploading and analyzing your resume...";

    analyzeBtn.disabled = true;


    try {

        const response = await fetch("/analyze", {

            method: "POST",

            body: formData

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong."
            );

        }


        console.log("Server response:", data);


        statusText.textContent =
            "✅ Resume uploaded successfully!";


        // For now, display demo analysis
        showDemoResults();


    } catch (error) {

        console.error(error);

        statusText.textContent =
            `❌ ${error.message}`;

    }


    analyzeBtn.disabled = false;

});


// Temporary demo results
function showDemoResults() {

    const result = document.getElementById("result");

    result.classList.remove("hidden");


    document.getElementById("resumeScore").textContent =
        "82";

    document.getElementById("atsScore").textContent =
        "76%";

    document.getElementById("skillsCount").textContent =
        "14";

    document.getElementById("missingCount").textContent =
        "5";


    // Skills
    const skills = [
        "C++",
        "Java",
        "Python",
        "HTML",
        "CSS",
        "JavaScript",
        "Git",
        "GitHub"
    ];

    const skillsContainer =
        document.getElementById("skills");

    skillsContainer.innerHTML = "";

    skills.forEach(skill => {

        const span = document.createElement("span");

        span.className = "skill";

        span.textContent = skill;

        skillsContainer.appendChild(span);

    });


    // Missing skills
    const missingSkills = [
        "React",
        "Node.js",
        "MongoDB",
        "REST API",
        "TypeScript"
    ];

    const missingContainer =
        document.getElementById("missingSkills");

    missingContainer.innerHTML = "";

    missingSkills.forEach(skill => {

        const span = document.createElement("span");

        span.className = "skill";

        span.textContent = skill;

        missingContainer.appendChild(span);

    });


    // Experience
    document.getElementById("experience").textContent =
        "Your resume clearly presents your educational background, but the experience section could include more measurable achievements and practical work.";

    
    // Projects
    document.getElementById("projects").textContent =
        "Your projects demonstrate good technical learning. Add technologies used, your specific contribution, and measurable results to make them stronger.";


    // Suggestions
    const suggestions = [
        "Add more measurable achievements to your projects.",
        "Include GitHub links for your major projects.",
        "Use stronger action verbs such as developed, implemented and optimized.",
        "Add relevant technical skills mentioned in your target job description.",
        "Keep your resume concise and ATS-friendly."
    ];


    const suggestionsContainer =
        document.getElementById("suggestions");

    suggestionsContainer.innerHTML = "";

    suggestions.forEach(suggestion => {

        const li = document.createElement("li");

        li.textContent = suggestion;

        suggestionsContainer.appendChild(li);

    });

}