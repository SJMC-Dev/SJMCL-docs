"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { FaApple } from "react-icons/fa6";
import { LuGrid2X2, LuArrowDownToLine } from "react-icons/lu";
import { useEffect, useState } from "react";

const PLATFORM_CONFIG = {
  win32: {
    name: "Windows 32位",
    icon: <LuGrid2X2 />,
    filePatterns: ["windows_i686.msi", "windows_i686_portable.exe"],
  },
  win64: {
    name: "Windows 64位",
    icon: <LuGrid2X2 />,
    filePatterns: ["windows_x86_64.msi", "windows_x86_64_portable.exe"],
  },
  macos_arm: {
    name: "macOS (Apple Silicon)",
    icon: <FaApple />,
    filePatterns: ["macos_aarch64.dmg", "macos_aarch64.app.tar.gz"],
  },
  macos_intel: {
    name: "macOS (Intel)",
    icon: <FaApple />,
    filePatterns: ["macos_x86_64.dmg", "macos_x86_64.app.tar.gz"],
  },
  linux: {
    name: "Linux",
    icon: <LuArrowDownToLine />,
    filePatterns: [
      "linux_x86_64.AppImage",
      "linux_x86_64.deb",
      "linux_x86_64.rpm",
      "linux_x86_64_portable",
    ],
  },
};

export default function DownloadAllVersionModal({
  isOpen,
  onClose,
  platformKey,
}) {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllReleases = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.github.com/repos/UnikeEN/SJMCL/releases"
      );
      const data = await response.json();
      setReleases(data);
    } catch (error) {
      console.error("获取版本列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAllReleases();
    }
  }, [isOpen]);

  const generateDownloadLink = (release, pattern) => {
    if (release.tag_name === "nightly") {
      const asset = release.assets?.find((asset) =>
        asset.name.includes(pattern.split(".")[0])
      );
      return asset?.browser_download_url || "#";
    } else {
      const version = release.tag_name.startsWith("v")
        ? release.tag_name.slice(1)
        : release.tag_name;
      const baseUrl = "https://mc.sjtu.cn/sjmcl/releases/";
      if (pattern.includes(".")) {
        return `${baseUrl}SJMCL_${version}_${pattern}`;
      } else {
        return `${baseUrl}SJMCL_${version}_${pattern}`;
      }
    }
  };

  const getFileTypeName = (pattern) => {
    if (pattern.includes("portable")) return "便携版";
    if (pattern.includes(".msi")) return "MSI 安装包";
    if (pattern.includes(".exe")) return "EXE 文件";
    if (pattern.includes(".dmg")) return "DMG 镜像";
    if (pattern.includes(".tar.gz")) return "App 压缩包";
    if (pattern.includes(".AppImage")) return "AppImage";
    if (pattern.includes(".deb")) return "DEB 包";
    if (pattern.includes(".rpm")) return "RPM 包";
    return "下载";
  };

  const platform = PLATFORM_CONFIG[platformKey];

  if (!platform) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            {platform.icon}
            <Text>{platform.name} - 所有版本</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <VStack spacing={4} py={8}>
              <Spinner size="lg" />
              <Text>加载版本列表中...</Text>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch" maxH="400px" overflowY="auto">
              {releases.map((release) => (
                <VStack key={release.id} align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <HStack>
                      <Text fontWeight="bold">
                        {release.tag_name === "nightly"
                          ? "Nightly"
                          : release.tag_name}
                      </Text>
                      {release.tag_name === "nightly" && (
                        <Badge colorScheme="orange">预览版</Badge>
                      )}
                      {release.prerelease && release.tag_name !== "nightly" && (
                        <Badge colorScheme="yellow">预发布</Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(release.published_at).toLocaleDateString(
                        "zh-CN"
                      )}
                    </Text>
                  </HStack>
                  <VStack spacing={1} align="stretch" pl={4}>
                    {platform.filePatterns.map((pattern) => (
                      <HStack key={pattern} justify="space-between">
                        <Text fontSize="sm">{getFileTypeName(pattern)}</Text>
                        <Button
                          size="sm"
                          variant="outline"
                          as="a"
                          href={generateDownloadLink(release, pattern)}
                          download
                          leftIcon={<LuArrowDownToLine />}
                        >
                          下载
                        </Button>
                      </HStack>
                    ))}
                  </VStack>
                  <Divider />
                </VStack>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Text fontSize="sm" color="gray.500">
            所有版本请见:{" "}
            <Button
              as="a"
              href="https://mc.sjtu.cn/sjmcl/releases/?sort=time&order=desc"
              target="_blank"
              rel="noopener noreferrer"
              variant="link"
              size="sm"
              color="blue.500"
              textDecoration="underline"
            >
              https://mc.sjtu.cn/sjmcl/releases/
            </Button>
          </Text>
          <Button colorScheme="gray" onClick={onClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
