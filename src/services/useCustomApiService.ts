import { useState, useCallback, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../store/stateContext";
import { ActionType as actions } from "../constants/actions/action.enum";
import apiConfig from "../api.config";

const api = axios.create({
  baseURL: apiConfig.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error,setError]=useState("")
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("StoreContext must be used within a StoreProvider");
  }
  const { dispatch } = context;

  const request = useCallback(
    async (method: string, endpoint: string, data = null) => {
      setLoading(true);
      try {
        const response = await api({ method, url: endpoint, data });
        return response.data;
      } catch (err) {
        setError( (axios.isAxiosError(err) ? err.response?.data.errors[0] || err.message : ""))
        console.error(`${method.toUpperCase()} Error:`, err);
        dispatch({
          type: actions.SET_SNACKBAR,
          payload: [
            {
              message:
                (axios.isAxiosError(err) ? err.response?.data.errors[0] || err.message : ""),
              show: true,
              severity: "error",
              close: () =>
                dispatch({ type: actions.SET_SNACKBAR, payload: [] }),
            },
          ],
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const get = useCallback(
    (endpoint: string) => request("get", endpoint),
    [request]
  );
  const post = useCallback(
    (endpoint: string, data: any) => request("post", endpoint, data),
    [request]
  );
  const put = useCallback(
    (endpoint: string, data: null | undefined) =>
      request("put", endpoint, data),
    [request]
  );
  const patch = useCallback(
    (endpoint: string, data: null | undefined) =>
      request("patch", endpoint, data),
    [request]
  );
  const del = useCallback(
    (endpoint: string) => request("delete", endpoint),
    [request]
  );

  return { get, post, put, patch, del, loading,error};
};

export default useApi;
