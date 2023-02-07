// react
import { useContext, useState } from "react";

// firebase
import { storage } from "../firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

// contexts
import { UserContext } from "../routes/root";

export function useUploadImage(favoriteTitle, imageFile) {
  if (!favoriteTitle || !imageFile) {
    return;
  }

  const [uploadedImage, setUploadedImage] = useState(null);

  async function uploadImage() {
    const { user, dispatch } = useContext(UserContext);

    const trimmedTitle = favoriteTitle.replace(/ /g, "");
    let imageStorageRef = "";
    let imageRef = null;

    imageStorageRef = ref(
      storage,
      `${user.uid}/images/${trimmedTitle}/${imageFile.name}`
    );

    imageRef = await uploadBytes(imageStorageRef, imageFile);

    setUploadedImage(imageRef);
  }

  return { uploadImage, uploadImage };
}
