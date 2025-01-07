interface JobRequirements {
  requirements: string[];
  preferredSkills?: string[];
  requiredExperience: number;
  type: string;
  location: string;
}

interface CandidateProfile {
  skills: string[];
  experience: number;
  preferredLocations?: string[];
  preferredTypes?: string[];
}

interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function calculateJobMatch(
  job: JobRequirements,
  candidate: CandidateProfile
): MatchResult {
  try {
    // Normalize skills for comparison
    const normalizedJobSkills = job.requirements.map(s => s.toLowerCase().trim());
    const normalizedCandidateSkills = candidate.skills.map(s => s.toLowerCase().trim());

    // Calculate skill matches
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    normalizedJobSkills.forEach((skill, index) => {
      if (normalizedCandidateSkills.some(candSkill => 
        candSkill.includes(skill) || skill.includes(candSkill)
      )) {
        matchedSkills.push(job.requirements[index]);
      } else {
        missingSkills.push(job.requirements[index]);
      }
    });

    // Calculate scores with safe defaults
    const skillScore = job.requirements.length > 0 
      ? (matchedSkills.length / job.requirements.length) * 50 
      : 0;
    
    const experienceScore = job.requiredExperience > 0 
      ? Math.min(candidate.experience / job.requiredExperience, 1) * 30 
      : 30;
    
    const locationScore = candidate.preferredLocations?.includes(job.location) ? 10 : 0;
    const typeScore = candidate.preferredTypes?.includes(job.type) ? 10 : 0;

    // Calculate total score
    const totalScore = Math.round(skillScore + experienceScore + locationScore + typeScore);

    return {
      score: totalScore,
      matchedSkills,
      missingSkills,
    };
  } catch (error) {
    console.error('Error calculating job match:', error);
    // Return safe defaults if calculation fails
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }
}