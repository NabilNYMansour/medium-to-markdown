import { LoadingOverlay } from "@mantine/core";

export default function Loading() {
  return <div>
    <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: "sm", blur: 1, backgroundOpacity: 0.1 }} />
  </div>;
}