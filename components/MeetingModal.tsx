import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";

interface MeetingModal {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  buttonText?: string;
  handleClick?: () => void;
  image?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  buttonText,
  handleClick,
  image,
  buttonIcon,
}: MeetingModal) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-[#1C1F2E] px-6 py-9 text-white">
          <DialogHeader className="gap-y-5">
            <DialogTitle className="text-center">{title}</DialogTitle>
            <div>
              {image && (
                <div className="flex flex-col items-center justify-center">
                  <Image src={image} alt="image" width={72} height={72} />
                </div>
              )}
            </div>
          </DialogHeader>
          <Button
            className="bg-[#0E78F9] focus-visible:ring-0
          focus-visible:ring-offset-0"
            onClick={handleClick}
          >
            {buttonIcon && (
              <div>
                <Image
                  src={buttonIcon}
                  alt="buttonIcon"
                  width={13}
                  height={13}
                />
              </div>
            )}
            {buttonText}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingModal;
