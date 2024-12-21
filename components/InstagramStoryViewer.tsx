"use client"; // Ensures the component runs only on the client side

import { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import { request_urls } from "@/data";
import { fetchSocialPosts } from "@/utils/fetchSocialPosts";
import { fetchSocialHighlights } from "@/utils/fetchSocialHighlights";
import { Button as UIButton } from "./ui/MovingBorders";
import MagicButton from "../components/MagicButton";
import { FiDownload } from "react-icons/fi";
import InstagramProfileCard from "./ui/InstagramProfileCard";
import { fetchUserProfile } from "@/utils/fetchUserProfile";
import "./components.css";

type SelectedTab = keyof typeof request_urls;

interface InstagramProfileData {
  username: string;
  fullName: string;
  biography: string;
  hd_profile_pic_url_info: {
    url: string;
  };
  media_count: number;
  follower_count: number;
  following_count: number;
  isVerified: boolean;
}

interface HighlightItem {
  id: string;
  cover_media: any;
  title: string;
}

interface PostItem {
  id: string;
  media_type: number;
  video_url: string;
  image_versions: any;
}

const InstagramStoryViewer = () => {
  const [username, setUsername] = useState("");
  const [stories, setStories] = useState<PostItem[] | null>(null);
  const [highlights, setHighlights] = useState<HighlightItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("posts");
  const [isDownloadingMedia, setIsDownloadingMedia] = useState<Record<number, boolean>>({});
  const [isFetchProfile, setisFetchProfile] = useState(false);
  const [profileData, setProfileData] = useState<InstagramProfileData | null>(null);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await fetchUserProfile(username);
      setProfileData(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (username && loading && isFetchProfile) fetchProfile();
  }, [username, loading, isFetchProfile]);

  const fetchStories = async (e?: any, profileFetchMode?: boolean) => {
    e?.preventDefault();
    if (!username) return;

    if (profileFetchMode) setisFetchProfile(true);
    setLoading(true);
    setError(null);
    setStories([]);

    try {
      const data: any = await fetchSocialPosts(selectedTab, username);

      if (!data.length) return setError(`No ${selectedTab} found.`);
      if (selectedTab === "highlights") {
        return setHighlights(data);
      } else {
        return setStories(data);
      }
    } catch (error: any) {
      const errorStr: string = error.toString();
      if (errorStr.includes("status: 404")) {
        setError(`Cannot fetch data from a Private Account`);
      } else {
        setError(`Failed to fetch ${selectedTab}. Please try again later.`);
      }
    } finally {
      if (profileFetchMode) setisFetchProfile(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchStories();
  }, [selectedTab]);

  const handleClickHighlight = async (item: any) => {
    if (!item) return;

    setLoading(true);
    setError(null);
    setStories([]);

    try {
      const data: any = await fetchSocialHighlights(item.id);
      setStories(data);
    } catch (error) {
      setError("Failed to fetch highlights. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const downloadMedia = async (url: string, fileName: string, index: number) => {
    if (typeof document === "undefined") return; // Ensure this only runs on the client side
    try {
      setIsDownloadingMedia((prev) => ({ ...prev, [index]: true }));
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading video:", error);
    } finally {
      setIsDownloadingMedia((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <UIButton
      style={{
        cursor: "auto",
        width: "100%",
        background: "rgb(4,7,29)",
        backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        borderRadius: `calc(1.75rem * 0.96)`,
        margin: "auto",
      }}
    >
      <div
        className="w-full p-5 bg-gray-900 text-white rounded-md"
        style={{
          background: "rgb(4,7,29)",
          backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
          borderRadius: `calc(1.75rem * 0.96)`,
        }}
      >
        {/* Input Section */}
        <div className="mb-0 relative">
          <form onSubmit={(e) => fetchStories(e, true)}>
            <input
              type="text"
              placeholder="Enter Instagram Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="inp-sec w-full rounded bg-gray-700 text-white focus:outline-none pl-4 pr-12"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
            >
              {/* Search Icon */}
            </button>
          </form>
        </div>

        {/* Tabs, Stories, Highlights, and Error Handling */}
        {/* Remaining JSX Code */}
      </div>
    </UIButton>
  );
};

export default InstagramStoryViewer;
