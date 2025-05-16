import { useState, useEffect, useRef } from 'react';
import { faceDetectionService, FaceDetectionResult, ProctoringViolationType } from '../lib/faceDetectionService';

export type FaceViolation = {
  type: ProctoringViolationType;
  message: string;
  timestamp: number;
  active: boolean;
};

type UseFaceDetectionOptions = {
  enabled?: boolean;
  detectionInterval?: number;
  violationTimeout?: number;
  onViolation?: (violation: FaceViolation) => void;
  violationDisplayDuration?: number;
};

const DEFAULT_DETECTION_INTERVAL = 1000; // 1 second
const DEFAULT_VIOLATION_TIMEOUT = 2000; // 2 seconds
const DEFAULT_VIOLATION_DISPLAY_DURATION = 3000; // Show for 3 seconds after resolving

export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  options: UseFaceDetectionOptions = {}
) {
  const {
    enabled = true,
    detectionInterval = DEFAULT_DETECTION_INTERVAL,
    violationTimeout = DEFAULT_VIOLATION_TIMEOUT,
    onViolation,
    violationDisplayDuration = DEFAULT_VIOLATION_DISPLAY_DURATION,
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [detectionResult, setDetectionResult] = useState<FaceDetectionResult | null>(null);
  const [violations, setViolations] = useState<FaceViolation[]>([]);
  const [isMobileDeviceDetected, setIsMobileDeviceDetected] = useState(false);
  
  // Timer references for detection interval and cleanup
  const detectionTimerRef = useRef<number | null>(null);
  const violationStatesRef = useRef({
    noFaceDetectedSince: 0,
    multipleFacesDetectedSince: 0,
    lookingAwaySince: 0,
    mobileDeviceDetectedSince: 0,
  });
  
  // Track active violations and their timers
  const activeViolationsRef = useRef<Record<ProctoringViolationType, {
    active: boolean,
    timerId: number | null,
  }>>({
    [ProctoringViolationType.NO_FACE]: { active: false, timerId: null },
    [ProctoringViolationType.MULTIPLE_FACES]: { active: false, timerId: null },
    [ProctoringViolationType.LOOKING_AWAY]: { active: false, timerId: null },
    [ProctoringViolationType.MOBILE_DEVICE]: { active: false, timerId: null },
  });

  // Helper to check if a violation threshold has been reached
  const checkViolationThreshold = (
    current: boolean,
    sinceRef: keyof typeof violationStatesRef.current,
    type: ProctoringViolationType,
    message: string
  ) => {
    const now = Date.now();
    
    if (current) {
      // If violation wasn't already tracked, start tracking it
      if (violationStatesRef.current[sinceRef] === 0) {
        violationStatesRef.current[sinceRef] = now;
      }
      
      // Check if violation threshold is reached
      if (
        violationStatesRef.current[sinceRef] > 0 &&
        now - violationStatesRef.current[sinceRef] >= violationTimeout
      ) {
        // Update active status for this violation type
        activeViolationsRef.current[type].active = true;
        
        // Clear any existing timer for this violation type
        if (activeViolationsRef.current[type].timerId !== null) {
          window.clearTimeout(activeViolationsRef.current[type].timerId);
          activeViolationsRef.current[type].timerId = null;
        }
        
        // Create a new violation
        const newViolation: FaceViolation = {
          type,
          message,
          timestamp: now,
          active: true,
        };
        
        // Add to violations list
        setViolations(prev => {
          // Remove any existing violation of same type
          const filtered = prev.filter(v => v.type !== type);
          return [...filtered, newViolation];
        });
        
        // Call onViolation callback if provided
        if (onViolation) {
          onViolation(newViolation);
        }
        
        // Reset the timer after reporting
        violationStatesRef.current[sinceRef] = now;
      }
    } else {
      // Reset the timer if no violation is detected
      violationStatesRef.current[sinceRef] = 0;
      
      // If this violation was active, mark it as inactive after a delay
      if (activeViolationsRef.current[type].active) {
        // Mark violation as inactive, but keep it displayed for a moment
        setViolations(prev => 
          prev.map(v => 
            v.type === type 
              ? { ...v, active: false, timestamp: now } 
              : v
          )
        );
        
        // Clear existing timer if any
        if (activeViolationsRef.current[type].timerId !== null) {
          window.clearTimeout(activeViolationsRef.current[type].timerId);
        }
        
        // Set a timer to completely remove the violation after display duration
        const timerId = window.setTimeout(() => {
          activeViolationsRef.current[type].active = false;
          
          // Remove this violation from the display list
          setViolations(prev => prev.filter(v => v.type !== type));
          activeViolationsRef.current[type].timerId = null;
        }, violationDisplayDuration);
        
        activeViolationsRef.current[type].timerId = timerId;
      }
    }
  };

  // Initialize face detection service
  useEffect(() => {
    if (!enabled) return;
    
    const initializeDetection = async () => {
      try {
        await faceDetectionService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize face detection:', error);
      }
    };
    
    initializeDetection();
  }, [enabled]);

  // Modified: More accurate mobile device detection using only orientation changes
  useEffect(() => {
    if (!enabled) return;
    
    // Instead of detecting mobile devices just by orientation data presence,
    // we'll detect significant orientation changes which indicate active mobile usage
    const initialOrientation = { beta: 0, gamma: 0 };
    let hasInitialReading = false;
    const movementThreshold = 15; // Degrees of movement to consider it a violation
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      
      // Capture initial orientation on first reading
      if (!hasInitialReading) {
        initialOrientation.beta = event.beta;
        initialOrientation.gamma = event.gamma;
        hasInitialReading = true;
        return;
      }
      
      // Check for significant changes in orientation (actual device movement)
      const betaChange = Math.abs(event.beta - initialOrientation.beta);
      const gammaChange = Math.abs(event.gamma - initialOrientation.gamma);
      
      if (betaChange > movementThreshold || gammaChange > movementThreshold) {
        console.log(`Significant device movement detected: beta=${betaChange}°, gamma=${gammaChange}°`);
        setIsMobileDeviceDetected(true);
      }
    };
    
    window.addEventListener('deviceorientation', handleOrientation);
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled]);

  // Remove the user agent and screen size check entirely as it causes too many false positives
  // This was previously detecting the device type, not actual mobile usage during the interview
  
  // Run face detection at regular intervals
  useEffect(() => {
    if (!enabled || !isInitialized || !videoRef.current) return;
    
    const runDetection = async () => {
      if (!videoRef.current) return;
      
      const result = await faceDetectionService.detectFaces(videoRef.current);
      
      if (result) {
        setDetectionResult(result);
        
        // Check for no face detection
        checkViolationThreshold(
          result.noFaceDetected,
          'noFaceDetectedSince',
          ProctoringViolationType.NO_FACE,
          'No face detected in camera'
        );
        
        // Check for multiple faces
        checkViolationThreshold(
          result.multipleFacesDetected,
          'multipleFacesDetectedSince',
          ProctoringViolationType.MULTIPLE_FACES,
          'Multiple faces detected in camera'
        );
        
        // Check for looking away (any direction)
        const isLookingAway = 
          result.headPose.lookingLeft || 
          result.headPose.lookingRight || 
          result.headPose.lookingUp || 
          result.headPose.lookingDown;
          
        checkViolationThreshold(
          isLookingAway,
          'lookingAwaySince',
          ProctoringViolationType.LOOKING_AWAY,
          'Candidate is looking away from the camera'
        );
      }
      
      // Also check mobile device detection but with higher threshold
      if (isMobileDeviceDetected) {
        checkViolationThreshold(
          isMobileDeviceDetected,
          'mobileDeviceDetectedSince',
          ProctoringViolationType.MOBILE_DEVICE,
          'Mobile device usage detected'
        );
      } else {
        // Ensure mobile device detection is cleared when not active
        checkViolationThreshold(
          false,
          'mobileDeviceDetectedSince', 
          ProctoringViolationType.MOBILE_DEVICE,
          'Mobile device usage detected'
        );
      }
      
      // Schedule next detection
      detectionTimerRef.current = window.setTimeout(runDetection, detectionInterval);
    };
    
    // Start initial detection
    runDetection();
    
    // Cleanup on unmount
    return () => {
      if (detectionTimerRef.current) {
        clearTimeout(detectionTimerRef.current);
      }
      
      // Clear all violation timers
      Object.values(activeViolationsRef.current).forEach(v => {
        if (v.timerId !== null) {
          window.clearTimeout(v.timerId);
        }
      });
    };
  }, [enabled, isInitialized, videoRef, detectionInterval, violationTimeout, violationDisplayDuration, onViolation, isMobileDeviceDetected]);

  // Function to manually clear all violations
  const clearViolations = () => {
    // Clear all violation timers
    Object.entries(activeViolationsRef.current).forEach(([type, data]) => {
      if (data.timerId !== null) {
        window.clearTimeout(data.timerId);
        activeViolationsRef.current[type as ProctoringViolationType].timerId = null;
        activeViolationsRef.current[type as ProctoringViolationType].active = false;
      }
    });
    
    // Reset violation states
    Object.keys(violationStatesRef.current).forEach(key => {
      violationStatesRef.current[key as keyof typeof violationStatesRef.current] = 0;
    });
    
    // Clear violations list
    setViolations([]);
  };

  return {
    detectionResult,
    violations,
    isMobileDeviceDetected,
    clearViolations,
  };
} 