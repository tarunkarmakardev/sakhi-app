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
        "shrink-0 aspect-square border-primary border-2 rounded-full",
        containerProps?.className,
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
