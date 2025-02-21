import React, { createContext, useReducer, ReactNode } from "react";
import { ActionType } from "../constants/actions/action.enum";
import { User } from "../models/user/user.model";
import { Question } from "../models/carousel/assessment.model";
import { Snackbar } from "../models/global/snackbar.model";

// Define State Type
interface State {
  user: User[] | null;
  userError: string | null;

  questions: Question[];
  questionsError: string | null;
  curIndex: number;

  isModalOpen: boolean;

  complete: boolean;
  snackbars: Snackbar[];
}

// Initial State
const initialState: State = {
  user: [],
  userError: null,

  questions: [],
  questionsError: null,

  curIndex: 0,

  isModalOpen: true,

  complete: false,
  snackbars: [
    {
      message: "",
      show: false,
      severity: "info", 
      close: () => {},
    },
  ],
};

type Action =
  | { type: ActionType.SET_USER; payload: User[] }
  | { type: ActionType.SET_USER_ERROR; payload: string }
  // | { type: ActionType.SET_USER_LOADING; payload: boolean }
  | { type: ActionType.SET_QUESTIONS; payload: Question[] }
  | { type: ActionType.SET_CURRENT_QUESTION_INDEX; payload: number }
  | { type: ActionType.SET_QUESTIONS_ERROR; payload: string }
  // | { type: ActionType.SET_QUESTIONS_LOADING; payload: boolean }
  | { type: ActionType.TOGGLE_MODAL; payload: boolean }
  | { type: ActionType.SET_COMPLETE; payload: boolean }
  | { type: ActionType.SET_SNACKBAR; payload: Snackbar[] };

// Reducer Function
// Reducer Function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_USER:
      return { ...state, user: Array.isArray(action.payload) ? [...action.payload] : [] };
    case ActionType.SET_USER_ERROR:
      return { ...state, userError: action.payload };
    // case ActionType.SET_USER_LOADING:
    //   return { ...state, userLoading: action.payload };

    case ActionType.SET_QUESTIONS:
      return { ...state, questions: Array.isArray(action.payload) ? [...action.payload] : []};
    case ActionType.SET_QUESTIONS_ERROR:
      return { ...state, questionsError: action.payload };
    // case ActionType.SET_QUESTIONS_LOADING:
    //   return { ...state, questionsLoading: action.payload };
    case ActionType.SET_CURRENT_QUESTION_INDEX:
      return { ...state, curIndex: action.payload };

    case ActionType.TOGGLE_MODAL:
      return {
        ...state,
        isModalOpen:
          action.payload !== undefined ? action.payload : !state.isModalOpen,
      };

    case ActionType.SET_COMPLETE:
      return { ...state, complete: action.payload };
    case ActionType.SET_SNACKBAR:
      return { ...state, snackbars: [...action.payload] };

    default:
      return state;
  }
};

// Define Context Type
interface StoreContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

// Create Context with Default Value
export const StoreContext = createContext<StoreContextProps | undefined>(
  undefined
);

// Provider Component
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
