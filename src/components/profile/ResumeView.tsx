// src/components/profile/ResumeView.tsx
import { Briefcase, GraduationCap, Award, Code, FileText } from 'lucide-react';

interface ResumeDetails {
  name: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
  }>;
  experience: Array<{
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    responsibilities: string;
  }>;
  skills: string[];
  certifications: Array<{
    title: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  projects: Array<{
    project_title: string;
    description: string;
    technologies: string;
  }>;
  achievements: string[];
}

interface ResumeViewProps {
  resume: ResumeDetails;
}

export function ResumeView({ resume }: ResumeViewProps) {
  return (
    <div className="space-y-6">
      {/* Header with Name and Contact */}
      {/* Header with Name and Contact */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{resume?.name}</h2>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p>{resume?.contact?.email} • {resume?.contact?.phone}</p>
          <p>{resume?.contact?.address}</p>
        </div>
      </div>
      {/* Experience Section */}
      <div>
        <div className="flex items-center mb-3">
          <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h3>
        </div>
        <div className="space-y-4">
          {resume?.experience?.map((exp, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">{exp?.job_title}</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{exp?.company}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {exp?.start_date} - {exp?.end_date}
              </p>
              {exp?.responsibilities && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{exp?.responsibilities}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div>
        <div className="flex items-center mb-3">
          <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
        </div>
        <div className="space-y-4">
          {resume?.education?.map((edu, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{edu.institution}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {edu.start_date} - {edu.end_date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <div className="flex items-center mb-3">
          <Code className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume?.skills?.map((skill, index) => (
            <span 
              key={index} 
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center mb-3">
          <FileText className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h3>
        </div>
        <div className="space-y-4">
          {resume?.projects?.map((project, index) => (
            <div key={index} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <h4 className="font-medium text-gray-900 dark:text-white">{project.project_title}</h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
              <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                Technologies: {project.technologies}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div>
        <div className="flex items-center mb-3">
          <Award className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certifications</h3>
        </div>
        <ul className="list-disc pl-6 space-y-1">
          {resume?.certifications?.map((cert, index) => (
            <li key={index}>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {cert.title} - {cert.issuer} {cert.date && `(${cert.date})`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Achievements Section */}
      <div>
        <div className="flex items-center mb-3">
          <Award className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
        </div>
        <ul className="list-disc pl-6 space-y-1">
          {resume?.achievements?.map((achievement, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}