import { apiRequest, MethodMap } from "./request";

export const getJobsCandidates = () => {
  return apiRequest(MethodMap.GET, `/candidate/my-applications`);
};

export const getResume = () => {
  return apiRequest(MethodMap.GET, `/candidate/resume`);
};