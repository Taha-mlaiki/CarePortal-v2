<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function commentable(Request $req)
    {
        $user = $req->user;
        $cabinetIds = Appointment::where('patient_id', $user->id)
            ->where('status', 'Scheduled')
            ->pluck('cabinet_id')
            ->unique()
            ->values()
            ->all();
        return response()->json(['cabinetIds' => $cabinetIds], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $comment = Comment::create([
            'patient_id' => $user->id,
            'cabinet_id' => $request->cabinetId,
            'content' => $request->content,
        ]);
        $comment->load('patient');

        return response()->json(['comment' => $comment], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user;
        $comment = Comment::where("id", $id)->where("patient_id", $user->id)->first();
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }
        $comment->update(['content' => $request->content]);
        $comment->load('patient');
        return response()->json(['comment' => $comment], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user;
        $comment =  Comment::where("id", $id)->where("patient_id", $user->id)->first();
        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }
        $comment->delete();
        return response()->json(null, 204);
    }
}
