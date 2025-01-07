import React from 'react';
import { InputField } from '../forms/InputField';
import { Button } from '../ui/Button';

interface Education {
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
}

interface EducationFormProps {
  education: Education;
  onChange: (education: Education) => void;
  onRemove: () => void;
}

export function EducationForm({ education, onChange, onRemove }: EducationFormProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Degree"
          value={education.degree}
          onChange={(e) => onChange({ ...education, degree: e.target.value })}
        />
        <InputField
          label="Field of Study"
          value={education.field}
          onChange={(e) => onChange({ ...education, field: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Institution"
          value={education.institution}
          onChange={(e) => onChange({ ...education, institution: e.target.value })}
        />
        <InputField
          label="Graduation Year"
          type="number"
          value={education.graduationYear}
          onChange={(e) => onChange({ ...education, graduationYear: parseInt(e.target.value) })}
        />
      </div>
      <Button variant="outline" onClick={onRemove} className="w-full text-red-600 hover:bg-red-50">
        Remove Education
      </Button>
    </div>
  );
}