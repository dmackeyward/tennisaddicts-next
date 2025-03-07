"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";
import { handleModalNavigation } from "@/utils/device";

interface ModalLinkButtonProps extends ButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function ModalLinkButton({
  href,
  children,
  ...buttonProps
}: ModalLinkButtonProps) {
  // Handle click - set the skipModal flag if on mobile
  const handleClick = () => {
    handleModalNavigation(href);
  };

  // Use the same pattern as ListingCard - Button wrapping Link
  return (
    <Button {...buttonProps} asChild>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}
