import {
  MenuRoot,
  MenuContent,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { pagesAPI } from "../api/pages";
import { ConfirmModal } from "./ConfirmModal";

interface PageActionMenuProps {
  pageId: string;
  pageTitle: string;
  status: "draft" | "published";
  onEdit: () => void;
  onDuplicate: (newPage: any) => void;
  onDelete: () => void;
  onStatusChange: (newStatus: "draft" | "published") => void;
}

export function PageActionMenu({
  pageId,
  pageTitle,
  status,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}: PageActionMenuProps) {
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleDuplicate = async () => {
    try {
      setLoading(true);
      const newPage = await pagesAPI.duplicate(pageId);
      onDuplicate(newPage);
      alert(`✓ Page duplicated: "${newPage.title}"`);
    } catch (error: any) {
      alert(`✗ Error: ${error.message || "Failed to duplicate page"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await pagesAPI.delete(pageId);
      setDeleteConfirm(false);
      onDelete();
      alert(`✓ Page deleted: "${pageTitle}"`);
    } catch (error: any) {
      alert(`✗ Error: ${error.message || "Failed to delete page"}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      setLoading(true);
      const newStatus = status === "draft" ? "published" : "draft";
      if (newStatus === "published") {
        await pagesAPI.publish(pageId);
      } else {
        await pagesAPI.unpublish(pageId);
      }
      onStatusChange(newStatus);
      alert(`✓ Page ${newStatus === "published" ? "published" : "unpublished"}`);
    } catch (error: any) {
      alert(`✗ Error: ${error.message || "Failed to update page status"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MenuRoot>
        <IconButton
          variant="ghost"
          size="sm"
          disabled={loading}
          aria-label="Page actions"
        >
          ⋮
        </IconButton>
        <MenuContent>
          <MenuItem value="edit" onClick={onEdit} disabled={loading}>
            Edit
          </MenuItem>
          <MenuItem value="duplicate" onClick={handleDuplicate} disabled={loading}>
            Duplicate
          </MenuItem>
          <MenuItem
            value="publish"
            onClick={handlePublishToggle}
            disabled={loading}
          >
            {status === "draft" ? "Publish" : "Unpublish"}
          </MenuItem>
          <MenuItem
            value="delete"
            onClick={() => setDeleteConfirm(true)}
            disabled={loading}
            color="red.600"
          >
            Delete
          </MenuItem>
        </MenuContent>
      </MenuRoot>

      <ConfirmModal
        isOpen={deleteConfirm}
        title="Delete Page"
        description={`Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </>
  );
}
