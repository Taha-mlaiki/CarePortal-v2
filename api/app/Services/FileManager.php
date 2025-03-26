<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileManager
{
    public function uploadThumbnail(UploadedFile $thumbnail, string $directory = 'cabinets/thumbnails'): ?string
    {
        if (!$thumbnail->isValid()) {
            return null;
        }

        $thumbnailName = time() . '_thumbnail.' . $thumbnail->getClientOriginalExtension();
        $thumbnailPath = $thumbnail->storeAs($directory, $thumbnailName, 'public');

        return $thumbnailPath;
    }

    public function uploadImages(array $images, string $directory = 'cabinets/images'): array
    {
        $imagePaths = [];

        foreach ($images as $image) {
            if ($image instanceof UploadedFile && $image->isValid()) {
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs($directory, $imageName, 'public');
                $imagePaths[] = $imagePath;
            }
        }

        return $imagePaths;
    }


    public function removeThumbnail(?string $thumbnailPath): bool
    {
        if ($thumbnailPath && Storage::disk('public')->exists($thumbnailPath)) {
            return Storage::disk('public')->delete($thumbnailPath);
        }
        return false;
    }

    public function removeImages($imagePaths): bool
    {
        if (!$imagePaths) {
            return true;
        }

        // Handle JSON string or array
        $paths = is_string($imagePaths) ? json_decode($imagePaths, true) : $imagePaths;
        if (!is_array($paths)) {
            return false;
        }

        $success = true;
        foreach ($paths as $path) {
            if ($path && Storage::disk('public')->exists($path)) {
                $success = $success && Storage::disk('public')->delete($path);
            }
        }

        return $success;
    }
}
