import axios from "axios";
import ACTIONS from "./app.constants";
import { getDataFromJson } from "../utils/getDataFromJson";
import dayjs from "dayjs"; // Install with: npm install dayjs
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

//"BASE_URL": "https://localhost:5001/api"

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

let BASE_URL = "";
let isBaseUrlSet = false;

const setBaseUrl = async () => {
  const configData = await getDataFromJson();
  BASE_URL = configData?.API_URL;
  isBaseUrlSet = true;
};

setBaseUrl();

// Action Creators
const setUser = (userObj) => {
  // Store userType in localStorage
  const userData = {
    username: userObj.username,
    userId: userObj.userId,
    userType: userObj.userType,
    branchCode: userObj.branchCode,
  };
  localStorage.setItem("redux", JSON.stringify({ user: userData }));

  return {
    type: ACTIONS.SET_USER,
    payload: userData,
  };
};

const setLoginError = (error) => {
  return {
    type: ACTIONS.SET_LOGIN_ERROR,
    payload: { error },
  };
};

const setSignupError = (error) => {
  return {
    type: ACTIONS.SET_SIGNUP_ERROR,
    payload: { error },
  };
};

const signIn = (userObj) => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.SIGN_IN,
  });
  axios
    .post(
      `${BASE_URL}/Login?userName=${userObj.username}&password=${userObj.password}`,
      {},
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      }
    )
    .then(function (response) {
      // handle success
      if (response.data) {
        dispatch(
          setUser({
            username: response.data.fullName,
            userId: response.data.userId,
            userType: response.data.userType,
            branchCode: response.data.branchCode,
          })
        );
      } else {
        dispatch(setLoginError("Incorrect username or password"));
      }
    })
    .catch(function (error) {
      // handle error
      let errorMessage = "Network Error";
      if (error.response) {
        errorMessage = error.response.data.message;
        errorMessage =
          errorMessage === "WRONG_CREDENTIAL"
            ? "Incorrect username or password"
            : errorMessage;
        //User does not exist. Sign up for an account
      }
      dispatch(setLoginError(errorMessage));
    })
    .then(function () {
      // always executed
    });
};

const signUp = (userObj) => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.SIGN_UP,
  });
  axios({
    method: "post",
    url: "http://localhost:3000/api/user/register ",
    data: {
      username: userObj.username,
      password: userObj.password,
    },
  })
    .then(function (response) {
      // handle success
      if (response.data.userId) {
        dispatch({
          type: ACTIONS.SIGN_UP_COMPLETE,
        });
        dispatch(signIn(userObj)); //Auto login on successful register
      }
    })
    .catch(function (error) {
      // handle error
      let errorMessage = "Network Error";
      if (error.response) {
        errorMessage = error.response.data.message;
        errorMessage =
          errorMessage === "USERNAME_IS_NOT_AVAILABLE"
            ? "Username/Email is not available"
            : errorMessage;
      }
      dispatch(setSignupError(errorMessage));
    })
    .then(function () {
      // always executed
    });
};

const getMainCategoriesBegin = () => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.GET_MAIN_CATEGORIES_BEGIN,
  });
  dispatch({
    type: ACTIONS.GET_MAIN_CATEGORIES.PENDING,
    loading: true,
  });
  axios({
    method: "get",
    url: `${BASE_URL}/Catagories`,
  })
    .then(function (response) {
      dispatch({
        type: ACTIONS.GET_MAIN_CATEGORIES.SUCCESS,
        loading: false,
        data: response.data,
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.GET_MAIN_CATEGORIES.ERROR,
        loading: false,
        error: true,
      });
    });
};

const getTablesBegin = () => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.GET_TABLES_BEGIN,
  });
  dispatch({
    type: ACTIONS.GET_TABLES.PENDING,
    loading: true,
  });
  axios({
    method: "get",
    url: `${BASE_URL}/Tables`,
  })
    .then(function (response) {
      dispatch({
        type: ACTIONS.GET_TABLES.SUCCESS,
        loading: false,
        data: response.data,
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.GET_TABLES.ERROR,
        loading: false,
        error: true,
      });
    })
    .then(function () {
      // always executed
    });
};

const getWaitersBegin = () => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.GET_WAITERS_BEGIN,
  });
  dispatch({
    type: ACTIONS.GET_WAITERS.PENDING,
    loading: true,
  });
  axios({
    method: "get",
    url: `${BASE_URL}/Waiters`,
  })
    .then(function (response) {
      dispatch({
        type: ACTIONS.GET_WAITERS.SUCCESS,
        loading: false,
        data: response.data,
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.GET_WAITERS.ERROR,
        loading: false,
        error: true,
      });
    })
    .then(function () {
      // always executed
    });
};

