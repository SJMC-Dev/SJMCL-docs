"use client";

import { useEffect, useState } from "react";
import { Button, HStack, VStack, Text } from "@chakra-ui/react";
import { FaApple } from "react-icons/fa6";
import { LuGrid2X2, LuArrowDownToLine } from "react-icons/lu";
const DOWNLOAD_LINKS = {
  win32: { label: "下载 Windows (32位) 版", icon: <LuGrid2X2 /> },
  win64: { label: "下载 Windows (64位) 版", icon: <LuGrid2X2 /> },
  macos_arm: { label: "下载 macOS (Apple Silicon) 版", icon: <FaApple /> },
  macos_intel: { label: "下载 macOS (Intel) 版", icon: <FaApple /> },
  linux: { label: "下载 Linux 版", icon: <LuArrowDownToLine /> },
  fallback: { label: "下载", icon: <LuArrowDownToLine /> },
};

export default function DownloadButton() {
  const [download, setDownload] = useState(DOWNLOAD_LINKS.fallback);
  const [latestVersion, setLatestVersion] = useState("Loading...");
  const [downloadLink, setDownloadLink] = useState("#");
  const [currentPlatformKey, setCurrentPlatformKey] = useState("fallback");
  const getLatestVersion = async () => {
    const response = await fetch(
      "https://api.github.com/repos/UnikeEN/SJMCL/releases/latest"
    );
    const data = await response.json();
    return data.tag_name.slice(1) || "Unknown";
  };
  const getDownloadLink = (version, platform) => {
    const baseUrl = "https://mc.sjtu.cn/sjmcl/releases/";
    switch (platform) {
      case "win32":
        return `${baseUrl}SJMCL_${version}_windows_i686_portable.exe`;
      case "win64":
        return `${baseUrl}SJMCL_${version}_windows_x86_64_portable.exe`;
      case "macos_arm":
        return `${baseUrl}SJMCL_${version}_macos_aarch64.dmg`;
      case "macos_intel":
        return `${baseUrl}SJMCL_${version}_macos_x86_64.dmg`;
      case "linux":
        return `${baseUrl}SJMCL_${version}_linux_x86_64.AppImage`;
      default:
        return "#";
    }
  };
  useEffect(() => {
    const detectPlatformAndVersion = async () => {
      const platform = navigator.platform.toLowerCase();
      const ua = navigator.userAgent.toLowerCase();
      const version = await getLatestVersion();
      setLatestVersion(version);
      let platformKey = "unknown";
      if (platform.includes("win")) {
        if (
          ua.includes("x64") ||
          ua.includes("win64") ||
          ua.includes("wow64")
        ) {
          setDownload(DOWNLOAD_LINKS.win64);
          platformKey = "win64";
        } else {
          setDownload(DOWNLOAD_LINKS.win32);
          platformKey = "win32";
        }
      } else if (platform.includes("mac")) {
        if (
          ua.includes("arm") ||
          ua.includes("aarch64") ||
          ua.includes("apple")
        ) {
          setDownload(DOWNLOAD_LINKS.macos_arm);
          platformKey = "macos_arm";
        } else {
          setDownload(DOWNLOAD_LINKS.macos_intel);
          platformKey = "macos_intel";
        }
      } else if (platform.includes("linux")) {
        setDownload(DOWNLOAD_LINKS.linux);
        platformKey = "linux";
      }

      setCurrentPlatformKey(platformKey);
      setDownloadLink(getDownloadLink(version, platformKey));
    };
    detectPlatformAndVersion();
  }, []);

  return (
    <>
      <VStack spacing={2}>
        <Button
          colorScheme="blue"
          size="lg"
          leftIcon={download.icon}
          as="a"
          href={downloadLink}
          download
        >
          {download.label}
        </Button>
        <HStack
          divider={
            <Text fontSize="sm" mx={1} className="secondary-text">
              ·
            </Text>
          }
        >
          <Text fontSize="sm" className="secondary-text">
            最新版本 {latestVersion}
          </Text>
          <Button
            variant="link"
            size="sm"
            fontWeight="normal"
            cursor={"pointer"}
          >
            全部版本
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
