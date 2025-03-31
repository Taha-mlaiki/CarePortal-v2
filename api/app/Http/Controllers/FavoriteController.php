<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $req)
    {
        $user = $req->user;
        $searchTerm = $req->query('searchTerm', '');

        $query = Favorite::where('patient_id', $user->id)->with('cabinet');

        if ($searchTerm) {
            $query->whereHas('cabinet', function ($query) use ($searchTerm) {
                $query->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('address', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('city', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('speciality', 'LIKE', "%{$searchTerm}%");
            });
        }

        $cabinets = $query->get()
            ->pluck('cabinet')
            ->filter() // Remove null values
            ->values(); // Reset array keys

        return response()->json(['favorites' => $cabinets]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cabinetId' => 'required|exists:cabinets,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => "error here no id exist"], 422);
        }
        try {
            Favorite::create([
                'patient_id' => $request->user->id,
                'cabinet_id' => $request->cabinetId,
            ]);

            return response()->json(['success' => "You added this cabinet to your favorites"], 201);
        } catch (\Throwable $th) {
            return response()->json(["error", $th->getMessage()], 500);
        }
    }

    public function favoritedIds(Request $request)
    {
        $user_id = $request->user->id;
        $favoritedIds = Favorite::where("patient_id", $user_id)->pluck("cabinet_id");
        return response()->json(["favoritedIds" => $favoritedIds]);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function deleteById(Request $req, $id)
    {


        if (!$id) {
            return response()->json(['error' => "CabinetId is required"], 422);
        }

        try {
            $user_id = $req->user->id;
            $favorite = Favorite::where('cabinet_id', $id)
                ->where('patient_id', $user_id)
                ->first();
            if ($favorite) {
                $favorite->delete();
                return response()->json(['success' => "You removed this cabinet from your favorites"], 200);
            }
        } catch (\Throwable $th) {
            return response()->json(["error", $th->getMessage()], 500);
        }
    }
    public function deleteAll(Request $req)
    {

        try {
            $user_id = $req->user->id;
            $favorite = Favorite::where('patient_id', $user_id);
            if ($favorite) {
                $favorite->delete();
                return response()->json(['success' => "All favorited cabinets are removed"], 200);
            }
        } catch (\Throwable $th) {
            return response()->json(["error", $th->getMessage()], 500);
        }
    }
}
