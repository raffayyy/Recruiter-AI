import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseIcon } from "lucide-react";
import { CandidateForm } from "../../components/auth/CandidateForm";
import { RecruiterForm } from "../../components/auth/RecruiterForm";
import { RoleSelector } from "../../components/auth/RoleSelector";
import { useAuth } from "../../contexts/AuthContext";
import type { CandidateFormData } from "../../types/candidate";
import type { RecruiterFormData } from "../../types/recruiter";

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<
    "candidate" | "recruiter" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (selectedRole === "recruiter") {
        const recruiterData: RecruiterFormData = {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          company_name: formData.company_name,
          job_title: formData.job_title,
          industry: formData.industry,
          company_summary: formData.company_summary,
          role: "recruiter",
        };
        await register(recruiterData);
      } else {
        const candidateData: CandidateFormData = {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          current_job_title: formData.current_job_title,
          years_of_experience: Number(formData.years_of_experience),
          highest_education: formData.highest_education,
          skills: formData.skills,
          brief_intro: formData.brief_intro,
          role: "candidate",
        };
        await register(candidateData);
      }
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-4 sm:w-1/2 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-2 shadow-lg">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
              Recruiter.AI
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join thousands of professionals on our platform
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {!selectedRole ? (
            <RoleSelector onSelect={setSelectedRole} />
          ) : selectedRole === "candidate" ? (
            <CandidateForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <RecruiterForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden bg-gradient-to-br from-blue-500 to-blue-600 sm:block sm:w-1/2">
        <div className="flex h-full flex-col items-center justify-center px-8 text-white">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-4xl font-bold">Join Our Community</h1>
            <p className="mb-8 text-lg text-blue-100">
              Connect with top companies and talent in your industry
            </p>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2940"
              alt="Community"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
