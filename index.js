const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfToImg = require('pdftoimg-js');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.send('✅ PDF to JPG API is running.');
});

app.post('/convert', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No PDF uploaded.');
    }

    try {
        const inputPath = req.file.path;
        const outputDir = 'output_images';

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const images = await pdfToImg.convert(inputPath, {
            format: 'jpg',
            outputdir: outputDir,
            outputname: `converted_${Date.now()}`,
        });

        const firstImage = images[0];
        res.download(firstImage);

        setTimeout(() => {
            fs.unlinkSync(inputPath);
            images.forEach(file => fs.unlinkSync(file));
        }, 10000);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing PDF.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
