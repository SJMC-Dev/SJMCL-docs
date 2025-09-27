import { VStack, Heading, Highlight } from "@chakra-ui/react";
import DownloadButton from "./download-button";

export default function IndexPageComponents() {
  return (
    <VStack mt={8} spacing={8} id="chakra-scope">
      <Heading>
        <Highlight query="Next-gen" styles={{ color: "blue.500" }}>
          Next‑generation open-source cross‑platform Minecraft launcher
        </Highlight>
      </Heading>
      <DownloadButton />
    </VStack>
  );
}
