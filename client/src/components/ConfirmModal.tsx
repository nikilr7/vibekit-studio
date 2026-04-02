import {
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef(null);

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader fontSize="lg" fontWeight="bold">
          {title}
        </DialogHeader>

        <DialogBody>{description}</DialogBody>

        <DialogFooter gap={2}>
          <Button ref={cancelRef} onClick={onCancel} variant="outline">
            {cancelText}
          </Button>
          <Button
            colorScheme={isDangerous ? "red" : "blue"}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