const getSalesPersonBegin = () => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.GET_SALES_PERSON_BEGIN,
  });
  dispatch({
    type: ACTIONS.GET_SALES_PERSON.PENDING,
    loading: true,
  });
  axios({
    method: "get",
    url: `${BASE_URL}/SalePerson`,
  })
    .then(function (response) {
      dispatch({
        type: ACTIONS.GET_SALES_PERSON.SUCCESS,
        loading: false,
        data: response.data,
      });
      dispatch({ type: ACTIONS.SET_REFRESH_DATA, isRefresh: false });
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.GET_SALES_PERSON.ERROR,
        loading: false,
        error: true,
      });
      dispatch({ type: ACTIONS.SET_REFRESH_DATA, isRefresh: false });
    });
};

const getOrdersByLoggedInWaiter =
  (waiterId, selectedDate) => async (dispatch) => {
    if (!isBaseUrlSet) await setBaseUrl();

    dispatch({
      type: ACTIONS.GET_ORDER_DETAILS_BEGIN,
    });

    dispatch({
      type: ACTIONS.GET_ORDER_BY_WAITER_ID.PENDING,
      loading: true,
    });
    axios({
      method: "get",
      url: `${BASE_URL}/GetOrdersByWaiterId/${waiterId}?date=${selectedDate}`,
    })
      .then(function (response) {
        dispatch({
          type: ACTIONS.GET_ORDER_BY_WAITER_ID.SUCCESS,
          loading: false,
          data: response.data,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
        dispatch({
          type: ACTIONS.GET_ORDER_BY_WAITER_ID.ERROR,
          loading: false,
          error: true,
        });
      });
  };

const getOrderDetails = (orderNo) => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.GET_ORDER_DETAILS_BEGIN,
  });
  dispatch({
    type: ACTIONS.GET_ORDER_DETAILS.PENDING,
    loading: true,
  });
  axios({
    method: "get",
    url: `${BASE_URL}/GetOrderDetails/${orderNo}`,
  })
    .then(function (response) {
      dispatch({
        type: ACTIONS.GET_ORDER_DETAILS.SUCCESS,
        loading: false,
        data: response.data,
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.GET_ORDER_DETAILS.ERROR,
        loading: false,
        error: true,
      });
    });
};

const getSubCategoriesByIdBegin =
  (id, selectedCategoryId) => async (dispatch) => {
    if (!isBaseUrlSet) await setBaseUrl();

    dispatch({
      type: ACTIONS.GET_SUBCATEGORIES_BY_ID_BEGIN,
    });
    dispatch({
      type: ACTIONS.SET_SELECTED_CATEGORY_ID,
      id: selectedCategoryId,
    });
    dispatch({
      type: ACTIONS.GET_SUBCATEGORIES_BY_ID.PENDING,
      loading: true,
    });
    axios({
      method: "get",
      url: `${BASE_URL}/Items/${id}`,
    })
      .then(function (response) {
        dispatch({
          type: ACTIONS.GET_SUBCATEGORIES_BY_ID.SUCCESS,
          loading: false,
          data: response.data,
          categoryId: id,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
        dispatch({
          type: ACTIONS.GET_SUBCATEGORIES_BY_ID.ERROR,
          loading: false,
          error: true,
        });
      })
      .then(function () {
        // always executed
      });
  };

export const setSelectedCategory = (id) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_SELECTED_CATEGORY_ID,
    id,
  });
};

export const setSelectedSubCategoryItems = (subCategoryItem) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_SELECTED_SUB_CATEGORY_ITEM,
    subCategoryItem,
  });
};

export const saveOrderBegin = (payload) => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.SAVE_ORDER_BEGIN,
  });
  dispatch({
    type: ACTIONS.SAVE_ORDER.PENDING,
    loading: true,
  });
  axios
    .post(`${BASE_URL}/Save`, payload)
    .then(function (response) {
      dispatch({
        type: ACTIONS.SAVE_ORDER.SUCCESS,
        loading: false,
        data: response.data,
      });

      dispatch(actions.setEditMode(false));
      setTimeout(() => {
        dispatch({
          type: ACTIONS.RESET_NOTIFICATION,
          isOrderSaved: false,
        });
        dispatch({
          type: ACTIONS.RESET_ORDER_NO,
        });
        dispatch({
          type: ACTIONS.RESET_STATE,
        });
        dispatch(actions.getTablesBegin());
      }, 3000);
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.SAVE_ORDER.ERROR,
        loading: false,
        isError: true,
        message: error.response.data,
      });
    })
    .finally(() => {
      setTimeout(() => {
        dispatch({
          type: ACTIONS.RESET_ERROR_STATE,
          isError: false,
          message: "",
        });
      }, 3000);
    });
};

