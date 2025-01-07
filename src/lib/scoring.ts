interface SkillMatch {
  skill: string;
  weight: number;
  match: boolean;
}

export function calculateJobAlignment(
  jobRequirements: string[],
  candidateSkills: string[],
  experience: number,
  requiredExperience: number
): number {
  // Normalize skills for comparison
  const normalizedJobSkills = jobRequirements.map(s => s.toLowerCase().trim());
  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase().trim());

  // Calculate skill matches with weights
  const skillMatches: SkillMatch[] = normalizedJobSkills.map(skill => ({
    skill,
    weight: skill.includes('required') ? 2 : 1,
    match: normalizedCandidateSkills.some(candSkill => candSkill.includes(skill))
  }));

  // Calculate experience score (30% of total)
  const experienceScore = Math.min(experience / requiredExperience, 1) * 30;

  // Calculate skills score (70% of total)
  const totalWeight = skillMatches.reduce((sum, match) => sum + match.weight, 0);
  const matchedWeight = skillMatches
    .filter(match => match.match)
    .reduce((sum, match) => sum + match.weight, 0);
  const skillsScore = (matchedWeight / totalWeight) * 70;

  // Return total score
  return Math.round(experienceScore + skillsScore);
}