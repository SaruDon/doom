import { useState } from "react";
import Card from "./Card";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";

const MeetingTypeList = () => {
  const router = useRouter();

  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoinMeeting" | "isInstantMeeting" | undefined
  >();

  const [value, setValue] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!client || !user) {
      return;
    }
    try {
      if (!value.dateTime) {
        toast.error("please select date and time");
        return;
      }
      const id = crypto.randomUUID(); //create random id
      const call = client.call("default", id);

      if (!call) {
        throw new Error("Failed to connect");
      }

      const startAt =
        value.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = value.description || "Instant Meeting";
      await call.getOrCreate({
        data: {
          starts_at: startAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);
      if (!value.description) {
        router.push(`/meeting/${id}`);
      }
      toast.success("Meeting created");
    } catch (error) {
      console.log(error);
      toast.error("failed to create meeting");
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-[#ff742e]"
      />
      <Card
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-[#0e78f9]"
      />
      <Card
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-500"
      />
      <Card
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link meeting"
        handleClick={() => setMeetingState("isJoinMeeting")}
        className="bg-yellow-500"
      />
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
