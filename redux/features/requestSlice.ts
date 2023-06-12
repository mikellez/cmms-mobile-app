import { createSlice } from '@reduxjs/toolkit';
import { CMMSRequest, CMMSUser } from '../../types/interfaces';

interface CMMSSubmitRequestImage {
  uri?: string;
}

export interface CMMSSubmitRequest {
  id: string | number;
  description: string;
  faultTypeID: string;
  plantLocationID: string;
  requestTypeID: string;
  taggedAssetID: string;
  image?: CMMSSubmitRequestImage;
}

const initialState: CMMSSubmitRequest[] = [];

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setRequests: (state, action) => {
      return action.payload;
    },
  },
});

export const { setRequests } = requestSlice.actions;
export default requestSlice.reducer;