import { useReducer, useEffect } from 'react';
import { dashboardStats, recentOrders, topVendors, revenueChartData, orderStatusDistribution } from '../../pages/Data';

// -------- Action types ----------
const FETCH_START  = 'FETCH_START';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR  = 'FETCH_ERROR';

// -------- Initial state ----------
const initialState = {
  stats: null,
  orders: [],
  vendors: [],
  revenueChart: [],
  orderStatus: [],
  loading: true,
  error: null,
};

// -------- Reducer ----------
function reducer(state, action) {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, error: null };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload.stats,
        orders: action.payload.orders,
        vendors: action.payload.vendors,
        revenueChart: action.payload.revenueChart,
        orderStatus: action.payload.orderStatus,
      };
    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// -------- Dummy API simulator ----------
const fetchDashboardData = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: dashboardStats,
        orders: recentOrders,
        vendors: topVendors,
        revenueChart: revenueChartData,
        orderStatus: orderStatusDistribution,
      });
    }, 800); // simulate network delay
  });

// ================ THE HOOK =================
export default function useDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: FETCH_START });

    fetchDashboardData()
      .then((data) => {
        if (!cancelled) dispatch({ type: FETCH_SUCCESS, payload: data });
      })
      .catch((err) => {
        if (!cancelled) dispatch({ type: FETCH_ERROR, payload: err.message });
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}