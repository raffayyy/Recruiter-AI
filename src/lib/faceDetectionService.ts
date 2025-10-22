import * as faceapi from 'face-api.js';

// Types for our detection results
export type FaceDetectionResult = {
  faceCount: number;
  noFaceDetected: boolean;
  multipleFacesDetected: boolean;
  headPose: {
    lookingLeft: boolean;
    lookingRight: boolean;
    lookingUp: boolean;
    lookingDown: boolean;
  };
  confidence: number;
};

// Violation types for proctoring
export enum ProctoringViolationType {
  NO_FACE = "NO_FACE",
  MULTIPLE_FACES = "MULTIPLE_FACES",
  LOOKING_AWAY = "LOOKING_AWAY",
  MOBILE_DEVICE = "MOBILE_DEVICE",
}

// Class to handle face detection and analysis
export class FaceDetectionService {
  private modelsLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;
  
  // Initialize and load models
  async initialize(): Promise<void> {
    if (this.modelsLoaded) return;
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    this.loadingPromise = new Promise<void>(async (resolve) => {
      try {
        // Load required models for face detection
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        
        console.log("Face detection models loaded successfully");
        this.modelsLoaded = true;
        resolve();
      } catch (error) {
        console.error("Error loading face detection models:", error);
        // We'll resolve anyway to not block the app, but detection won't work
        resolve();
      }
    });
    
    return this.loadingPromise;
  }
  
  // Main detection function that processes a video element
  async detectFaces(videoElement: HTMLVideoElement): Promise<FaceDetectionResult | null> {
    if (!this.modelsLoaded) {
      console.warn("Face detection models not loaded yet");
      return null;
    }
    
    if (!videoElement || videoElement.readyState < 2) {
      return null;
    }
    
    try {
      // Get full face detection results including landmarks
      const detections = await faceapi.detectAllFaces(
        videoElement, 
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
      ).withFaceLandmarks();
      
      // Build result object
      const result: FaceDetectionResult = {
        faceCount: detections.length,
        noFaceDetected: detections.length === 0,
        multipleFacesDetected: detections.length > 1,
        headPose: {
          lookingLeft: false,
          lookingRight: false,
          lookingUp: false,
          lookingDown: false,
        },
        confidence: detections.length > 0 ? detections[0].detection.score : 0,
      };
      
      // Analyze head pose if a face is detected
      if (detections.length === 1) {
        this.analyzeHeadPose(detections[0], result);
      }
      
      return result;
    } catch (error) {
      console.error("Error during face detection:", error);
      return null;
    }
  }
  
  // Analyze head pose using facial landmarks
  private analyzeHeadPose(
    detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>, 
    result: FaceDetectionResult
  ): void {
    const landmarks = detection.landmarks;
    const positions = landmarks.positions;
    
    // Get key points for analysis
    const leftEye = this.getAveragePosition(positions.slice(36, 42));
    const rightEye = this.getAveragePosition(positions.slice(42, 48));
    const nose = positions[30];
    const leftMouth = positions[48];
    const rightMouth = positions[54];
    
    // Calculate face dimensions
    const faceWidth = Math.sqrt(
      Math.pow(leftEye.x - rightEye.x, 2) + 
      Math.pow(leftEye.y - rightEye.y, 2)
    );
    
    // Calculate eye-to-nose distances
    const leftEyeToNoseDistance = this.getDistance(leftEye, nose);
    const rightEyeToNoseDistance = this.getDistance(rightEye, nose);
    
    // Determine horizontal head rotation
    const eyeDistanceRatio = leftEyeToNoseDistance / rightEyeToNoseDistance;
    result.headPose.lookingLeft = eyeDistanceRatio < 0.75;
    result.headPose.lookingRight = eyeDistanceRatio > 1.25;
    
    // Calculate vertical position of nose relative to eye line
    const eyeLine = (leftEye.y + rightEye.y) / 2;
    const mouthLine = (leftMouth.y + rightMouth.y) / 2;
    const eyeToMouthDistance = mouthLine - eyeLine;
    
    // Determine vertical head rotation
    const noseToEyeVertical = nose.y - eyeLine;
    const verticalRatio = noseToEyeVertical / eyeToMouthDistance;
    
    result.headPose.lookingUp = verticalRatio < 0.25;
    result.headPose.lookingDown = verticalRatio > 0.6;
  }
  
  // Helper to get average position of multiple points
  private getAveragePosition(points: faceapi.Point[]): faceapi.Point {
    const sum = points.reduce(
      (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
      { x: 0, y: 0 }
    );
    
    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    };
  }
  
  // Helper to calculate distance between two points
  private getDistance(p1: faceapi.Point, p2: faceapi.Point): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
}

export const faceDetectionService = new FaceDetectionService(); 