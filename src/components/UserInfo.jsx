"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function UserInfo({ profile, imagesCount }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(profile?.followers || 0);
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState("");

  const toggleFollow = () => {
    if (isFollowing) {
      setFollowers((prev) => prev - 1);
    } else {
      setFollowers((prev) => prev + 1);
    }
    setIsFollowing((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    // FRONTEND SUCCESS ONLY
    toast.success("Message sent successfully!");

    // Reset fields
    setMessage("");
    setOpenMessage(false);
  };

  return (
    <div className="flex items-center gap-6 mb-12">
      {/* Avatar */}
      <Avatar className="w-24 h-24 border-4 border-purple-500">
        <AvatarImage src={profile?.imageUrl} />
        <AvatarFallback className="bg-linear-to-br from-purple-500 to-blue-600 text-white text-3xl">
          {profile?.username?.charAt(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-3xl font-semibold">@{profile?.username}</h1>

          {/* FOLLOW + MESSAGE BUTTONS */}
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleFollow}
              className={`px-6 py-1 rounded-lg font-semibold transition-all`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>

            <Button
              variant="outline"
              className="px-6 py-1 rounded-lg"
              onClick={() => setOpenMessage(true)}
            >
              Message
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 text-gray-700 font-medium text-sm">
          <span>
            <strong>{imagesCount}</strong> posts
          </span>
          <span>
            <strong>{followers}</strong> followers
          </span>
          <span>
            <strong>{profile?.following || 0}</strong> following
          </span>
        </div>

        {/* Full Name */}
        <p className="font-semibold text-gray-800">
          {profile?.fullName || "No name added"}
        </p>
      </div>

      {/* MESSAGE DIALOG */}
      <Dialog open={openMessage} onOpenChange={setOpenMessage}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Message @{profile?.username}</DialogTitle>
          </DialogHeader>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 border rounded-xl p-3 mt-4 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write your message..."
          />

          <Button
            onClick={handleSendMessage}
            className="mt-4 w-full py-2 text-md"
          >
            Send Message
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
