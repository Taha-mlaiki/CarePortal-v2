"use client";
import { useState, useRef } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { useUserState } from "@/store/userStore";
import { Skeleton } from "@/components/ui/skeleton";

export const NotificationFeed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const user = useUserState((state) => state.user);
  const notifButtonRef = useRef(null);
  if (!user) {
    return <Skeleton className="w-10 h-10 rounded-full" />;
  }

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY as string}
      userId={user ? String(user.id) : ""}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_CHANNEL_ID as string}
      >
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};
