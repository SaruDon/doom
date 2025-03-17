import { useState } from "react";
import Card from "./Card";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

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

      {!callDetails ? (
        <div>
          <MeetingModal
            isOpen={meetingState === "isScheduleMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Create meeting"
            className="text-center"
            handleClick={createMeeting}
            buttonText="Schedule Meeting"
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-base text-normal leading-[22px] text-sky-100">
                Add a description
              </label>
              <Textarea
                className="border-none bg-[#21253b] focus-visible:ring-0 focus-visible-ring-offset-0"
                onChange={(e) => {
                  setValue({ ...value, description: e.target.value });
                }}
              />
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-base text-normal leading-[22px] text-sky-100">
                  Select date and time
                </label>
                <ReactDatePicker
                  selected={value.dateTime}
                  onChange={(date) => setValue({ ...value, dateTime: date! })}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d,yyyy h:mm aa"
                  className="w-full rounded bg-[#21253b] p-2 focus:outline-none"
                />
              </div>
            </div>
          </MeetingModal>
        </div>
      ) : (
        <div>
          <MeetingModal
            isOpen={meetingState === "isScheduleMeeting"}
            onClose={() => setMeetingState(undefined)}
            title="Meeting Created"
            className="text-center"
            buttonText="Copy Meeting Link"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast.success("link copy");
            }}
            image="/icons/checked.svg"
            buttonIcon="icons/copy.svg"
          />
        </div>
      )}
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === "isJoinMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type Link here"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={() => router.push(value.link)}
      >
        <Input
          placeholder="Meeting Link"
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-[#1C1F2E]"
          onChange={(e) => setValue({ ...value, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
