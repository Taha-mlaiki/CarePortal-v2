<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'price' => 'required|numeric|min:1',
            'period' => 'required|string|in:Monthly,Yearly',
            'description' => 'required|string|max:255',
        ]);
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $user_id = $request->user->id;

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Get access to your cabinet',
                        'description' => $request->description,
                    ],
                    'unit_amount' => $request->price * 100,
                ],
                'quantity' => 1,
            ]],
            'metadata' => [
                'period' => $request->period,
                'manager_id' => $user_id,
            ],
            'mode' => 'payment',
            'success_url' => env("FRONTEND_URL") . '/pricing/success',
            'cancel_url' => env("FRONTEND_URL") . '/pricing/cancel',
        ]);

        return response()->json(['sessionId' => $session->id]);
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, config('services.stripe.webhook_secret'));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Webhook verification failed'], 400);
            Log::error('Webhook verification failed: ' . $e->getMessage());
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $amount = $session->amount_total / 100; // Convert cents to dollars
            $period = $session->metadata->period; // From session metadata
            $managerId = $session->metadata->manager_id; // From session metadata

            // Record payment in database
            Payment::create([
                'stripe_session_id' => $session->id,
                'price' => $amount, // Use amount_total
                'period' => $period,
                'manager_id' => (int) $managerId,
            ]);
            return response()->json(['status' => 'Payment recorded']);
        }

        return response()->json(['status' => 'Event ignored']);
    }
}
