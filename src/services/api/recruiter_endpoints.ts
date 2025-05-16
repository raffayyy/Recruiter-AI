import { apiRequest, MethodMap } from "./request";

export const getJobsRecruiter = () => {
  return apiRequest(MethodMap.GET, `/recruiter/jobs`);
};

export const getRecruiterDashboardApplications = () => {
  return apiRequest(MethodMap.GET, `/recruiter/all-applications`);
}

export const getApplicationFeedback = (applicationId: string) => {
  return apiRequest(MethodMap.GET, `/recruiter/evaluations/${applicationId}`);
}