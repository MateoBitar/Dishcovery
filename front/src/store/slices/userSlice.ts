// userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient } from "../../api/client";
import * as queries from "../../api/graphql.queries";
import { UserProfile } from "../../typings";

// User state interface
interface UserState {
  currentProfile: UserProfile | null;
  userProfiles: Record<string, UserProfile>;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  currentProfile: null,
  userProfiles: {},
  followersCount: 0,
  followingCount: 0,
  isFollowing: false,
  loading: false,
  error: null,
};

// Async Thunks
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getUserProfile: UserProfile }>(
        queries.GET_USER_PROFILE,
        { user_id: userId }
      );
      return response.getUserProfile;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    }
  }
);

// Lightweight user lookup with cache guard
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{
        getUserById: {
          user_id: string;
          username: string;
          user_desc?: string;
          diet_pref?: string;
        };
      }>(queries.GET_USER_BY_ID, { user_id: userId });
      return response.getUserById;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user by id"
      );
    }
  },
  {
    condition: (userId, { getState }) => {
      const state = getState() as { user: UserState };
      // Skip dispatch if already cached
      return !state.user.userProfiles[userId];
    },
  }
);

export const followUser = createAsyncThunk(
  "user/follow",
  async (
    { followerId, followingId }: { followerId: string; followingId: string },
    { rejectWithValue }
  ) => {
    try {
      await GraphQLClient.request(queries.FOLLOW_USER_MUTATION, {
        follower_id: followerId,
        following_id: followingId,
      });
      return followingId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to follow user"
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollow",
  async (
    { followerId, followingId }: { followerId: string; followingId: string },
    { rejectWithValue }
  ) => {
    try {
      await GraphQLClient.request(queries.UNFOLLOW_USER_MUTATION, {
        follower_id: followerId,
        following_id: followingId,
      });
      return followingId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to unfollow user"
      );
    }
  }
);

export const checkIsFollowing = createAsyncThunk(
  "user/checkIsFollowing",
  async (
    { followerId, followingId }: { followerId: string; followingId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await GraphQLClient.request<{ isFollowing: boolean }>(
        queries.IS_FOLLOWING,
        { follower_id: followerId, following_id: followingId }
      );
      return response.isFollowing;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to check following status"
      );
    }
  }
);

export const getFollowersCount = createAsyncThunk(
  "user/getFollowersCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getFollowersCount: number }>(
        queries.GET_FOLLOWERS_COUNT,
        { user_id: userId }
      );
      return response.getFollowersCount;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch followers count"
      );
    }
  }
);

export const getFollowingCount = createAsyncThunk(
  "user/getFollowingCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await GraphQLClient.request<{ getFollowingCount: number }>(
        queries.GET_FOLLOWING_COUNT,
        { user_id: userId }
      );
      return response.getFollowingCount;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch following count"
      );
    }
  }
);

// Slice

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Full profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        state.userProfiles[action.payload.user.user_id] = action.payload;
        state.followersCount = action.payload.followersCount;
        state.followingCount = action.payload.followingCount;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Lightweight user
      .addCase(getUserById.fulfilled, (state, action) => {
        const user = action.payload;
        state.userProfiles[user.user_id] = {
          user,
          followersCount: 0,
          followingCount: 0,
          savedRecipes: [],
          userRecipes: [],
        };
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Follow / Unfollow
      .addCase(followUser.fulfilled, (state) => {
        state.isFollowing = true;
      })
      .addCase(unfollowUser.fulfilled, (state) => {
        state.isFollowing = false;
      })

      // Following checks
      .addCase(checkIsFollowing.fulfilled, (state, action) => {
        state.isFollowing = action.payload;
      })

      // Counts
      .addCase(getFollowersCount.fulfilled, (state, action) => {
        state.followersCount = action.payload;
      })
      .addCase(getFollowingCount.fulfilled, (state, action) => {
        state.followingCount = action.payload;
      });
  },
});

export const { clearError, clearCurrentProfile } = userSlice.actions;
export default userSlice.reducer;