export const updateOrderBegin = (payload) => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  dispatch({
    type: ACTIONS.UPDATE_ORDER_BEGIN,
  });
  dispatch({
    type: ACTIONS.UPDATE_ORDER.PENDING,
    loading: true,
  });
  axios
    .post(`${BASE_URL}/UpdateOrder`, payload)
    .then(function (response) {
      dispatch({
        type: ACTIONS.UPDATE_ORDER.SUCCESS,
        loading: false,
        data: response.data,
      });
      dispatch(actions.setEditMode(false));
      // setTimeout(() => {
      //   dispatch({
      //     type: ACTIONS.RESET_NOTIFICATION,
      //     isOrderSaved: false,
      //     isError: false,
      //   });
      // }, 3000);
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.UPDATE_ORDER.ERROR,
        loading: false,
        isError: true,
        message: error.response.data,
      });
    })
    .finally(() => {
      setTimeout(() => {
        dispatch({
          type: ACTIONS.RESET_ERROR_STATE,
          isError: false,
        });
      }, 3000);
    });
};

// Update Password
export const updatePasswordBegin = (payload) => async (dispatch) => {
  if (!isBaseUrlSet) await setBaseUrl();

  console.log("Payload", payload);
  dispatch({
    type: ACTIONS.UPDATE_PASSWORD_BEGIN,
  });
  dispatch({
    type: ACTIONS.UPDATE_PASSWORD.PENDING,
    loading: true,
  });
  axios
    .post(`${BASE_URL}/UpdatePassword`, payload)
    .then(function (response) {
      dispatch({
        type: ACTIONS.UPDATE_PASSWORD.SUCCESS,
        loading: false,
        data: response.data,
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error.response);
      dispatch({
        type: ACTIONS.UPDATE_PASSWORD.ERROR,
        loading: false,
        isError: true,
        message: error.response.data,
      });
    })
    .finally(() => {
      setTimeout(() => {
        dispatch({
          type: ACTIONS.RESET_ERROR_STATE,
          isError: false,
        });
      }, 3000);
    });
};

// Get Dashboard Data

export const getDataFromDashboard =
  (fromDate, toDate, userId, branchCode) => async (dispatch) => {
    if (!isBaseUrlSet) await setBaseUrl();

    // debugger;
    // Format the date exactly as required
    const formattedFromDate = dayjs(fromDate).format("MM-DD-YYYY hh:mm:ss A");
    const formattedToDate = dayjs(toDate).format("MM-DD-YYYY hh:mm:ss A");

    // Construct the URL manually to prevent encoding
    const url = `${BASE_URL}/GetDataForDashboard?fromDate=${formattedFromDate}&toDate=${formattedToDate}&userId=${userId}&branchCode=${branchCode}`;

    dispatch({ type: ACTIONS.GET_DASHBOARD_DATA.PENDING });

    axios
      .get(url) // Do NOT pass `params` to prevent auto-encoding
      .then((response) => {
        dispatch({
          type: ACTIONS.GET_DASHBOARD_DATA.SUCCESS,
          data: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.GET_DASHBOARD_DATA.ERROR,
          error: error.message,
        });
      });
  };

export const setItemsQuantity =
  (quantity = 0, rowId) =>
  (dispatch) => {
    dispatch({
      type: ACTIONS.SET_ITEM_QUANTITY,
      quantity,
      rowId,
    });
  };

export const resetState = () => (dispatch) => {
  dispatch({
    type: ACTIONS.RESET_STATE,
  });
};

export const setRemarks = (remarks) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_REMARKS,
    remarks,
  });
};

export const setGuests = (noOfGuests) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_NO_OF_GUESTS,
    noOfGuests,
  });
};

export const setSelectedSalePerson = (salePersonId) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_SELECTED_WAITER,
    salePersonId,
  });
};

export const setSelectedTable = (tableId) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_SELECTED_TABLE,
    tableId,
  });
};

export const deleteSelectedItem = (item) => (dispatch) => {
  dispatch({
    type: ACTIONS.DELETE_SELECTED_ITEM,
    item,
  });
};

export const setEditMode = (isEdit) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_EDIT_MODE,
    data: isEdit,
  });
};

export const setRefreshStatus = (isRefresh) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET_REFRESH_DATA,
    isRefresh,
  });
};

const logOut = () => {
  return {
    type: ACTIONS.LOG_OUT,
  };
};

export const actions = {
  setUser,
  logOut,
  signIn,
  signUp,
  setLoginError,
  setSignupError,
  getMainCategoriesBegin,
  getTablesBegin,
  getWaitersBegin,
  getSalesPersonBegin,
  getSubCategoriesByIdBegin,
  setSelectedCategory,
  setSelectedSubCategoryItems,
  setItemsQuantity,
  setRemarks,
  setSelectedSalePerson,
  setSelectedTable,
  saveOrderBegin,
  deleteSelectedItem,
  getOrdersByLoggedInWaiter,
  getOrderDetails,
  setEditMode,
  updateOrderBegin,
  updatePasswordBegin,
  resetState,
  setGuests,
  setRefreshStatus,
  getDataFromDashboard,
};
