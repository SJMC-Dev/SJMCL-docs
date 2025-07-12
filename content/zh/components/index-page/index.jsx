import { VStack, Heading, Highlight } from "@chakra-ui/react";
import DownloadButton from './download-button';

export default function IndexPageComponents() {
  return (
    <VStack mt={8} spacing={8} id="chakra-scope">
      <Heading>
        <Highlight query="新一代" styles={{ color: 'blue.500' }}>
        新一代开源跨平台 Minecraft 启动器
        </Highlight>
      </Heading>
      <DownloadButton />
    </VStack>
  );
}