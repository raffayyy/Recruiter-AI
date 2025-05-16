import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTabProctoringProps {
  maxViolations?: number;
  minTimeAwayMs?: number;
  warningDurationMs?: number;
  onMaxViolationsReached?: () => void;
  onViolation?: () => void;
}

export function useTabProctoring({
  maxViolations = 3,
  minTimeAwayMs = 2000,
  warningDurationMs = 5000,
  onMaxViolationsReached,
  onViolation
}: UseTabProctoringProps = {}) {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const tabWarningTimeoutRef = useRef<number | null>(null);
  const documentHiddenAtRef = useRef<number | null>(null);
  
  // Reset counts
  const resetTabSwitchCount = useCallback(() => {
    setTabSwitchCount(0);
    setShowTabWarning(false);
    if (tabWarningTimeoutRef.current) {
      clearTimeout(tabWarningTimeoutRef.current);
      tabWarningTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the tab
        documentHiddenAtRef.current = Date.now();
        console.log("User left the interview tab");
      } else if (documentHiddenAtRef.current) {
        // User returned to the tab
        const timeAway = Date.now() - documentHiddenAtRef.current;
        documentHiddenAtRef.current = null;
        
        // Only count if they were away for more than the minimum time (to avoid false positives)
        if (timeAway > minTimeAwayMs) {
          const newCount = tabSwitchCount + 1;
          console.log(`Tab switch detected (${newCount}/${maxViolations})`);
          setTabSwitchCount(newCount);
          
          // Show warning
          setShowTabWarning(true);
          
          // Call onViolation callback if provided
          if (onViolation) {
            onViolation();
          }
          
          // Clear any existing timeout
          if (tabWarningTimeoutRef.current) {
            clearTimeout(tabWarningTimeoutRef.current);
          }
          
          // Hide warning after specified duration
          tabWarningTimeoutRef.current = window.setTimeout(() => {
            setShowTabWarning(false);
            tabWarningTimeoutRef.current = null;
          }, warningDurationMs);
          
          // If this is the max violation, call the callback
          if (newCount >= maxViolations && onMaxViolationsReached) {
            console.log(`Maximum tab switches (${maxViolations}) reached`);
            onMaxViolationsReached();
          }
        }
      }
    };
    
    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (tabWarningTimeoutRef.current) {
        clearTimeout(tabWarningTimeoutRef.current);
      }
    };
  }, [tabSwitchCount, maxViolations, minTimeAwayMs, warningDurationMs, onMaxViolationsReached, onViolation]);

  return {
    tabSwitchCount,
    showTabWarning,
    resetTabSwitchCount,
  };
} 