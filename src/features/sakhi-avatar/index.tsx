import { cn } from "@/lib/classnames";
import Image from "next/image";

type SakhiAvatarProps = {
  containerProps?: React.ComponentPropsWithoutRef<"div">;
};

export default function SakhiAvatar({ containerProps }: SakhiAvatarProps) {
  return (
    <div
      {...containerProps}
      className={cn(
        "shrink-0 h-[200px] w-[200px] lg:h-[400px] lg:w-[400px]",
        containerProps?.className
      )}
    >
      <Image
        src="/avatar.png"
        alt="hero"
        width={400}
        height={400}
        style={{ maxWidth: "100%", height: " 100%" }}
      />
    </div>
  );
}
