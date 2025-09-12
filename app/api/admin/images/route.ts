import { type NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth-server";
import fs from "fs";
import path from "path";

interface ImageFile {
  name: string;
  originalName: string;
  size: number;
  created: string;
  path: string;
  url: string;
  type: string;
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuthAPI(request);
    // if (!authResult.success) {
    //   return NextResponse.json({ error: authResult.error }, { status: 401 })
    // }
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "images");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const images: ImageFile[] = [];

    // Recursively scan upload directories
    function scanDirectory(dir: string, relativePath = "") {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          scanDirectory(itemPath, path.join(relativePath, item));
        } else if (stats.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(item)) {
          const fileExtension = path.extname(item).toLowerCase();
          const mimeTypes: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
          };

          images.push({
            name: item,
            originalName: item,
            size: stats.size,
            created: stats.birthtime.toISOString(),
            path: relativePath,
            url: `/uploads/images/${path
              .join(relativePath, item)
              .replace(/\\/g, "/")}`,
            type: mimeTypes[fileExtension] || "image/jpeg",
          });
        }
      }
    }

    scanDirectory(uploadsDir);

    // Sort by creation date (newest first)
    images.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error("List images error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuthAPI(request);
    // if (!authResult.success) {
    //   return NextResponse.json({ error: authResult.error }, { status: 401 })
    // }
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { imagePath } = body;

    if (!imagePath) {
      return NextResponse.json(
        { error: "Image path is required" },
        { status: 400 }
      );
    }

    // Security check - ensure path is within uploads directory
    if (imagePath.includes("..") || !imagePath.startsWith("/uploads/images/")) {
      return NextResponse.json(
        { error: "Invalid image path" },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), "public", imagePath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    fs.unlinkSync(fullPath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
