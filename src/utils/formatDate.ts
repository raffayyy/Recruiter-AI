export function formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', // Use 'short' for abbreviated month names
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Set to true for 12-hour format
    };
  
    return date.toLocaleString('en-US', options);
  }

  formatDate('2022-01-01T12:00:00Z'); // Output: "January 1, 2022, 12:00:00"
  