import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoreState {
  userData: any;
  uid: string;
  token: any;
  refreshToken: any;
  sessionExpired: boolean;
  rrg: string;
  studyId: string;
  study: any;
  reportData: any
  reportContent: string
  setReportContent: (data: string) => void
  setReportData: (data: any) => void
  setStudy: (data: any) => void;
  setStudyId: (data: any) => void;
  setRRG: (data: any) => void;  // Set the rrg (optional) for use in other parts of the app, e.g., in the header component.  It's recommended to use this instead of directly accessing the 'userData' object.  This allows for easier data management and scalability.  The 'userData' object should remain private and only be accessed through this store.  This ensures that any changes to the 'userData' object are automatically reflected in
  setUid: (data: any) => void;  // Set the user's uid (optional) for use in other parts of the app, e.g., in the header component.  It's recommended to use this instead of directly accessing the 'userData' object.  This allows for easier data management and scalability.  The 'userData' object should remain private and only be accessed through this store.  This ensures that any changes to the 'userData' object are automatically reflected in
  setUserData: (data: any) => void;
  setToken: (data: any) => void;
  setRefreshToken: (data: any) => void;
  setSessionExpired: (data: any) => void;
}

const useUserStore = create<StoreState>()(
  persist(
    (set) => ({
      userData: {},
      uid: '',
      token: '',
      study:{},
      studyId:'',
      refreshToken: '',
      sessionExpired: false,
      rrg: '',
      reportData: {},
      reportContent: '',
      setReportContent: (data) => set({ reportContent: data }),
      setReportData: (data) => set({ reportData: data }),
      setStudy: (data) => set({ study: data }),
      setStudyId: (data) => set({ studyId: data }),
      setRRG: (data) => set({ rrg: data }), // Set the rrg (optional)
      setUid: (data) => set({ uid: data }), // Set the user's uid
      setUserData: (data) => set({ userData: data }),
      setToken: (data) => set({ token: data }),
      setRefreshToken: (data) => set({ refreshToken: data }),
      setSessionExpired: (data) => set({ sessionExpired: data }),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useUserStore;