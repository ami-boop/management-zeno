import serviceAccount from "../../firebase-adminsdk.json";

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app =
  getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount as any),
      });

export const adminAuth = getAuth(app);