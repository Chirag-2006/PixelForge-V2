"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ImageCard from "./ImageCard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import {
  deleteImageById,
  getUserImages,
  publishImageById,
} from "@/app/api/images/imageActions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
/**
 * DashboardClientPage
 * - Fetches user's images (created)
 * - Shows stat cards and a modern gallery
 * - Allows publishing private images and deleting images (frontend + API calls)
 *
 * Backend endpoints used (UNCHANGED):
 *  - POST /api/images/publish  { imageId }  -> expected returns ok + maybe image data
 *  - POST /api/images/delete   { imageId }  -> expected returns ok
 *
 * This component only updates UI on success; it doesn't change server logic.
 */
export default function DashboardClientPage() {
  const { user, isLoaded } = useUser();

  const [created, setCreated] = useState([]);
  const [published, setPublished] = useState([]);
  const [privateImgs, setPrivateImgs] = useState([]);
  const [loading, setLoading] = useState(true);

  // PUBLISH MODAL STATES
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishId, setPublishId] = useState(null);

  // DELETE MODAL STATES
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch user images
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await getUserImages(user.id);

        const createdImages = data || [];
        const publishedImages = createdImages.filter((i) => i.isPublished);
        const privateImages = createdImages.filter((i) => !i.isPublished);

        setCreated(createdImages);
        setPublished(publishedImages);
        setPrivateImgs(privateImages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user?.id, isLoaded]);

  // open publish dialog
  const openPublishDialog = (id) => {
    setPublishId(id);
    setPublishModalOpen(true);

    console.log("publish id: ", id);
  };

  // Publish Image Handling
  const publishConfirm = async () => {
    try {
      console.log("publish id: ", publishId);
      const data = await publishImageById(publishId);

      if (!data.success) {
        toast.error("Failed to publish image");
        return;
      }
      toast.success("Image published!");

      // UI update frontend-only
      setCreated((prev) =>
        prev.map((img) =>
          img.id === publishId ? { ...img, isPublished: true } : img
        )
      );
      setPrivateImgs((prev) => prev.filter((i) => i.id !== publishId));
      setPublished((prev) => [
        ...prev,
        created.find((i) => i.id === publishId),
      ]);
    } catch (error) {
      toast.error("Failed to publish");
    } finally {
      setPublishModalOpen(false);
    }
  };

  // Open modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
    console.log("delete id:", id);
  };

  // Perform Delete
  const performDelete = async () => {
    console.log("delete id:", deleteId);
    const data = await deleteImageById(deleteId);

    if (data.error) {
      toast.error(data.error);
      return;
    }

    if (!data.success) {
      toast.error("Failed to delete image");
      return;
    }

    toast.success("Image deleted!");

    setCreated((prev) => prev.filter((i) => i.id !== deleteId));
    setPublished((prev) => prev.filter((i) => i.id !== deleteId));
    setPrivateImgs((prev) => prev.filter((i) => i.id !== deleteId));

    setDeleteModalOpen(false);
  };

  // Modern Premium Loading Skeleton
  if (!isLoaded || loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-6 w-40 rounded-lg" />
        </div>

        {/* Tabs Skeleton */}
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>

        {/* Image Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-56 md:h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (created.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Dashboard</h1>
        <p className="text-gray-500 text-xl">
          No images yet. Create your first image!
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header + Stats */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold">
            My <span className="text-purple-600">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-2">Manage your creations</p>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-3 md:flex gap-3 md:gap-4 w-full md:w-auto">
          <Card className="p-4 text-center shadow-lg rounded-xl">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4 text-center shadow-lg rounded-xl">
            <p className="text-xs text-gray-500">Published</p>
            <p className="text-xl font-bold">{stats.published}</p>
          </Card>
          <Card className="p-4 text-center shadow-lg rounded-xl">
            <p className="text-xs text-gray-500">Private</p>
            <p className="text-xl font-bold">{stats.private}</p>
          </Card>
        </div> */}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid grid-cols-3 w-full h-24 md:h-12">
          <TabsTrigger value="created">Created ({created.length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({published.length})
          </TabsTrigger>
          <TabsTrigger value="private">
            Private ({privateImgs.length})
          </TabsTrigger>
        </TabsList>
        {/* <Separator className="mb-3" /> */}

        {/* Created */}
        <TabsContent value="created" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
            {created.map((img) => (
              <ImageCard
                key={img.id}
                url={img.url}
                published={img.isPublished}
                onPublish={() => openPublishDialog(img.id)}
                onDelete={() => confirmDelete(img.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Published */}
        <TabsContent value="published" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
            {published.map((img) => (
              <ImageCard
                key={img.id}
                url={img.url}
                published={true}
                onDelete={() => confirmDelete(img.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Private */}
        <TabsContent value="private" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
            {privateImgs.map((img) => (
              <ImageCard
                key={img.id}
                url={img.url}
                published={false}
                onPublish={() => openPublishDialog(img.id)}
                onDelete={() => confirmDelete(img.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* PUBLISH MODAL */}
      <Dialog open={publishModalOpen} onOpenChange={setPublishModalOpen}>
        <DialogContent className="rounded-xl md:max-w-md max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Publish this image?</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Once published, this image becomes visible on Explore page.
            </p>
          </DialogHeader>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              className="w-full hidden md:block md:w-auto"
              onClick={() => setPublishModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-purple-600 text-white w-full md:w-auto"
              onClick={publishConfirm}
            >
              Publish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="rounded-xl md:max-w-md max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Delete Image?</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              You cannot undo this action.
            </p>
          </DialogHeader>

          <div className="flex gap-3 justify-end mt-6 ">
            <Button
              variant="outline"
              className="w-1/2 md:w-auto"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 text-white w-1/2 md:w-auto"
              onClick={performDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
