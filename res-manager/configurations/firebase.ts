import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAUwshAAvCvcUr7DdajG1tlNj0sOVGPvXw",
    authDomain: "pos-restaurant-30dcc.firebaseapp.com",
    projectId: "pos-restaurant-30dcc",
    storageBucket: "pos-restaurant-30dcc.appspot.com",
    messagingSenderId: "368280705300",
    appId: "1:368280705300:web:4f1fd373ef01cc182e8a01",
    measurementId: "G-WCEY5KN2D7",
};

export const app = initializeApp(firebaseConfig, "Restaurant-App");

export const authentication = getAuth(app);

export const handleUpload = async (file: File) => {
    if (!file) {
        alert("Please upload an image first!");
    }

    const storage = getStorage(app, "gs://pos-restaurant-30dcc.appspot.com");

    const refStorage = ref(storage, file.name);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    await uploadBytesResumable(refStorage, file);
    return await getDownloadURL(refStorage);
};
