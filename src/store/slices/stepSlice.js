import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Fetch all steps
export const getSteps = createAsyncThunk(
  "steps/getSteps",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/steps");
      return data.steps; // Return steps array based on new API structure
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch steps"
      );
    }
  }
);

// Get specific step
export const getStepById = createAsyncThunk(
  "steps/getStepById",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/steps/${id}`);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch step"
      );
    }
  }
);

// Create step
export const createStep = createAsyncThunk(
  "steps/createStep",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/steps", payload);
      return data.data || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create step"
      );
    }
  }
);

// Update step
export const updateStep = createAsyncThunk(
  "steps/updateStep",
  async ({ id, payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/steps/${id}`, payload);
      return data.data || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update step"
      );
    }
  }
);

// Delete step
export const deleteStep = createAsyncThunk(
  "steps/deleteStep",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/steps/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete step"
      );
    }
  }
);

const stepSlice = createSlice({
  name: "steps",
  initialState: {
    steps: [],
    currentStep: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStep: (state) => {
      state.currentStep = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getSteps
      .addCase(getSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSteps.fulfilled, (state, action) => {
        state.loading = false;
        state.steps = action.payload; // sorted by stepOrder if backend handles it, otherwise: .sort((a,b) => a.stepOrder - b.stepOrder)
      })
      .addCase(getSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getStepById
      .addCase(getStepById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStepById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStep = action.payload;
      })
      .addCase(getStepById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createStep
      .addCase(createStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStep.fulfilled, (state, action) => {
        state.loading = false;
        state.steps.push(action.payload);
      })
      .addCase(createStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateStep
      .addCase(updateStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStep.fulfilled, (state, action) => {
        state.loading = false;
        state.steps = state.steps.map((step) =>
          step._id === action.payload._id ? action.payload : step
        );
        if (state.currentStep?._id === action.payload._id) {
          state.currentStep = action.payload;
        }
      })
      .addCase(updateStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteStep
      .addCase(deleteStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStep.fulfilled, (state, action) => {
        state.loading = false;
        state.steps = state.steps.filter((step) => step._id !== action.payload);
        if (state.currentStep?._id === action.payload) {
          state.currentStep = null;
        }
      })
      .addCase(deleteStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentStep, clearError } = stepSlice.actions;
export default stepSlice.reducer;
