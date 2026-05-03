import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * useGovtAPI Hook
 * Centralized hook for Government (Admin) related API interactions.
 * Handles loading states, errors, and authentication headers.
 */
export const useGovtAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchProjects = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/projects?search=${search}`, getAuthHeader());
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/projects`, projectData, getAuthHeader());
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/vendors`, getAuthHeader());
      return res.data;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Test IRN Verification (Directly calls the mock govt API)
   * Useful for the Admin to verify if the Govt bridge is working.
   */
  const testVerifyIRN = useCallback(async (irn) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/govt/verify-irn`, { irn });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    loading, 
    error, 
    fetchProjects, 
    createProject, 
    fetchVendors,
    testVerifyIRN 
  };
};
