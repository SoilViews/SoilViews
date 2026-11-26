import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase/config";

export function uploadFile(path, file, onProgress) {
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(ref(storage, path), file);
    task.on(
      "state_changed",
      (snap) => onProgress && onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      () => getDownloadURL(task.snapshot.ref).then(resolve, reject)
    );
  });
}

export const getDownloadUrl = (path) => getDownloadURL(ref(storage, path));

export async function listFolder(path) {
  const res = await listAll(ref(storage, path));
  return Promise.all(
    res.items.map(async (item) => ({
      name: item.name,
      fullPath: item.fullPath,
      url: await getDownloadURL(item),
    }))
  );
}
