// useUser.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  getUserProfile,
  getUserById,
  followUser,
  unfollowUser,
  checkIsFollowing,
  getFollowersCount,
  getFollowingCount,
} from "../store/slices/userSlice";

// useUser hook
export function useUser() {
  const dispatch = useAppDispatch();
  const {
    currentProfile,
    userProfiles,
    followersCount,
    followingCount,
    isFollowing,
    loading,
    error,
  } = useAppSelector((state) => state.user);

  // Full profile
  const handleGetUserProfile = useCallback(async (userId: string) => {
    try {
      return await dispatch(getUserProfile(userId)).unwrap();
    } catch (err) {
      console.error("Get user profile error:", err);
      return null;
    }
  }, [dispatch]);

  // Lightweight user lookup with cache
  const handleGetUserById = useCallback(async (userId: string) => {
    try {
      const cached = userProfiles[userId];
      if (cached) return cached.user;
      return await dispatch(getUserById(userId)).unwrap();
    } catch (err) {
      console.error("Get user by id error:", err);
      return null;
    }
  }, [dispatch, userProfiles]);

  // Follow user function
  const handleFollowUser = useCallback(async (followerId: string, followingId: string) => {
    try {
      await dispatch(followUser({ followerId, followingId })).unwrap();
      return true;
    } catch (err) {
      console.error("Follow user error:", err);
      return false;
    }
  }, [dispatch]);

  // Unfollow user function
  const handleUnfollowUser = useCallback(async (followerId: string, followingId: string) => {
    try {
      await dispatch(unfollowUser({ followerId, followingId })).unwrap();
      return true;
    } catch (err) {
      console.error("Unfollow user error:", err);
      return false;
    }
  }, [dispatch]);

  // Check if following function
  const handleCheckIsFollowing = useCallback(async (followerId: string, followingId: string) => {
    try {
      return await dispatch(checkIsFollowing({ followerId, followingId })).unwrap();
    } catch (err) {
      console.error("Check following error:", err);
      return false;
    }
  }, [dispatch]);

  // Get followers count function
  const handleGetFollowersCount = useCallback(async (userId: string) => {
    try {
      return await dispatch(getFollowersCount(userId)).unwrap();
    } catch (err) {
      console.error("Get followers count error:", err);
      return 0;
    }
  }, [dispatch]);

  // Get following count function
  const handleGetFollowingCount = useCallback(async (userId: string) => {
    try {
      return await dispatch(getFollowingCount(userId)).unwrap();
    } catch (err) {
      console.error("Get following count error:", err);
      return 0;
    }
  }, [dispatch]);

  return {
    currentProfile,
    userProfiles,
    followersCount,
    followingCount,
    isFollowing,
    loading,
    error,
    getUserProfile: handleGetUserProfile,
    getUserById: handleGetUserById,
    followUser: handleFollowUser,
    unfollowUser: handleUnfollowUser,
    checkIsFollowing: handleCheckIsFollowing,
    getFollowersCount: handleGetFollowersCount,
    getFollowingCount: handleGetFollowingCount,
  };
}