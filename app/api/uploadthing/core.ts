// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
// Comment out auth imports for now
// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 6,
    },
  })
    .middleware(async () => {
      // .middleware(async ({ req }) => {
      // Temporarily bypass auth checks
      // const user = await auth();
      // if (!user.userId) throw new UploadThingError("Unauthorized");

      // Return a dummy userId for now
      return { userId: "temp-user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
