import { apiRequest, MethodMap } from "./request";

export const getJobsCandidates = () => {
  return apiRequest(MethodMap.GET, `/candidate/my-applications`);
};

export const getResume = () => {
  return apiRequest(MethodMap.GET, `/candidate/resume`);
};

export const endInterview = (applicationId: string) =>{
  return apiRequest(MethodMap.POST, `/interview/end/${applicationId}`)
}

export const getCandidateJobDetails = (jobId: string) =>{
  return apiRequest(MethodMap.GET, `/candidate/jobs/${jobId}`)
}