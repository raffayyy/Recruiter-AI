import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  throw new Error("VITE_API_URL is not defined in environment variables.");
}

export enum MethodMap {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export const apiRequest = async (
  reqMethod: MethodMap,
  reqEndpoint: string,
  data?: any
) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await axios({
      method: reqMethod,
      url: `${baseURL}${reqEndpoint}`,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      data: data || undefined, // Ensures `data` is only included if it exists
    });
    return response.data;
  } catch (error: any) {
    console.error("API Request Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
