const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Serve frontend
app.use(express.static("public"));


// File upload
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


// Analyze resume
app.post("/analyze", upload.single("resume"), async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                error: "Please upload a resume."
            });

        }

        let resumeText = "";


        // PDF
        if (req.file.mimetype === "application/pdf") {

            const data = await pdfParse(req.file.buffer);

            resumeText = data.text;
        }


        // DOCX
        else if (
            req.file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {

            const data = await mammoth.extractRawText({
                buffer: req.file.buffer
            });

            resumeText = data.value;
        }


        // Unsupported file
        else {

            return res.status(400).json({
                error: "Only PDF and DOCX files are supported."
            });

        }


        console.log("--------------------------------");
        console.log("Resume received:");
        console.log(req.file.originalname);

        console.log("Characters extracted:");
        console.log(resumeText.length);

        console.log("--------------------------------");


        res.json({

            message: "Resume uploaded successfully.",

            fileName: req.file.originalname,

            textLength: resumeText.length

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: "Failed to process the resume."

        });

    }

});


// Start server
const PORT = 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log("       ResumeIQ is running");
    console.log("=================================");
    console.log("");
    console.log(`Open: http://localhost:${PORT}`);
    console.log("");

});