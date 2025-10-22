import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertOctagon } from 'lucide-react';

interface TabProctoringProps {
  maxViolations?: number;
  minTimeAwayMs?: number;
  warningDurationMs?: number;
  briefSwitchThresholdMs?: number; // New threshold for brief tab switches
  briefSwitchesToIgnore?: number; // How many brief switches to allow
  onMaxViolationsReached?: (count: number) => void;
}

export const TabProctoring: React.FC<TabProctoringProps> = ({
  maxViolations = 3,
  minTimeAwayMs = 2000, // Minimum time away to count as violation
  warningDurationMs = 5000,
  briefSwitchThresholdMs = 500, // Switches under 500ms are considered "brief"
  briefSwitchesToIgnore = 3, // Allow 3 brief switches without penalty
  onMaxViolationsReached
}) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [briefSwitchCount, setBriefSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const warningTimeoutRef = useRef<number | null>(null);
  const documentHiddenAtRef = useRef<number | null>(null);
  
  // Memoize the status color function to prevent unnecessary recalculations
  const getStatusColor = useCallback(() => {
    if (tabSwitchCount === 0) return "bg-gray-700";
    if (tabSwitchCount === maxViolations - 1) return "bg-yellow-600";
    if (tabSwitchCount >= maxViolations) return "bg-red-600";
    return "bg-orange-600";
  }, [tabSwitchCount, maxViolations]);
  
  // Memoize the showing of warning to prevent unnecessary state updates
  const showWarningWithMessage = useCallback((message: string) => {
    // Only update if the message is different or the warning isn't showing
    if (!showWarning || message !== warningMessage) {
      setShowWarning(true);
      setWarningMessage(message);
      
      // Clear any existing timeout
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      
      // Hide warning after specified duration
      warningTimeoutRef.current = window.setTimeout(() => {
        setShowWarning(false);
        warningTimeoutRef.current = null;
      }, warningDurationMs);
    }
  }, [showWarning, warningMessage, warningDurationMs]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();
      
      if (document.hidden) {
        // User switched away from the tab
        documentHiddenAtRef.current = now;
        console.log("Tab proctoring: User left the interview tab");
      } else if (documentHiddenAtRef.current) {
        // User returned to the tab - calculate time away
        const timeAway = now - documentHiddenAtRef.current;
        const hiddenTime = documentHiddenAtRef.current;
        documentHiddenAtRef.current = null;
        
        console.log(`Tab proctoring: User returned after ${timeAway}ms`);
        
        // Check if this was a brief switch (e.g., Alt+Tab accident)
        if (timeAway < briefSwitchThresholdMs) {
          // Handle brief switches differently
          const newBriefCount = briefSwitchCount + 1;
          setBriefSwitchCount(newBriefCount);
          
          // Only show a gentle warning for brief switches
          if (newBriefCount > briefSwitchesToIgnore) {
            // Too many brief switches also count as a violation
            const newViolationCount = tabSwitchCount + 1;
            setTabSwitchCount(newViolationCount);
            
            showWarningWithMessage(`Multiple brief tab switches detected! (${newViolationCount}/${maxViolations})`);
            
            // Reset brief count after converting to a violation
            setBriefSwitchCount(0);
            
            // Check if this puts us at the max violations
            if (newViolationCount >= maxViolations && onMaxViolationsReached) {
              console.log(`Tab proctoring: Maximum violations (${maxViolations}) reached from brief switches`);
              onMaxViolationsReached(newViolationCount);
            }
          } else {
            // Just a brief notification for brief switches, if we're starting to accumulate them
            if (newBriefCount > 1) {
              showWarningWithMessage(`Brief tab switch detected (${newBriefCount}/${briefSwitchesToIgnore} allowed)`);
            }
          }
        } 
        // Standard violation for longer switches
        else if (timeAway > minTimeAwayMs) {
          const newCount = tabSwitchCount + 1;
          console.log(`Tab proctoring: Tab switch violation detected (${newCount}/${maxViolations})`);
          setTabSwitchCount(newCount);
          
          // Show appropriate warning based on violation count
          if (newCount >= maxViolations - 1) {
            showWarningWithMessage(`Tab switching detected! (${newCount}/${maxViolations}) - Final warning!`);
          } else {
            showWarningWithMessage(`Tab switching detected! (${newCount}/${maxViolations})`);
          }
          
          // If this is the max violation, trigger the callback
          if (newCount >= maxViolations && onMaxViolationsReached) {
            console.log(`Tab proctoring: Maximum violations (${maxViolations}) reached`);
            onMaxViolationsReached(newCount);
          }
        }
      }
    };
    
    // Memoize visibility handler with a cleanup reference
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
    };
  }, [
    tabSwitchCount, 
    briefSwitchCount, 
    maxViolations, 
    minTimeAwayMs, 
    briefSwitchThresholdMs,
    briefSwitchesToIgnore,
    onMaxViolationsReached,
    showWarningWithMessage
  ]);

  // Memoized badge color
  const statusColor = getStatusColor();

  return (
    <>
      {/* Counter badge */}
      <div className="flex items-center gap-3 text-sm text-white">
        {briefSwitchCount > 0 && (
          <span className="px-2 py-1 rounded bg-gray-600 text-xs">
            Brief: {briefSwitchCount}/{briefSwitchesToIgnore}
          </span>
        )}
        <span className={`px-2 py-1 rounded ${statusColor}`}>
          Tab switches: {tabSwitchCount}/{maxViolations}
        </span>
      </div>
      
      {/* Warning notification */}
      {showWarning && (
        <div className="fixed top-16 left-4 z-50 animate-pulse rounded-lg bg-red-600 p-3 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5" />
            <span className="font-medium">{warningMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}; 