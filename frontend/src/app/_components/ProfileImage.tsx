import { UserType } from "@/types";
import React, {
  ChangeEvent,
  Dispatch,
  useRef,
  useState,
  useEffect,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { imageSrc } from "../patient/cabinets/_components/CabinetCard"; // Ensure this is correctly imported

interface ProfileImageProps {
  isEditing: boolean;
  editedProfile: Partial<UserType> & { image?: string | File };
  setEditedProfile: Dispatch<
    React.SetStateAction<Partial<UserType> & { image?: string | File }>
  >;
  user: UserType;
}

const ProfileImage = ({
  isEditing,
  editedProfile,
  setEditedProfile,
  user,
}: ProfileImageProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    //@ts-expect-error I don't know the error
    if (editedProfile.image instanceof File) {
      const url = URL.createObjectURL(editedProfile.image);
      setPreview(url);

      return () => {
        URL.revokeObjectURL(url); // Cleanup URL to avoid memory leaks
      };
    } else {
      setPreview(undefined); // Reset preview if the image is not a File
    }
  }, [editedProfile.image]);

  const previewImage = () => {
    inputRef.current?.click();
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        //@ts-expect-error I don't know the error
        setEditedProfile((prev) => ({ ...prev, image: file }));
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-32 w-32 border-4 border-background">
        <AvatarImage
          src={
            preview ||
            (typeof editedProfile.image === "string"
              ? imageSrc + editedProfile.image // Prefix the real image
              : imageSrc + user.image) // Use user's profile image if no edited one exists
          }
          alt={`${editedProfile.username || user.username}'s profile picture`}
        />
        <AvatarFallback>
          {(editedProfile.username || user.username)?.substring(0, 2) || "??"}
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-3 right-3 h-6 w-6 rounded-full"
          onClick={previewImage}
        >
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onImageChange}
            ref={inputRef}
            className="hidden"
          />
          <Camera className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default ProfileImage;
