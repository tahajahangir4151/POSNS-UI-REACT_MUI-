import ACTIONS from "./app.constants";
import { uniqBy } from "lodash";
const initialState = {
  profileName: null,
  isLoggedIn: false,
  isFetching: false,
  jwt: null,
  loginError: null,
  signupError: null,
  selectedItems: [],
  isRefresh: true,
  };

const currentUser = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        profileName: action.payload.username,
        loggedInUserId: action.payload.userId,
        userType: action.payload.userType,
        branchCode: action.payload.branchCode,
        isLoggedIn: true,
        isFetching: false,
        jwt: action.payload.jwt,
        loginError: null,
      };
    case ACTIONS.LOG_OUT: {
      return initialState;
    }
    case ACTIONS.SIGN_IN:
      return {
        ...state,
        isFetching: true,
        loginError: null,
      };
    case ACTIONS.SIGN_UP:
      return {
        ...state,
        isFetching: true,
        signupError: null,
      };
    case ACTIONS.SIGN_UP_COMPLETE:
      return {
        ...state,
        isFetching: false,
        signupError: null,
      };
    case ACTIONS.SET_LOGIN_ERROR:
      return {
        ...state,
        isFetching: false,
        loginError: action.payload.error,
      };
    case ACTIONS.SET_SIGNUP_ERROR:
      return {
        ...state,
        isFetching: false,
        signupError: action.payload.error,
      };

    case ACTIONS.GET_MAIN_CATEGORIES.PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case ACTIONS.GET_MAIN_CATEGORIES.SUCCESS:
      const formattedCategories = action.data.map((item) => {
        return {
          id: item.descriptionCode,
          name: item.description,
        };
      });

      return {
        ...state,
        isFetching: false,
        mainCategories: { name: "Main Category", data: formattedCategories },
      };
    case ACTIONS.GET_MAIN_CATEGORIES.ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
      };

    case ACTIONS.GET_TABLES.PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case ACTIONS.GET_TABLES.SUCCESS:
      const formattedTablesList = action.data.map((item) => {
        return {
          ...item,
          id: item.tableCode,
        };
      });
      return {
        ...state,
        isFetching: false,
        tables: { name: "Tables", data: formattedTablesList },
      };
    case ACTIONS.GET_TABLES.ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
      };

    case ACTIONS.GET_WAITERS.PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case ACTIONS.GET_WAITERS.SUCCESS:
      const formattedWaitersList = action.data.map((item) => {
        return {
          ...item,
          id: item.empNo,
        };
      });
      return {
        ...state,
        isFetching: false,
        waiters: { name: "Waiters", data: formattedWaitersList },
      };
    case ACTIONS.GET_WAITERS.ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
      };

    case ACTIONS.GET_SALES_PERSON.PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case ACTIONS.GET_SALES_PERSON.SUCCESS:
      const formattedSalePersonsList = action.data.map((item) => {
        return {
          name: item.loginName,
          id: item.userId,
        };
      });
      return {
        ...state,
        isFetching: false,
        salePersons: { name: "SalePersons", data: formattedSalePersonsList },
      };
    case ACTIONS.GET_SALES_PERSON.ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
      };

    case ACTIONS.GET_SUBCATEGORIES_BY_ID.PENDING:
      return {
        ...state,
        subCategories: {
          ...state.subCategories,
          subCategoryFetching: true,
        },
      };
    case ACTIONS.GET_SUBCATEGORIES_BY_ID.SUCCESS:
      const formattedSubCategories = action.data.map((item) => {
        return {
          ...item,
          id: item.itemCode,
        };
      });

      return {
        ...state,
        subCategories: {
          ...state.subCategories,
          subCategoryFetching: false,
          name: "SubCategories",
          categoryId: action.categoryId,
          [action.categoryId]: formattedSubCategories,
        },
      };
    case ACTIONS.GET_SUBCATEGORIES_BY_ID.ERROR:
      return {
        ...state,
        subCategories: {
          subCategoryFetching: false,
        },
        isError: true,
      };

    case ACTIONS.SET_SELECTED_CATEGORY_ID: {
      return {
        ...state,
        selectedCategory: action.id,
      };
    }

    case ACTIONS.SET_SELECTED_SUB_CATEGORY_ITEM: {
      const prevSelectedItems = state.selectedItems ?? [];
      const selectedItems = [...prevSelectedItems, action.subCategoryItem];
      const currentItem = action.subCategoryItem;
      const isEditMode = state.isEdit;

      const uniqueList = uniqBy(selectedItems, "id");

      //  [
      //   ...new Map(selectedItems.map((item) => [item["id"], item])).values(),
      // ];

      const originalQuantity =
        uniqueList.find((item) => item.id === currentItem.id)
          .originalQuantity ?? 0;

      const prevQuantity =
        uniqueList.find((item) => item.id === currentItem.id).quantity ?? 0;
      const isPrevItemOld =
        uniqueList.find((item) => item.id === currentItem.id).isItemOld ??
        false;
      console.log("isPrevItemOld", isPrevItemOld);
      const currentQuantity = (uniqueList.find(
        (item) => item.id === currentItem.id
      ).quantity = prevQuantity + 1);

      isEditMode &&
        (uniqueList.find((item) => item.id === currentItem.id).updatedQuantity =
          currentQuantity - originalQuantity);

      // isEditMode &&
      //   (uniqueList.find(
      //     (item) => item.id === currentItem.id
      //   ).isItemOld = false);
      //   debugger
      return {
        ...state,
        selectedItems: uniqueList,
      };
    }
    case ACTIONS.SET_ITEM_QUANTITY: {
      const updatedList = [...state.selectedItems];
      updatedList.find((item) => item.id === action.rowId).quantity =
        action.quantity > 1 ? action.quantity : 1;
      return {
        ...state,
        selectedItems: updatedList,
      };
    }
    case ACTIONS.SET_REMARKS: {
      return {
        ...state,
        remarks: action.remarks,
      };
    }

    case ACTIONS.SET_NO_OF_GUESTS: {
      return {
        ...state,
        noOfGuests: action.noOfGuests,
      };
    }

    case ACTIONS.SET_SELECTED_WAITER: {
      return {
        ...state,
        selectedSalePerson: action.salePersonId,
      };
    }

    case ACTIONS.SET_SELECTED_TABLE: {
      return {
        ...state,
        selectedTable: action.tableId,
      };
    }

    case ACTIONS.SAVE_ORDER.PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case ACTIONS.SAVE_ORDER.SUCCESS: {
      const mainCategories = state.mainCategories.data;
      const subCategories = state.subCategories;
      const orderNo = action.data;
      const remarks = state.remarks;

      mainCategories.forEach((category) => {
        subCategories[category.id] &&
          subCategories[category.id].forEach((item) => (item.quantity = 0));
      });

      return {
        ...state,
        subCategories: subCategories,
        selectedSalePerson: "",
        remarks: remarks,
        isFetching: false,
        isOrderSaved: true,
        orderNo: orderNo,
      };
    }
    case ACTIONS.SAVE_ORDER.ERROR: {
      return {
        ...state,
        isError: true,
        isFetching: false,
        message: action.message,
      };
    }

    case ACTIONS.RESET_ORDER_NO: {
      return {
        ...state,
        orderNo: 0,
      };
    }

    case ACTIONS.UPDATE_ORDER.PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case ACTIONS.UPDATE_ORDER.SUCCESS: {
      const mainCategories = state.mainCategories.data;
      const subCategories = state.subCategories;
      // debugger
      mainCategories.forEach((category) => {
        subCategories[category.id] &&
          subCategories[category.id].forEach((item) => (item.quantity = 0));
      });

      return {
        ...state,
        //selectedItems: [],
        subCategories: subCategories,
        selectedTable: "",
        selectedSalePerson: "",
        remarks: "",
        isFetching: false,
        isOrderSaved: true,
        noOfGuests: "",
        isError: false,
      };
    }
    case ACTIONS.UPDATE_ORDER.ERROR: {
      return {
        ...state,
        isFetching: false,
        isError: true,
        message: action.message,
      };
    }

    //Update Password

    case ACTIONS.UPDATE_PASSWORD.PENDING:
      return {
        ...state,
      };

    case ACTIONS.UPDATE_PASSWORD.SUCCESS:
      return {
        ...state,
        isError: false,
        message: action.message, // ✅ Store success message
      };

    case ACTIONS.UPDATE_PASSWORD.ERROR:
      return {
        ...state,
        isError: true,
        message: action.message, // ✅ Store error message
      };

    case ACTIONS.RESET_NOTIFICATION: {
      return {
        ...state,
        isOrderSaved: false,
        isError: false,
        selectedTable: "",
        selectedItems: [],
      };
    }

    case ACTIONS.RESET_ERROR_STATE: {
      return {
        ...state,
        isOrderSaved: false,
        isError: false,
        // selectedTable: "",
        // selectedItems: [],
        // noOfGuests: 0,
        // isEdit:false,
        // selectedTableName:'',
        // remarks: "",
        // message:'',
        // selectedSalePerson: null,
      };
    }

    case ACTIONS.DELETE_SELECTED_ITEM: {
      const filteredItems = state.selectedItems.filter(
        (item) => item.id !== action.item.id
      );
      const subCategories = state.subCategories;
      subCategories[+action.item.mainCat].find(
        (item) => item.itemCode === action.item.id
      ).quantity = 0;

      return {
        ...state,
        selectedItems: filteredItems,
        subCategories: subCategories,
      };
    }

    case ACTIONS.GET_ORDER_BY_WAITER_ID.PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case ACTIONS.GET_ORDER_BY_WAITER_ID.SUCCESS:
      return {
        ...state,
        isFetching: false,
        orders: action.data,
      };
    case ACTIONS.GET_ORDER_BY_WAITER_ID.ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
      };

    case ACTIONS.GET_ORDER_DETAILS.PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case ACTIONS.GET_ORDER_DETAILS.SUCCESS:
      return {
        ...state,
        isFetching: false,
        selectedItems: action.data,
        remarks: action.data[0].remarks,
        selectedSalePerson: action.data[0].selectedSalePerson,
        selectedTable: action.data[0].tableCode,
        selectedTableName: action.data[0].tableName,
        noOfGuests: action.data[0].noOfGuests,
      };
    case ACTIONS.GET_ORDER_DETAILS.ERROR:
      return {
        ...state,
        isFetching: false,
        isError: true,
      };

    case ACTIONS.SET_EDIT_MODE: {
      return {
        ...state,
        isEdit: action.data,
      };
    }

    case ACTIONS.RESET_STATE: {
      const mainCategories = state.mainCategories.data;
      const subCategories = state.subCategories;

      mainCategories.forEach((category) => {
        subCategories[category.id] &&
          subCategories[category.id].forEach((item) => (item.quantity = 0));
      });
      return {
        ...state,
        noOfGuests: "",
        selectedItems: [],
        subCategories: subCategories,
        selectedTable: "",
        selectedSalePerson: "",
        remarks: "",
        isFetching: false,
        isOrderSaved: false,
        isEdit: false,
      };
    }
    case ACTIONS.SET_REFRESH_DATA: {
      return {
        ...state,
        isRefresh: action.isRefresh,
      };
    }
    case ACTIONS.GET_DASHBOARD_DATA.PENDING:
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          isFetching: true,
          error: null,
        },
      };
    case ACTIONS.GET_DASHBOARD_DATA.SUCCESS:
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          isFetching: false,
          data: action.data,
        },
      };
    case ACTIONS.GET_DASHBOARD_DATA.ERROR:
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          isFetching: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
};

export default currentUser;
