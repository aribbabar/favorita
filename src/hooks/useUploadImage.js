// react
import { useContext } from "react";

// firebase
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig";

// contexts
import { UserContext } from "../contexts/UserContext";

export function useUploadImage() {
  const { user, dispatch } = useContext(UserContext);

  async function uploadImage(favoriteTitle, imageFile) {
    if (!favoriteTitle || !imageFile) {
      return "";
    }

    const trimmedTitle = favoriteTitle.replace(/ /g, "");
    let imageStorageRef = "";
    let imageRef = null;

    imageStorageRef = ref(
      storage,
      `${user.uid}/images/${trimmedTitle}/${imageFile.name}`
    );

    imageRef = await uploadBytes(imageStorageRef, imageFile);

    return imageRef;
  }

  return { uploadImage };
}
