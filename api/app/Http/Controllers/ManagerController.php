<?php

namespace App\Http\Controllers;

use App\Models\Cabinet;
use App\Services\FileManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ManagerController extends Controller
{

    protected $fileManager;

    public function __construct(FileManager $fileManager)
    {
        $this->fileManager = $fileManager;
    }
    public function managerCabinet(Request $req)
    {
        $user = $req->user;
        $cabinet = Cabinet::where('manager_id', $user->id)->first();
        if (!$cabinet) {
            return response()->json(['error' => 'Cabinet not found'], 404);
        }
        return response()->json([
            'cabinet' => $cabinet,
        ], 200);
    }

    public function updateCabinet(Request $request)
    {
        try {
            $user = $request->user;

            // Validation rules
            $validator = Validator::make($request->all(), [
                'id' => 'required|exists:cabinets,id',
                'name' => 'required|string|max:255',
                'doctor_name' => 'required|string|max:255',
                'speciality' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'location_link' => 'required|string|url|max:255',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:1024', // New file optional
                'existing_thumbnail' => 'nullable|string', // Existing path optional
                'images' => 'nullable|array|min:1',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'existing_images' => 'nullable|array',
                'existing_images.*' => 'string',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'description' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Find the cabinet
            $cabinet = Cabinet::where('manager_id', $user->id)->findOrFail($request->id);

            // Handle thumbnail (never null)
            $thumbnailPath = $cabinet->thumbnail; // Default to current thumbnail
            if ($request->hasFile('thumbnail')) {
                // New thumbnail uploaded
                if ($cabinet->thumbnail !== $request->input('existing_thumbnail')) {
                    $this->fileManager->removeThumbnail($cabinet->thumbnail);
                }
                $thumbnailPath = $this->fileManager->uploadThumbnail($request->file('thumbnail'));
            } elseif ($request->has('existing_thumbnail')) {
                // Use provided existing thumbnail
                $thumbnailPath = $request->input('existing_thumbnail');
            }

            // Handle images
            $existingImages = $request->input('existing_images', []);
            $newImages = $request->hasFile('images') ? $request->file('images') : [];
            $currentImages = $cabinet->images ? json_decode($cabinet->images, true) : [];

            // Remove old images not in updated list
            $imagesToKeep = array_merge($existingImages, array_map(fn($path) => basename($path), $newImages));
            foreach ($currentImages as $oldImage) {
                if (!in_array($oldImage, $imagesToKeep)) {
                    $this->fileManager->removeImages([$oldImage]);
                }
            }

            // Upload new images
            $newImagePaths = $newImages ? $this->fileManager->uploadImages($newImages) : [];
            $updatedImagePaths = array_merge($existingImages, $newImagePaths);

            // Update the cabinet
            $cabinet->update([
                'name' => $request->name,
                'doctor_name' => $request->doctor_name,
                'speciality' => $request->speciality,
                'address' => $request->address,
                'city' => $request->city,
                'location_link' => $request->location_link,
                'thumbnail' => $thumbnailPath, // Always a valid path
                'images' => json_encode($updatedImagePaths),
                'email' => $request->email,
                'phone' => $request->phone,
                'description' => $request->description,
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => 'Cabinet updated successfully',
                'cabinet' => $cabinet,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
