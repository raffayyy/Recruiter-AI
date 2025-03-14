import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

export enum method_map {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export const api_request = async (
  req_method: method_map,
  req_endpoint: string,
  data?: any
) => {
  try { 
    const response = await axios({
      method: req_method,
      url: `${baseURL}/${req_endpoint}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
