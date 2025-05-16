# Proctoring Setup for Interview Module

This document explains how to set up the proctoring features for the interview module of your recruitment portal.

## Face Detection Setup

The interview module uses face-api.js for face detection and head pose estimation. You need to download the required models to use these features.

### Download Face-API.js Models

1. Create a directory for the models in your public folder:

```bash
mkdir -p public/models
```

2. Download the required models from the face-api.js repository:

```bash
# Face detection model
curl -o public/models/tiny_face_detector_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -o public/models/tiny_face_detector_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Face landmark detection
curl -o public/models/face_landmark_68_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -o public/models/face_landmark_68_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

# Face recognition model
curl -o public/models/face_recognition_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
curl -o public/models/face_recognition_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
curl -o public/models/face_recognition_model-shard2 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
```

Alternatively, you can download the models from the [face-api.js GitHub repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them in your `public/models` directory.

## Proctoring Features Implemented

The following proctoring features have been implemented:

1. **No Face Detection**: Detects when a candidate's face is not visible in the camera frame
2. **Multiple Face Detection**: Detects when more than one face is visible in the camera frame
3. **Head Movement Detection**: Detects when a candidate is looking away (left, right, up, down)
4. **Mobile Device Detection**: Attempts to detect when a candidate is using a mobile device during the interview

## Configuration Options

You can configure the sensitivity and thresholds of the proctoring features in the following files:

- `src/hooks/useFaceDetection.ts`: Configure detection intervals and violation thresholds
- `src/lib/faceDetectionService.ts`: Configure face detection parameters and head pose thresholds

## Installation

After placing the model files in the correct location, install the required dependencies:

```bash
npm install
# or
yarn install
```

## Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Troubleshooting

If you encounter issues with face detection:

1. Check that the model files are correctly placed in the `public/models` directory
2. Ensure you have a working camera that's accessible to the browser
3. Check browser console for any errors related to model loading
4. Ensure adequate lighting for better face detection accuracy 