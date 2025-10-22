import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create models directory if it doesn't exist
const modelsDir = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log(`Created directory: ${modelsDir}`);
}

// Models to download
const models = [
  {
    name: "Tiny Face Detector Model (Manifest)",
    url: "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json",
    destination: path.join(modelsDir, "tiny_face_detector_model-weights_manifest.json")
  },
  {
    name: "Tiny Face Detector Model (Shard 1)",
    url: "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1",
    destination: path.join(modelsDir, "tiny_face_detector_model-shard1")
  },
  {
    name: "Face Landmark Model (Manifest)",
    url: "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json",
    destination: path.join(modelsDir, "face_landmark_68_model-weights_manifest.json")
  },
  {
    name: "Face Landmark Model (Shard 1)",
    url: "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1",
    destination: path.join(modelsDir, "face_landmark_68_model-shard1")
  },
  {
    name: "Face Recognition Model (Manifest)",
    url: "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json",
    destination: path.join(modelsDir, "face_recognition_model-weights_manifest.json")
  },
  {
    name: "Face Recognition Model (Shard 1)",
    url: "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1",
    destination: path.join(modelsDir, "face_recognition_model-shard1")
  },
  {
    name: "Face Recognition Model (Shard 2)",
    url: "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2",
    destination: path.join(modelsDir, "face_recognition_model-shard2")
  }
];

// Function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file if there was an error
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Download all models sequentially
async function downloadModels() {
  console.log('Starting model downloads...');
  
  for (const model of models) {
    try {
      console.log(`Downloading ${model.name}...`);
      await downloadFile(model.url, model.destination);
      console.log(`✅ Downloaded: ${model.name}`);
    } catch (error) {
      console.error(`❌ Failed to download ${model.name}: ${error.message}`);
    }
  }
  
  console.log('\nDownload process completed!');
  console.log('You can now start the application with "npm run dev"');
}

// Start the download process
downloadModels(); 