import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  isPrivate: boolean;
}

interface FollowRequest {
  requestBy: UserInfo;
  requestTo: UserInfo;
  requestToken: string;
  status: string;
  isExpired: boolean;
  _id: string;
}

interface FollowRequestState {
  followRequests: FollowRequest[];
}

const initialState: FollowRequestState = {
  followRequests: [],
};

const followRequestSlice = createSlice({
  name: 'followRequests',
  initialState,
  reducers: {
    setFollowRequests: (state, action: PayloadAction<FollowRequest[]>) => {
      state.followRequests = action.payload.filter((req) => !req.isExpired);
    },
    addFollowRequest: (state, action: PayloadAction<FollowRequest>) => {
      if (!action.payload.isExpired) {
        state.followRequests.push(action.payload);
      }
    },
    removeFollowRequest: (state, action: PayloadAction<string>) => {
      state.followRequests = state.followRequests.filter(
        (req) => req.requestToken !== action.payload
      );
    },
  },
});

export const { setFollowRequests, addFollowRequest, removeFollowRequest } =
  followRequestSlice.actions;
export default followRequestSlice.reducer;
